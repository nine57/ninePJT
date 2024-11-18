from django.contrib import messages
from django.contrib.auth.views import LoginView as DjangoLoginView
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from django.views.generic import TemplateView

from apps.accounts.query import get_user
from apps.accounts.service import create_user, update_login_success_user


class SignupView(TemplateView):
    template_name = "accounts/signup.html"

    def post(self, request, *args, **kwargs):
        request_body = self.request.POST
        create_user(request_body)
        return redirect("accounts:login")


class LoginView(DjangoLoginView):
    template_name = "accounts/login.html"

    def post(self, request, *args, **kwargs):
        request_body = self.request.POST
        username = request_body.get("username")
        password = request_body.get("password")
        user = get_user(username=username)
        if user.check_password(password):
            update_login_success_user(user)
            level = messages.constants.SUCCESS
            message = f"{username}님, 반가워요!"
            redirect_page_name = "index"
        else:
            level = messages.constants.WARNING
            message = "로그인 정보가 맞지 않습니다."
            redirect_page_name = "accounts:login"
        messages.add_message(self.request, level, message)
        return redirect(redirect_page_name)


# TODO: make logics
class LoginRedirectView(View):
    def get(self, request, *args, **kwargs):
        return redirect(reverse("index"))
