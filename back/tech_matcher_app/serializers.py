from rest_framework import serializers
from .models import CustomUser, Smartphone, Basket, BasketItem

# --- СЕРИАЛИЗАТОРЫ СМАРТФОНОВ ---
class SmartphoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Smartphone
        fields = '__all__'


# --- СЕРИАЛИЗАТОРЫ ПОЛЬЗОВАТЕЛЕЙ ---
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'patronymic', 'phone_number', 'image']
        read_only_fields = ['id', 'email']


class CustomUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'patronymic', 'password', 'phone_number']

    def create(self, validated_data):
        # Используем наш кастомный UserManager для правильного создания и хеширования
        return CustomUser.objects.create_user(**validated_data)


# --- СЕРИАЛИЗАТОРЫ КОРЗИНЫ ---
class BasketItemSerializer(serializers.ModelSerializer):
    # Включаем полную информацию о смартфоне прямо внутрь элемента корзины
    smartphone = SmartphoneSerializer(read_only=True)
    # Оставляем возможность передавать ID при добавлении/изменении
    smartphone_id = serializers.PrimaryKeyRelatedField(
        queryset=Smartphone.objects.all(), 
        source='smartphone', 
        write_only=True
    )

    class Meta:
        model = BasketItem
        fields = ['id', 'smartphone', 'smartphone_id', 'quantity']


class BasketSerializer(serializers.ModelSerializer):
    items = BasketItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Basket
        fields = ['id', 'user', 'items', 'total_price']
