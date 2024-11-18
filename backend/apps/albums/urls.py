from django.urls import path

from apps.albums.views import ImageListView, ImageUploadView

app_name = "albums"

urlpatterns = [
    path("", ImageListView.as_view(), name="list"),
    path("upload", ImageUploadView.as_view(), name="upload"),
]
