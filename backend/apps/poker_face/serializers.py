from poker_face.models import Notice, Poll, PollOption
from rest_framework import serializers


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ["id", "title", "content"]


class PollOptionSerializer(serializers.ModelSerializer):
    num = serializers.IntegerField()

    class Meta:
        model = PollOption
        fields = ["id", "text", "num"]


class PollSerializer(serializers.ModelSerializer):
    num = serializers.IntegerField()
    options = PollOptionSerializer(many=True)

    class Meta:
        model = Poll
        fields = ["id", "title", "description", "num", "options"]


class PollVoteSerializer(serializers.Serializer):
    optionId = serializers.IntegerField(source="option_id")
