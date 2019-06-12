
from . import views
from django.conf.urls import url, patterns

print "MM urls.py"
urlpatterns = patterns(

    'django.views.generic.simple',

    url(r'^$', views.index, name='microscopyMetadataTool_index'),

)
