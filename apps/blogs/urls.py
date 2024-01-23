from django.urls import path

from apps.blogs.views import BlogCreateView, BlogDetailView, BlogMainView

app_name = "blogs"


urlpatterns = [
    path("", BlogMainView.as_view(), name="main"),
    path("write", BlogCreateView.as_view(), name="write"),
    path("<int:post_id>", BlogDetailView.as_view(), name="detail"),
]
