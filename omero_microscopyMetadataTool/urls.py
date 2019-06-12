import django
from omeroweb.webgateway import views as webgateway_views
from . import views
if django.VERSION < (1, 6):
    from django.conf.urls.defaults import url, patterns
else:
    from django.conf.urls import url, patterns


urlpatterns = patterns(

    'django.views.generic.simple',
    # index 'home page' of the figure app
    url(r'^$', views.index, name='figure_index'),
)