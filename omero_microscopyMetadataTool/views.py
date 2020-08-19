
from omeroweb.webclient.decorators import login_required
from django.shortcuts import render
from omero.rtypes import wrap, unwrap
from io import StringIO
from django.http import JsonResponse
import json
from omero.model import FileAnnotationI, OriginalFileI
from omero.gateway import FileAnnotationWrapper
from omero.sys import ParametersI
from datetime import datetime
import time

PROJECT_NAME = "Microscopes"
JSON_FILEANN_NS = "micro-meta-app.json"


@login_required()
def index(request, conn=None, **kwargs):

    return render(request, 'microscopyMetadataTool/index.html')


@login_required()
def list_microscopes(request, conn=None, **kwargs):

    params = ParametersI()
    params.addString('ns', wrap(JSON_FILEANN_NS))
    # q = """select new map(obj.id as id,
    #             obj.description as desc,
    #             o.firstName as firstName,
    #             o.lastName as lastName,
    #             e.time as time,
    #             f.name as name,
    #             obj as obj_details_permissions)
    #         from FileAnnotation obj
    #         join obj.details.owner as o
    #         join obj.details.creationEvent as e
    #         join obj.file.details as p
    #         join obj.file as f where obj.ns=:ns"""
    q = """select obj from FileAnnotation obj
            join obj.details.owner as o
            join obj.details.creationEvent as e
            join obj.file.details as p
            join obj.file as f where obj.ns=:ns"""

    qs = conn.getQueryService()
    # file_anns = qs.projection(q, params, conn.SERVICE_OPTS)
    file_anns = qs.findAllByQuery(q, params, conn.SERVICE_OPTS)
    rsp = []
    for file_ann in file_anns:
    print('fa', file_ann)
    fa_wrapper = FileAnnotationWrapper(conn, file_ann)
    file_wrapper = fa_wrapper.getFile()
    print('file_wrapper', file_wrapper)
    file_data = "".join(list(file_wrapper.getFileInChunks()))
    print('file_data', file_data)
    json_data = json.loads(file_data)
    # date = datetime.fromtimestamp(unwrap(fa['time'])/1000)
    # first_name = unwrap(file_ann)
    # last_name = unwrap(fa['lastName'])
    fig_file = {
        'id': file_ann.id.val,
        # 'name': unwrap(fa['name']),
        # 'description': unwrap(fa['desc']),
        # 'ownerFullName': "%s %s" % (first_name, last_name),
        # 'creationDate': time.mktime(date.timetuple()),
        # 'canEdit': fa['obj_details_permissions'].get('canEdit'),
        'microscope': json_data
    }
    rsp.append(fig_file)

    return JsonResponse({'data': rsp})


@login_required()
def save_microscope(request, conn=None, **kwargs):

    body_json = json.loads(request.body)
    microscope_json = body_json['microscope']

    file_name = microscope_json["Name"]

    project = conn.getObject("Project", attributes={'name': PROJECT_NAME})

    curr_gid = conn.SERVICE_OPTS.getOmeroGroup()

    if project is not None:
        gid = project.getDetails().getGroup().getId()
        conn.SERVICE_OPTS.setOmeroGroup(gid)
    else:
        # TODO: create Project
        conn.SERVICE_OPTS.setOmeroGroup(curr_gid)

    update = conn.getUpdateService()

    file_data = json.dumps(microscope_json)
    file_size = len(file_data)
    f = StringIO()
    f.write(file_data)
    orig_file = conn.createOriginalFileFromFileObj(
        f, '', file_name, file_size, mimetype="application/json")
    fa = FileAnnotationI()
    fa.setFile(OriginalFileI(orig_file.getId(), False))
    fa.setNs(wrap(JSON_FILEANN_NS))
    # fa.setDescription(wrap(desc))
    fa = update.saveAndReturnObject(fa, conn.SERVICE_OPTS)
    file_id = fa.getId().getValue()

    if project is not None:
        fa_wrapper = FileAnnotationWrapper(conn, fa)
        project.linkAnnotation(fa_wrapper)

    return JsonResponse({'file_id': file_id})
