from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    UserProfileAPIView, 
    SmartphoneListView, 
    SmartphoneDetailView,
    BasketView
)

urlpatterns = [
    # Авторизация и токены (JWT)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Пользователи
    path('register/', RegisterView.as_view(), name='register'),
    path('users/<int:id>/', UserProfileAPIView.as_view(), name='user-profile'),
    
    # Каталог смартфонов
    path('smartphones/', SmartphoneListView.as_view(), name='smartphone-list'),
    path('smartphones/<int:id>/', SmartphoneDetailView.as_view(), name='smartphone-detail'),
    
    # Корзина
    path('basket/', BasketView.as_view(), name='user-basket'),
]
