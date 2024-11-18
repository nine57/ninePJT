from django.urls import path

from apps.lotteries.views.api import CollectDrawnNumberView
from apps.lotteries.views.views import DrawNumbersView

urlpatterns = [
    path("api/collect-numbers", CollectDrawnNumberView.as_view()),
    path("draws", DrawNumbersView.as_view()),
]
