from django.urls import path

from apps.accounts.views import LoginRedirectView, LoginView, SignupView

app_name = "accounts"

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("redirect/", LoginRedirectView.as_view(), name="redirect"),
]
