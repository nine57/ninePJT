from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


@method_decorator(csrf_exempt, name="dispatch")
class SignupView(APIView):
    permission_classes = [AllowAny]  # 모든 사용자에게 허용

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "사용자가 이미 존재합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User(username=username)
        user.set_password(password)  # 비밀번호 해싱
        user.save()
        return Response(
            {"message": "회원가입이 완료되었습니다."}, status=status.HTTP_201_CREATED
        )


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
