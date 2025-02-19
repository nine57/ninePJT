from rest_framework import serializers

from poker_face.models import Notice, Poll, PollOption


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
