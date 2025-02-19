from django.urls import path

from poker_face.views import NoticeView, PollView

app_name = "poker_face"


urlpatterns = [
    path("notice/", NoticeView.as_view(), name="pf-notice"),
    path("poll/", PollView.as_view(), name="pf-poll"),
]
