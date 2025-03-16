from poker_face.models import Notice, Poll, PollOption
from rest_framework import serializers


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ["id", "title", "content"]


class PollOptionSerializer(serializers.ModelSerializer):
    voteCount = serializers.IntegerField(source="vote_count")
    isVoted = serializers.BooleanField(source="is_voted")

    class Meta:
        model = PollOption
        fields = ["id", "text", "voteCount", "isVoted"]


class PollSerializer(serializers.ModelSerializer):
    voteCount = serializers.IntegerField(source="vote_count")
    isVoted = serializers.BooleanField(source="is_voted")
    options = PollOptionSerializer(source="option_set", many=True)

    class Meta:
        model = Poll
        fields = ["id", "title", "description", "voteCount", "options", "isVoted"]


class PollVoteSerializer(serializers.Serializer):
    optionIds = serializers.ListField(child=serializers.IntegerField())
