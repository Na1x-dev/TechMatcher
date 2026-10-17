from rest_framework import serializers

from .models import Basket, BasketItem, CustomUser, Smartphone


class SmartphoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Smartphone
        fields = "__all__"


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id", "email", "first_name", "last_name", "patronymic",
            "phone_number", "image",
        ]
        read_only_fields = ["id", "email"]


class CustomUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            "email", "first_name", "last_name", "patronymic",
            "password", "phone_number",
        ]

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class BasketItemSerializer(serializers.ModelSerializer):
    smartphone = SmartphoneSerializer(read_only=True)
    smartphone_id = serializers.PrimaryKeyRelatedField(
        queryset=Smartphone.objects.all(),
        source="smartphone",
        write_only=True,
    )

    class Meta:
        model = BasketItem
        fields = ["id", "smartphone", "smartphone_id", "quantity"]


class BasketSerializer(serializers.ModelSerializer):
    items = BasketItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Basket
        fields = ["id", "user", "items", "total_price"]
        read_only_fields = ["id", "user", "total_price"]

    def get_total_price(self, obj):
        return obj.total_price()
