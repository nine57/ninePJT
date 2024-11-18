from django.views.generic import TemplateView


class MapMainView(TemplateView):
    template_name = "maps/main.html"
