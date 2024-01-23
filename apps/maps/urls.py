from django.urls import path

from apps.maps.views import MapMainView

urlpatterns = [
    path("", MapMainView.as_view()),
]
