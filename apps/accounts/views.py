# from django.views.generic import TemplateView
from django.shortcuts import redirect
from django.views import View


class LoginRedirectView(View):
    def get(self, request, *args, **kwargs):
        return redirect("index")
