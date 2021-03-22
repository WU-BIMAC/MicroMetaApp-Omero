
from . import views
from django.conf.urls import url

urlpatterns = [

    # url('django.views.generic.simple'),

    url(r'^$', views.index, name='microMetaAppOmero_index'),

    url(r'^save_microscope/$', views.save_microscope,
        name='microMetaAppOmero_save_microscope'),

    url(r'^list_microscopes/$', views.list_microscopes,
        name='microMetaAppOmero_list_microscopes'),
]
