
from . import views
from django.conf.urls import url

urlpatterns = [

    # url('django.views.generic.simple'),

    url(r'^$', views.index, name='microMetaAppOmero_index'),

    url(r'^save_microscope/$', views.save_microscope,
        name='microMetaAppOmero_save_microscope'),

    url(r'^list_microscopes/$', views.list_microscopes,
        name='microMetaAppOmero_list_microscopes'),

    url(r'^save_setting/$', views.save_setting,
        name='microMetaAppOmero_save_setting'),

    url(r'^list_settings/$', views.list_settings,
        name='microMetaAppOmero_list_settings'),

    url(r'^list_groups/$', views.list_groups,
        name='microMetaAppOmero_list_groups'),

    url(r'^list_groups_projects_datasets_images/$', views.list_groups_projects_datasets_images,
        name='microMetaAppOmero_list_groups_projects_datasets_images'),

    url(r'^load_metadata/$', views.load_metadata,
        name='microMetaAppOmero_load_metadata'),
]
