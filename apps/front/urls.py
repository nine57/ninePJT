from django.urls import path

from apps.front.views import Index

urlpatterns = [
    path("", Index.as_view(), name="index"),
]
