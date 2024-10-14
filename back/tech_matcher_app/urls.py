from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileAPIView, SmartphonePaginatedList, SmartphoneById, SmartphoneList
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/<int:user_id>/', UserProfileAPIView.as_view(), name='user-profile'),
    path('smartphones/', SmartphonePaginatedList.as_view(), name='smartphone-paginated-list'),
    path('smartphones/all', SmartphoneList.as_view(), name='smartphone-list'), 
    path('smartphones/<int:smartphone_id>/', SmartphoneById.as_view(), name='smartphone-by-id')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)