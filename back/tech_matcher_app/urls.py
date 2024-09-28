from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileAPIView, SmartphoneList, SmartphoneById

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/<int:user_id>/', UserProfileAPIView.as_view(), name='user-profile'),
    path('smartphones/', SmartphoneList.as_view(), name='smartphone-list'), 
    path('smartphones/<int:smartphone_id>/', SmartphoneById.as_view(), name='smartphone-by-id')
]
