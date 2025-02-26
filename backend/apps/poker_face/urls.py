from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from poker_face import views

app_name = "poker_face"


urlpatterns = [
    path(
        "login/",
        jwt_views.TokenObtainPairView.as_view(),
        name="pf-login",
    ),
    path(
        "refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="pf-token-refresh",
    ),
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
        "polls/main/",
        views.PollMainRetrieveView.as_view(),
        name="pf-main-poll",
    ),
]
