from apps.accounts.models import User, UserType, UserTypeAssignment
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


@method_decorator(csrf_exempt, name="dispatch")
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        name = request.data.get("name")
        phone = request.data.get("phone")
        email = request.data.get("email")
        user_type = request.data.get("userType")

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": f"사용자({username})가 이미 존재합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not (user_type and UserType.objects.filter(code=user_type).exists()):
            return Response(
                {"error": "유효하지 않은 가입 코드입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User(username=username, name=name, email=email, phone=phone)
        user.set_password(password)
        user.save()
        UserTypeAssignment.objects.create(
            user=user, user_type=UserType.objects.get(code=user_type)
        )
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
