from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

from .models import CustomUser, Smartphone, Basket, BasketItem
from .serializers import (
    CustomUserSerializer, 
    CustomUserCreateSerializer, 
    SmartphoneSerializer,
    BasketSerializer
)

# --- ПАГИНАЦИЯ ---
class SmartphonePagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100


# --- ВЬЮШКИ СМАРТФОНОВ ---
class SmartphoneListView(generics.ListAPIView):
    """
    Получение списка всех смартфонов с поддержкой пагинации.
    Сюда же позже очень легко добавятся фильтры.
    """
    queryset = Smartphone.objects.all().order_size('-launch_year')
    serializer_class = SmartphoneSerializer
    pagination_class = SmartphonePagination
    permission_classes = [AllowAny]


class SmartphoneDetailView(generics.RetrieveAPIView):
    """
    Получение детальной информации об одном смартфоне по ID.
    """
    queryset = Smartphone.objects.all()
    serializer_class = SmartphoneSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


# --- ВЬЮШКИ ПОЛЬЗОВАТЕЛЕЙ И АВТОРИЗАЦИИ ---
class RegisterView(generics.CreateAPIView):
    """
    Регистрация нового пользователя.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer
    permission_classes = [AllowAny]


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    """
    Просмотр и обновление профиля текущего пользователя.
    Использует MultiPartParser для чистой и безопасной загрузки картинок.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'id'

    def get_object(self):
        # Гарантируем, что пользователь может редактировать ТОЛЬКО свой профиль
        return self.request.user


# --- ВЬЮШКА КОРЗИНЫ ---
class BasketView(APIView):
    """
    Управление корзиной пользователя (Получение, добавление, удаление элементов).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        serializer = BasketSerializer(basket)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        smartphone_id = request.data.get('smartphone_id')
        quantity = int(request.data.get('quantity', 1))

        if not smartphone_id:
            return Response({"detail": "smartphone_id обязателен"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            smartphone = Smartphone.objects.get(id=smartphone_id)
        except Smartphone.DoesNotExist:
            return Response({"detail": "Смартфон не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Ищем, есть ли уже такой товар в корзине
        basket_item = basket.items.filter(smartphone=smartphone).first()
        if basket_item:
            basket_item.quantity += quantity
            basket_item.save()
        else:
            basket_item = BasketItem.objects.create(smartphone=smartphone, quantity=quantity)
            basket.items.add(basket_item)

        return Response(BasketSerializer(basket).data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        smartphone_id = request.data.get('smartphone_id')

        try:
            item = basket.items.get(smartphone_id=smartphone_id)
            basket.items.remove(item)
            item.delete()
            return Response(BasketSerializer(basket).data, status=status.HTTP_200_OK)
        except BasketItem.DoesNotExist:
            return Response({"detail": "Товар в корзине не найден"}, status=status.HTTP_404_NOT_FOUND)
