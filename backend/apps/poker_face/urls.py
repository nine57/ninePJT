from django.urls import path
from poker_face import views

app_name = "poker_face"


urlpatterns = [
    path(
        "notices/",
        views.NoticeListView.as_view(),
        name="pf-notices",
    ),
    path(
        "notices/main/",
        views.NoticeMainRetrieveView.as_view(),
        name="pf-main-notice",
    ),
    path(
        "polls/",
        views.PollListView.as_view(),
        name="pf-polls",
    ),
    path(
        "polls/<int:pk>/vote/",
        views.PollVoteView.as_view(),
        name="pf-poll-vote",
    ),
    path(
        "polls/main/",
        views.PollMainRetrieveView.as_view(),
        name="pf-main-poll",
    ),
]
