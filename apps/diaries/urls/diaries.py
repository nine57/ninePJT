from django.urls import path
from diaries.views.front import DiariesView

urlpatterns = [
    path("", DiariesView.as_view()),
]
