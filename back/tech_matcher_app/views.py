from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view

from .models import  CustomUser
from .serializers import  CustomUserSerializer, CustomUserCreateSerializer

class RegistrationAPIView(APIView):

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            refresh.payload.update({ 
                'user_id': user.id,
                'email': user.email
            })

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),  # Отправка на клиент
            }, status=status.HTTP_201_CREATED)


class RegisterView(generics.CreateAPIView):
    serializer_class = CustomUserCreateSerializer


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user_data = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'patronymic': user.patronymic,
                'phone_number': user.phone_number,
            }
            return Response(user_data)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    