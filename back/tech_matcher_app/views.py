from decimal import Decimal, InvalidOperation

from django.db.models import Q
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
    BasketSerializer,
)


class SmartphonePagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = "page_size"
    max_page_size = 100


class SmartphoneListView(generics.ListAPIView):
    """Searchable and filterable smartphone catalog."""
    serializer_class = SmartphoneSerializer
    pagination_class = SmartphonePagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Smartphone.objects.all()
        params = self.request.query_params

        search = params.get("search", "").strip()
        if search:
            for term in search.split():
                qs = qs.filter(
                    Q(title__icontains=term)
                    | Q(brand__icontains=term)
                    | Q(cpu__icontains=term)
                )

        brand = params.get("brand")
        if brand:
            qs = qs.filter(brand__iexact=brand)

        for key, lookup in (
            ("min_price", "price__gte"),
            ("max_price", "price__lte"),
            ("ram_size", "ram_size__gte"),
            ("rom_size", "rom_size__gte"),
            ("min_screen_size", "screen_size__gte"),
            ("max_screen_size", "screen_size__lte"),
            ("launch_year", "launch_year__gte"),
        ):
            raw = params.get(key)
            if raw not in (None, ""):
                try:
                    qs = qs.filter(**{lookup: Decimal(raw)})
                except (InvalidOperation, ValueError):
                    pass

        for key in ("nfc", "has_5g", "wireless_charging"):
            raw = params.get(key)
            if raw in ("true", "false"):
                qs = qs.filter(**{key: raw == "true"})

        sort = params.get("ordering", "-launch_year")
        allowed_sort = {
            "price", "-price", "title", "-title", "brand", "-brand",
            "launch_year", "-launch_year", "screen_size", "-screen_size",
        }
        if sort not in allowed_sort:
            sort = "-launch_year"
        return qs.order_by(sort, "id")


class SmartphoneDetailView(generics.RetrieveAPIView):
    queryset = Smartphone.objects.all()
    serializer_class = SmartphoneSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer
    permission_classes = [AllowAny]


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = "id"

    def get_object(self):
        return self.request.user


class BasketView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        return Response(BasketSerializer(basket).data, status=status.HTTP_200_OK)

    def post(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        smartphone_id = request.data.get("smartphone_id")
        try:
            quantity = max(1, int(request.data.get("quantity", 1)))
        except (TypeError, ValueError):
            return Response({"detail": "quantity должен быть целым числом"}, status=status.HTTP_400_BAD_REQUEST)
        if not smartphone_id:
            return Response({"detail": "smartphone_id обязателен"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            smartphone = Smartphone.objects.get(id=smartphone_id)
        except (Smartphone.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Смартфон не найден"}, status=status.HTTP_404_NOT_FOUND)

        basket_item = basket.items.filter(smartphone=smartphone).first()
        if basket_item:
            basket_item.quantity += quantity
            basket_item.save(update_fields=["quantity"])
        else:
            basket_item = BasketItem.objects.create(smartphone=smartphone, quantity=quantity)
            basket.items.add(basket_item)
        return Response(BasketSerializer(basket).data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        basket, _ = Basket.objects.get_or_create(user=request.user)
        smartphone_id = request.query_params.get("smartphone_id") or request.data.get("smartphone_id")
        if not smartphone_id:
            return Response({"detail": "smartphone_id обязателен"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = basket.items.get(smartphone_id=smartphone_id)
        except (BasketItem.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Товар в корзине не найден"}, status=status.HTTP_404_NOT_FOUND)
        basket.items.remove(item)
        item.delete()
        return Response(BasketSerializer(basket).data, status=status.HTTP_200_OK)
