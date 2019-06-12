
from omeroweb.webclient.decorators import login_required
from django.shortcuts import render
from omero.rtypes import wrap
from cStringIO import StringIO
from django.http import JsonResponse
import json
from omero.model import FileAnnotationI, OriginalFileI
from omero.gateway import FileAnnotationWrapper

PROJECT_NAME = "my microscopes"
JSON_FILEANN_NS = "micro-meta-app.json"

@login_required()
def index(request, conn=None, **kwargs):

    return render(request, 'microscopyMetadataTool/index.html')


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
