from django.db.models import Count, Prefetch
from poker_face import serializers
from poker_face.models import Notice, Poll, PollOption, Vote
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class NoticeListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Notice.objects.filter(is_active=True)
    serializer_class = serializers.NoticeSerializer


class NoticeMainRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.NoticeSerializer

    def get_object(self):
        return Notice.objects.filter(is_active=True).last()


class PollListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PollSerializer

    def get_queryset(self):
        prefetch_set = PollOption.objects.filter(is_active=True).annotate(
            num=Count(expression="votes")
        )
        return (
            Poll.objects.filter(is_active=True)
            .prefetch_related(Prefetch(lookup="options", queryset=prefetch_set))
            .annotate(num=Count(expression="votes__voted_by", distinct=True))
        )


class PollVoteView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PollVoteSerializer

    def post(self, request, *args, **kwargs):
        poll_id = self.kwargs["pk"]

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        option_id = serializer.validated_data["option_id"]
        if not PollOption.objects.filter(
            id=option_id, poll_id=poll_id, is_active=True
        ).exists():
            return Response(
                {"error": "존재하지 않는 투표 옵션입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Vote.objects.create(poll_id=poll_id, option_id=option_id, voted_by=request.user)

        return Response(status=status.HTTP_201_CREATED)


class PollMainRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PollSerializer

    def get_object(self):
        prefetch_set = PollOption.objects.filter(is_active=True).annotate(
            num=Count(expression="votes")
        )
        return (
            Poll.objects.filter(is_active=True)
            .prefetch_related(Prefetch(lookup="options", queryset=prefetch_set))
            .annotate(num=Count(expression="votes__voted_by", distinct=True))
            .last()
        )
