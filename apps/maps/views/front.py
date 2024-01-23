import random

from django.views.generic import TemplateView  # DetailView, ListView, RedirectView


class MapMainView(TemplateView):
    template_name = "map_base.html"

