
from json import encoder
from omeroweb.webclient.decorators import login_required
from django.shortcuts import render
from omero.rtypes import rstring, wrap, unwrap
from io import StringIO, BytesIO
from django.http import JsonResponse
from omero.model import FileAnnotationI, OriginalFileI, ProjectI
from omero.gateway import FileAnnotationWrapper
from omero.sys import ParametersI
from datetime import datetime
import time
import json

import os.path
from os.path import isfile
import subprocess
from subprocess import STDOUT, PIPE

JSON_FILEANN_NS = "micro-meta-app.json"
PROJ_NAME = "MMA_Microscopes"

SCRIPT_OMERODIR = "$OMERODATADIR"
DIR_MANAGEDREPO = os.path.sep + "ManagedRepository" + os.path.sep
SCRIPT_DIRECTORY = "/static/microMetaAppOmero/scripts/"
SCRIPT_NAME = "4DNMicroscopyMetadataReader-1.0.1.jar"


@login_required()
def index(request, conn=None, **kwargs):

    return render(request, 'microMetaAppOmero/index.html')


# def transform_data(string_date):
#    dates = string_date.split("T")
#    date = dates[0]
#    time = dates[1]
#    dateSplit = date.split("-")
#    dateYear = dateSplit[0]
#    dateMonth = dateSplit[1]
#    dateDay = dateSplit[2]
#    newDate = "" + dateDay + "/" + dateMonth + "/" + dateYear + " @ " + time
#    return newDate


@login_required()
def load_metadata(request, conn=None, **kwargs):
    body_json = json.loads(request.body)
    groupID = body_json['groupID']
    imageID = body_json['imageID']

    conn.SERVICE_OPTS.setOmeroGroup(groupID)
    image = conn.getObject("Image", imageID)

    rsp = []

    echoCMD = "echo " + SCRIPT_OMERODIR
    omeroDirectory = 0
    try:
        proc = subprocess.run(echoCMD, stdin=PIPE,
                              stdout=PIPE, stderr=STDOUT, shell=True)
        stdout = str(proc.stdout)
        stderr = str(proc.stderr)
        omeroDirectory = stdout
        omeroDirectory = omeroDirectory.replace("b'", "")
        omeroDirectory = omeroDirectory.replace("\\n'", "")
        omeroDirectory = omeroDirectory + DIR_MANAGEDREPO
        #omeroDirectory = omeroDirectory + os.path.sep
    except BaseException as err:
        error = {
            'Error': "Could not verify OMERO directory ($OMERODIR).",
            'Details': err
        }
        rsp.append(error)
        return JsonResponse({'data': error})
    fileCount = image.countImportedImageFiles()
    filePathS = 0
    if fileCount > 0:
        for orig_file in image.getImportedImageFiles():
            filePath = list(orig_file.getPath())
            subPathS = "".join(str(s) for s in filePath)
            filePathS = omeroDirectory + subPathS
            filePathS = filePathS + image.getName()
            break
    else:
        error = {
            'Error': image.getName() + " doesn't contain imported images file"
        }
        rsp.append(error)
        return JsonResponse({'data': error})

    if not isfile(filePathS):
        error = {
            'Error': filePathS + " does not exists."
        }
        rsp.append(error)
        return JsonResponse({'data': error})

    javaCmd = "java"
    checkVersionCmd = javaCmd + " -version"
    try:
        proc = subprocess.run(checkVersionCmd, stdin=PIPE,
                              stdout=PIPE, stderr=STDOUT, shell=True)
        stdout = str(proc.stdout)
        stderr = str(proc.stderr)
        javaVersion = stdout.split("\n")[0]
        javaVersion = javaVersion.replace("b'", "")
        javaVersion = javaVersion.replace("\\n'", "")
        javaVersionMain = 0
        javaVersionSub = 0
        if javaVersion.startswith("java version"):
            javaVersion = javaVersion.replace('java version "', "")
            javaVersion = javaVersion.replace('"', "")
            javaVersionSplit = javaVersion.split(".")
            javaVersionMain = javaVersionSplit[0]
            javaVersionSub = javaVersionSplit[1]
            if int(javaVersionMain) < 1 or (int(javaVersionMain) == 1 and int(javaVersionSub) < 8):
                error = {
                    'Error': "This software require at least java version 8, you are currently running java version " +
                    javaVersion + ". Update your java version or skip the image loading process."
                }
                rsp.append(error)
                return JsonResponse({'data': error})
            elif int(javaVersionMain) > 1 and int(javaVersionMain) < 8:
                error = {
                    'Error': "This software require at least java version 8, you are currently running java version " +
                    javaVersion + ". Update your java version or skip the image loading process."
                }
                rsp.append(error)
                return JsonResponse({'data': error})
        elif javaVersion.startswith("openjdk version"):
            javaVersion = javaVersion.replace('openjdk version "', "")
            javaVersion = javaVersion.split('"')[0]
            javaVersionSplit = javaVersion.split(".")
            javaVersionMain = javaVersionSplit[0]
            javaVersionSub = javaVersionSplit[1]
            # or (javaVersionMain == 1 and javaVersionSub < 8):
            if int(javaVersionMain) < 1 or (int(javaVersionMain) == 1 and int(javaVersionSub) < 8):
                error = {
                    'Error': "This software require at least openjdk version 8, you are currently running openjdk version " +
                    javaVersion + ". Update your openjdk version or skip the image loading process."
                }
                rsp.append(error)
                return JsonResponse({'data': error})
            elif int(javaVersionMain) > 1 and int(javaVersionMain) < 8:
                error = {
                    'Error': "This software require at least openjdk version 8, you are currently running openjdk version " +
                    javaVersion + ". Update your openjdk version or skip the image loading process."
                }
                rsp.append(error)
                return JsonResponse({'data': error})
        else:
            error = {
                'Error': "Unable to parse java version " + javaVersion + "."
            }
            rsp.append(error)
            return JsonResponse({'data': error})
    except BaseException as err:
        error = {
            'Error': err,
            'Details': "Could not verify the java version installed on your system."
        }
        rsp.append(error)
        return JsonResponse({'data': error})

    currentDir = os.path.dirname(os.path.realpath(__file__))
    imageMetadataReaderScript = currentDir + SCRIPT_DIRECTORY + SCRIPT_NAME
    scriptCmd = javaCmd + " -jar \"" + \
        imageMetadataReaderScript + "\" \"" + filePathS + "\""
    try:
        proc = subprocess.run(scriptCmd, stdin=PIPE,
                              stdout=PIPE, stderr=STDOUT, shell=True)
        stdout = str(proc.stdout)
        stderr = str(proc.stderr)
        response = stdout
        response = response.replace("b'", "")
        response = response.replace("\\n'", "")
        if response.startswith("ERROR:"):
            error = {
                'Error': "Could not read " + image.getName() + " metadata.",
                'Details': response
            }
            rsp.append(error)
            return JsonResponse({'data': error})
        #metadataJSON = json.dumps(response)
        metadataJSON = json.loads(response)
        return JsonResponse({'data': metadataJSON})
    except BaseException as err:
        error = {
            'Error': "Something went wrong trying to read the metadata for" + image.getName() + ".",
            'Details': err
        }
        rsp.append(error)
        return JsonResponse({'data': error})
    # omeXML = image.getOMEXML()
    # rsp = []
    # for ann in image.listAnnotations():
    #    ann_data = {
    #        'id': ann.getId(),
    #        'name': ann.getName(),
    #        'type': ann.OMERO_TYPE,
    #        'ns': ann.getNs(),
    #    }
    #    rsp.append(ann_data)
    # rsp.append(origMeta)
    # rsp.append(omeXML)

    # return JsonResponse({'data': rsp})


@ login_required()
def list_groups_projects_datasets_images(request, conn=None, **kwargs):
    rsp = []
    default_group_id = conn.getEventContext().groupId
    for g in conn.getGroupsMemberOf():
        isDefault = 0
        if default_group_id == g.getId():
            isDefault = 1
        groupID = g.getId()
        group_data = {
            'id': groupID,
            'name': g.getName(),
            'isDefault': isDefault,
        }
        conn.SERVICE_OPTS.setOmeroGroup(groupID)
        projects = []
        for p in conn.listProjects():
            project_data = {
                'id': p.getId(),
                'name': p.getName(),
            }
            datasets = []
            for d in p.listChildren():
                dataset_data = {
                    'id': d.getId(),
                    'name': d.getName(),
                }
                images = []
                for i in d.listChildren():
                    image_data = {
                        'id': i.getId(),
                        'name': i.getName(),
                    }
                    images.append(image_data)
                dataset_data['images'] = images
                datasets.append(dataset_data)
            project_data['datasets'] = datasets
            projects.append(project_data)
        group_data['projects'] = projects

        rsp.append(group_data)

    return JsonResponse({'data': rsp})


@ login_required()
def list_groups(request, conn=None, **kwargs):
    rsp = []
    default_group_id = conn.getEventContext().groupId
    for g in conn.getGroupsMemberOf():
        isDefault = 0
        if default_group_id == g.getId():
            isDefault = 1
        group_data = {
            'id': g.getId(),
            'name': g.getName(),
            'isDefault': isDefault,
        }
        rsp.append(group_data)

    return JsonResponse({'data': rsp})


@ login_required()
def check_Image_ID(request, conn=None, **kwargs):
    body_json = json.loads(request.body)
    imageID = body_json['imageID']

    rsp = []
    for g in conn.getGroupsMemberOf():
        groupID = g.getId()
        conn.SERVICE_OPTS.setOmeroGroup(groupID)
        image = conn.getObject("Image", imageID)
        if image is not None:
            return JsonResponse({'data': {'valid': 1, 'imageName': image.getName(), 'groupID': groupID}})

    return JsonResponse({'data': {'valid': 0}})


@ login_required()
def list_microscopes(request, conn=None, **kwargs):

    conn.SERVICE_OPTS.setOmeroGroup('-1')
    projects = conn.getObjects("Project", attributes={'name': PROJ_NAME})

    # curr_gid = conn.SERVICE_OPTS.getOmeroGroup()
    rsp = []
    for proj in projects:
        # if not proj.canAnnotate():
        #    continue
        projID = proj.getDetails().getGroup().getId()
        for file_ann in proj.listAnnotations():
            ann_ns = file_ann.getNs()
            ann_type = file_ann.OMERO_TYPE
            if ann_type != FileAnnotationI or ann_ns != JSON_FILEANN_NS:
                continue

            # print('fa', file_ann)
            # fa_wrapper = FileAnnotationWrapper(conn, file_ann)
            file_wrapper = file_ann.getFile()
            # print('file_wrapper', file_wrapper)
            file_data = b"".join(list(file_wrapper.getFileInChunks()))
            # print('file_data', file_data)
            json_data = json.loads(file_data.decode("utf-8"))

            # date = datetime.fromtimestamp(unwrap(fa['time'])/1000)
            # first_name = unwrap(file_ann)
            # last_name = unwrap(fa['lastName'])
            fig_file = {
                'id': file_ann.getId(),
                'groupId': projID,
                # 'name': unwrap(fa['name']),
                # 'description': unwrap(fa['desc']),
                # 'ownerFullName': "%s %s" % (first_name, last_name),
                # 'creationDate': time.mktime(date.timetuple()),
                # 'canEdit': fa['obj_details_permissions'].get('canEdit'),
                'microscope': json_data
            }
            rsp.append(fig_file)

    return JsonResponse({'data': rsp})


@ login_required()
def list_settings(request, conn=None, **kwargs):
    body_json = json.loads(request.body)
    groupID = body_json['groupID']
    imageID = body_json['imageID']

    conn.SERVICE_OPTS.setOmeroGroup(groupID)
    image = conn.getObject("Image", imageID)
    imageGroupID = image.getDetails().getGroup().getId()
    # conn.SERVICE_OPTS.setOmeroGroup('-1')
    #projects = conn.getObjects("Project")
    rsp = []
    for file_ann in image.listAnnotations():
        ann_ns = file_ann.getNs()
        ann_type = file_ann.OMERO_TYPE
        if ann_type != FileAnnotationI or ann_ns != JSON_FILEANN_NS:
            continue
        file_wrapper = file_ann.getFile()
        file_data = b"".join(list(file_wrapper.getFileInChunks()))
        json_data = json.loads(file_data.decode("utf-8"))
        fig_file = {
            'id': file_ann.getId(),
            'groupId': imageGroupID,
            # 'name': unwrap(fa['name']),
            # 'description': unwrap(fa['desc']),
            # 'ownerFullName': "%s %s" % (first_name, last_name),
            # 'creationDate': time.mktime(date.timetuple()),
            # 'canEdit': fa['obj_details_permissions'].get('canEdit'),
            'setting': json_data
        }
        rsp.append(fig_file)
    # for proj in projects:
        #projID = proj.getDetails().getGroup().getId()
        # for dataset in proj.listChildren():
        # for image in dataset.listChildren():

    return JsonResponse({'data': rsp})


@ login_required()
def list_microscopes_old(request, conn=None, **kwargs):

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
    file_annotations = qs.findAllByQuery(q, params, conn.SERVICE_OPTS)
    rsp = []
    for file_ann in file_annotations:
        print('fa', file_ann)
        fa_wrapper = FileAnnotationWrapper(conn, file_ann)
        file_wrapper = fa_wrapper.getFile()
        print('file_wrapper', file_wrapper)
        file_data = b"".join(list(file_wrapper.getFileInChunks()))
        print('file_data', file_data)
        json_data = json.loads(file_data.decode("utf-8"))

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


@ login_required()
def save_microscope(request, conn=None, **kwargs):

    body_json = json.loads(request.body)
    microscope_json = body_json['microscope']
    groupID = body_json['groupID']

    file_name = microscope_json["Name"]

    # TODO still need to check if name already exists

    projects = conn.getObjects("Project", attributes={'name': PROJ_NAME})

    userID = conn.getUser().getId()
    defaultGroupID = conn.getEventContext().groupId
    if groupID == -1 or groupID is None:
        groupID = defaultGroupID

    conn.SERVICE_OPTS.setOmeroGroup(groupID)

    # curr_gid = conn.SERVICE_OPTS.getOmeroGroup()
    print("curr_gid", groupID)


#	if project is not None:
#   	gid = project.getDetails().getGroup().getId()
#		conn.SERVICE_OPTS.setOmeroGroup(gid)
#	else:
#		# TODO: create Project
#		conn.SERVICE_OPTS.setOmeroGroup(curr_gid)

    project = None
    for proj in projects:
        gid = proj.getDetails().getGroup().getId()
        if gid == groupID and proj.getDetails().getOwner().getId() == userID:
            # EVERYTHING COOLIO
            project = proj
            break

    update = conn.getUpdateService()

    if project is None:
        new_project = ProjectI()
        new_project.setName(rstring(PROJ_NAME))
        new_project = update.saveAndReturnObject(
            new_project, conn.SERVICE_OPTS)
        new_project_id = new_project.getId().getValue()
        project = conn.getObject("Project", new_project_id)

    file_data = json.dumps(microscope_json)
    file_size = len(file_data)
    f = BytesIO()
    f.write(file_data.encode("utf-8"))
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


@ login_required()
def save_setting(request, conn=None, **kwargs):

    body_json = json.loads(request.body)
    setting_json = body_json['setting']
    microscopeID = body_json['microscopeID']
    groupID = body_json['groupID']
    imageID = body_json['imageID']

    file_name = setting_json["Name"]

    # TODO still need to check if name already exists

    conn.SERVICE_OPTS.setOmeroGroup('-1')
    mic_fa = conn.getObject("FileAnnotation", microscopeID)

    conn.SERVICE_OPTS.setOmeroGroup(groupID)

    image = conn.getObject("Image", imageID)

    update = conn.getUpdateService()

    file_data = json.dumps(setting_json)
    file_size = len(file_data)
    f = BytesIO()
    f.write(file_data.encode("utf-8"))
    orig_file = conn.createOriginalFileFromFileObj(
        f, '', file_name, file_size, mimetype="application/json")
    fa = FileAnnotationI()
    fa.setFile(OriginalFileI(orig_file.getId(), False))
    fa.setNs(wrap(JSON_FILEANN_NS))
    # fa.setDescription(wrap(desc))
    fa = update.saveAndReturnObject(fa, conn.SERVICE_OPTS)
    file_id = fa.getId().getValue()

    if image is not None:
        if mic_fa is not None:
            image.linkAnnotation(mic_fa)
        fa_wrapper = FileAnnotationWrapper(conn, fa)
        image.linkAnnotation(fa_wrapper)

    return JsonResponse({'file_id': file_id})
