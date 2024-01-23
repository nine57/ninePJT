from django.urls import path
from maps.views import front

urlpatterns = [
    path("", front.MapMainView.as_view()),
]
