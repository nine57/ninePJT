from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response


class MainView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        apps = [
            "accounts",
            "albums",
            "blogs",
            "diaries",
            "front",
            "lotteries",
            "maps",
        ]
        return Response(data={"apps": apps}, status=status.HTTP_200_OK)
