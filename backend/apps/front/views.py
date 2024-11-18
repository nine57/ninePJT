from typing import Any

from django.conf import settings
from django.views.generic import TemplateView


class Index(TemplateView):
    template_name = "root/index.html"

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context_data = super().get_context_data(**kwargs)
        apps = settings.PROJECT_APPS
        context_data["apps"] = apps
        return context_data
