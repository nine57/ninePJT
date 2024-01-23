from django.urls import path
from lotteries.views.api import CollectDrawnNumberView
from lotteries.views.front import DrawNumbersView

urlpatterns = [
    path("api/collect-numbers", CollectDrawnNumberView.as_view()),
    path("draws", DrawNumbersView.as_view()),
]
