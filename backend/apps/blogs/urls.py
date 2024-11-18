from django.urls import path

from apps.blogs.views import BlogCreateView, BlogDetailView, BlogMainView, StudyView

app_name = "blogs"


urlpatterns = [
    path("", BlogMainView.as_view(), name="main"),
    path("write", BlogCreateView.as_view(), name="write"),
    path("study/<str:study_name>/", StudyView.as_view(), name="study"),
    path("<int:post_id>", BlogDetailView.as_view(), name="detail"),
]
