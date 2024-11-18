from django.urls import path

from apps.diaries.views import DiariesView

urlpatterns = [
    path("", DiariesView.as_view()),
]
