from rest_framework import serializers

from .models import CustomUser, Smartphone, Basket, BasketItem


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'



class CustomUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'patronymic', 'password', 'phone_number')
        extra_kwargs = {
            'password': {'write_only': True}  # Пароль будет только для записи
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  # Хешируем пароль
        user.save()
        
        return user
    
class SmartphoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Smartphone
        fields = "__all__"
        
class BasketItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasketItem
        fields = '__all__'

class BasketSerializer(serializers.ModelSerializer):
    items = BasketItemSerializer(many=True)
    class Meta:
        model = Basket
        fields = '__all__'