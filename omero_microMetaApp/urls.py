
from . import views
from django.urls import re_path

urlpatterns = [

    # url('django.views.generic.simple'),

    re_path(r'^$', views.index, name='microMetaAppOmero_index'),

    re_path(r'^save_microscope/$', views.save_microscope,
            name='microMetaAppOmero_save_microscope'),

    re_path(r'^list_microscopes/$', views.list_microscopes,
            name='microMetaAppOmero_list_microscopes'),

    re_path(r'^save_setting/$', views.save_setting,
            name='microMetaAppOmero_save_setting'),

    re_path(r'^list_settings/$', views.list_settings,
            name='microMetaAppOmero_list_settings'),

    re_path(r'^check_Image_ID/$', views.check_Image_ID,
            name='microMetaAppOmero_check_Image_ID'),

    re_path(r'^list_groups/$', views.list_groups,
            name='microMetaAppOmero_list_groups'),

    re_path(r'^list_groups_projects_datasets_images/$',
            views.list_groups_projects_datasets_images,
            name='microMetaAppOmero_list_groups_projects_datasets_images'),

    re_path(r'^load_metadata/$', views.load_metadata,
            name='microMetaAppOmero_load_metadata'),
]
