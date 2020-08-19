
from . import views
from django.conf.urls import url

urlpatterns = [

    # url('django.views.generic.simple'),

    url(r'^$', views.index, name='microscopyMetadataTool_index'),

    url(r'^save_microscope/$', views.save_microscope,
        name='microscopyMetadataTool_save_microscope'),

    url(r'^list_microscopes/$', views.list_microscopes,
        name='microscopyMetadataTool_list_microscopes'),
]
