import random

from django.views.generic import TemplateView  # DetailView, ListView, RedirectView


class DrawNumbersView(TemplateView):
    template_name = "lotteries/draw_new_numbers.html"

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        number_pool = list(range(1, 46))
        drawn_numbers = random.sample(number_pool, 6)
        drawn_numbers.sort()
        context["drawn_numbers"] = drawn_numbers
        return context


# WEIGHT = self.get_weight()
# dmnd = request.GET.getlist("dmnd", None)
# dmnd = list(map(int, dmnd))
# number_pool = list(range(1, 46))
# wins = [] + dmnd
# count = 0 + len(dmnd)
# while count < 6:
#     draw = random.choices(number_pool, weights=WEIGHT)[0]
#     if draw in wins:
#         continue
#     wins.append(draw)
#     count += 1
# wins.sort()
