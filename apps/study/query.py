from django.db.models import Prefetch

from apps.study.models import Category, Link, Post


# TODO: query classification
def get_category_data(category_name):
    category_set = Category.objects.filter(name=category_name, parent__isnull=True)
    prefetch_category = Prefetch(
        lookup="sub_category_set",
        to_attr="prefetch_sub_category_set",
        queryset=Category.objects.prefetch_related(
            Prefetch(
                lookup="post_set",
                to_attr="prefetch_post_set",
                queryset=Post.objects.prefetch_related(
                    Prefetch(
                        lookup="link_set",
                        to_attr="prefetch_link_set",
                    )
                ),
            )
        ),
    )
    category_set = category_set.prefetch_related(prefetch_category)
    category = category_set.last()
    return category
