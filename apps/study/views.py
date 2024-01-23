from django.views.generic import TemplateView

from apps.study.query import get_category_data
from apps.study.serialize import sub_category_serializer


class DesignPatternStudyView(TemplateView):
    template_name = "study/design-pattern/main.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_name = "Design Patterns"
        category = get_category_data(category_name)
        if category:
            data = [
                sub_category_serializer(sub_category)
                for sub_category in category.prefetch_sub_category_set
            ]
            context["title"] = category.name
            # TODO: data key name change
            context["data"] = data
        return context
