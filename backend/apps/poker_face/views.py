from django.db.models import Count, Exists, OuterRef, Prefetch, Q
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
            vote_count=Count("votes", filter=Q(votes__is_active=True)),
            is_voted=Exists(
                Vote.objects.filter(
                    option_id=OuterRef("id"),
                    voted_by=self.request.user,
                    is_active=True,
                )
            ),
        )
        return (
            Poll.objects.filter(is_active=True)
            .prefetch_related(Prefetch(lookup="options", queryset=prefetch_set))
            .annotate(
                vote_count=Count(
                    "votes__voted_by", distinct=True, filter=Q(votes__is_active=True)
                ),
                is_voted=Exists(
                    Vote.objects.filter(
                        poll_id=OuterRef("id"),
                        voted_by=self.request.user,
                        is_active=True,
                    )
                ),
            )
        )


class PollVoteView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PollVoteSerializer

    def post(self, request, *args, **kwargs):
        poll_id = self.kwargs["pk"]
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        option_ids = serializer.validated_data["optionIds"]
        if not PollOption.objects.filter(
            id__in=option_ids, poll_id=poll_id, is_active=True
        ).exists():
            return Response(
                {"error": "존재하지 않는 투표 옵션입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_votes = Vote.objects.filter(poll_id=poll_id, voted_by=request.user)
        processed_option_ids = []
        for vote in existing_votes:
            processed_option_ids.append(vote.option_id)
            if vote.option_id not in option_ids:
                vote.is_active = False
                vote.save()
            elif not vote.is_active and vote.option_id in option_ids:
                vote.is_active = True
                vote.save()

        for option_id in option_ids:
            if option_id not in processed_option_ids:
                Vote.objects.create(
                    poll_id=poll_id,
                    option_id=option_id,
                    voted_by=request.user,
                )

        return Response(status=status.HTTP_201_CREATED)


class PollMainRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PollSerializer

    def get_object(self):
        poll = (
            Poll.objects.filter(is_active=True)
            .annotate(
                vote_count=Count(
                    "votes__voted_by", distinct=True, filter=Q(votes__is_active=True)
                ),
                is_voted=Exists(
                    Vote.objects.filter(
                        poll_id=OuterRef("id"),
                        voted_by=self.request.user,
                        is_active=True,
                    )
                ),
            )
            .last()
        )

        poll.option_set = PollOption.objects.filter(is_active=True).annotate(
            vote_count=Count("votes", filter=Q(votes__is_active=True)),
            is_voted=Exists(
                Vote.objects.filter(
                    poll_id=poll.id,
                    option_id=OuterRef("id"),
                    voted_by=self.request.user,
                    is_active=True,
                )
            ),
        )
        return poll
