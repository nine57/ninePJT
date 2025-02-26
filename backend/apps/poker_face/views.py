from django.db.models import Count, Prefetch
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from poker_face import serializers
from poker_face.models import Notice, Poll, PollOption


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
