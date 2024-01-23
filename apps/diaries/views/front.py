from django.views.generic import TemplateView


class DiariesView(TemplateView):
    template_name = "diaries/main.html"

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        from diaries.views import mock

        context = super().get_context_data(**kwargs)
        context["diaries"] = mock.mock_diaries
        return context
