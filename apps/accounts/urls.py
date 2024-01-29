from django.contrib.auth import views as auth_views
from django.urls import path

app_name = "users"


urlpatterns = [
    path(
        "login/",
        auth_views.LoginView.as_view(template_name="accounts/main.html"),
        name="login",
    ),
]
