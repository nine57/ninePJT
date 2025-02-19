from django.db.models import Count, Prefetch
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from poker_face.models import Notice, Poll, PollOption
from poker_face.serializers import NoticeSerializer, PollSerializer


class NoticeView(APIView):
    def get(self, request):
        notice = Notice.objects.filter(is_active=True).last()

        serializer = NoticeSerializer(notice)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class PollView(APIView):
    def get(self, request):
        poll_options = PollOption.objects.annotate(
            num=Count(expression="votes")
        ).filter(is_active=True)
        poll = (
            Poll.objects.prefetch_related(
                Prefetch(lookup="options", queryset=poll_options)
            )
            .annotate(num=Count(expression="votes__voted_by", distinct=True))
            .filter(is_active=True)
            .last()
        )

        serializer = PollSerializer(poll)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
