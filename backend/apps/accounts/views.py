from apps.accounts.service import create_user
from django.contrib.auth import authenticate
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class SignupView(TemplateView):
    template_name = "accounts/signup.html"

    def post(self, request, *args, **kwargs):
        request_body = self.request.POST
        create_user(request_body)
        return redirect("accounts:login")


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            )
        else:
            return Response(
                {"error": "잘못된 인증 정보입니다."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# TODO: make logics
class LoginRedirectView(View):
    def get(self, request, *args, **kwargs):
        return redirect(reverse("index"))
