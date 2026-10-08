from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from tech_matcher_app.auth import GoogleLogin

schema_view = get_schema_view(
    openapi.Info(
        title="TechMatcher API",
        default_version="v2",
        description="API магазина электроники TechMatcher",
        contact=openapi.Contact(email="contact@techmatcher.local"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("tech_matcher_app.urls")),

    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/google/", GoogleLogin.as_view(), name="google-login"),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=None), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=None), name="schema-redoc"),
]
