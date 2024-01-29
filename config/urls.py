from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

urlpatterns = [
    path("", include("apps.front.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("admin/", admin.site.urls),
    path("ckeditor/", include("ckeditor_uploader.urls")),
    path("albums/", include("apps.albums.urls")),
    path("blogs/", include("apps.blogs.urls")),
    path("diaries/", include("apps.diaries.urls")),
    path("maps/", include("apps.maps.urls")),
    path("lotteries/", include("apps.lotteries.urls")),
    path("study/", include("apps.study.urls")),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
