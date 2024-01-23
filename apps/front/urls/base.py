from django.urls import path
from front.views import Index

urlpatterns = [
    path("", Index.as_view()),
]
