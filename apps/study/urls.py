from django.urls import path

from apps.study.views import DesignPatternStudyView

app_name = "study"


urlpatterns = [
    path("", DesignPatternStudyView.as_view(), name="study"),
]
