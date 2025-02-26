from django.urls import path

from poker_face import views

app_name = "poker_face"


urlpatterns = [
    path("notices/", views.NoticeListView.as_view(), name="pf-notices"),
    path("notices/main/", views.NoticeRetrieveView.as_view(), name="pf-main-notice"),
    path("polls/", views.PollListView.as_view(), name="pf-polls"),
    path("polls/main/", views.PollRetrieveView.as_view(), name="pf-main-poll"),
]
