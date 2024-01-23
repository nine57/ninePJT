def sub_category_serializer(sub_category):
    data = {
        "name": sub_category.name,
        "posts": [post_serializer(post) for post in sub_category.prefetch_post_set],
    }
    return data


def post_serializer(post):
    content = post.content if post.content else ""
    data = {
        "title": post.title,
        "content": content,
        "links": [link_serializer(link) for link in post.prefetch_link_set],
    }
    return data


def link_serializer(link):
    name = link.name if link.name else "link"
    data = {"url": link.url, "name": name}
    return data
