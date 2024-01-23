from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views import View
from django.views.generic import TemplateView

from apps.blogs.forms import PostForm
from apps.blogs.models import Post


class BlogMainView(TemplateView):
    template_name = "blogs/main.html"


class BlogCreateView(View):
    template_name = "blogs/write.html"
    form_class = PostForm

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {"form": form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        time_now = timezone.now().astimezone()
        if form.is_valid():
            post = Post(created_at=time_now, **form.cleaned_data)
            post.save()
            url = reverse("blogs:detail", kwargs={"post_id": post.id})
            return redirect(url)

        return render(request, self.template_name, {"form": form})


class BlogDetailView(TemplateView):
    template_name = "blogs/detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post_id = self.kwargs.get("post_id")
        context["blog"] = Post.objects.get(id=post_id)
        return context
