
from omeroweb.webclient.decorators import login_required
from django.shortcuts import render

@login_required()
def index(request, conn=None, **kwargs):

    return render(request, 'microscopyMetadataTool/index.html')
