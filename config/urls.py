from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

urlpatterns = [
    path("", include("front.urls")),
    path("ckeditor/", include("ckeditor_uploader.urls")),
    path("diaries/", include("diaries.urls")),
    path("albums/", include("albums.urls")),
    path("blogs/", include("blogs.urls")),
    path("study/", include("study.urls")),
    #     path("admin/", admin.site.urls),
    #     path("lotteries/", include("lotteries.urls")),
    #     path("maps/", include("maps.urls")),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
