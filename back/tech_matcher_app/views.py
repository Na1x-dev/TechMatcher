from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from django.core.files.base import ContentFile
import base64



from .models import  CustomUser, Smartphone
from .serializers import  CustomUserSerializer, CustomUserCreateSerializer, SmartphoneSerializer
from pip._vendor.requests.api import request


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
            serializer = CustomUserSerializer(user)  
            return Response(serializer.data) 
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = CustomUserSerializer(user, data=request.data, partial=True)
            file = open("log", "w")
            file.write(str(serializer.initial_data))
            file.close()
            if 'image' in request.data:
                image_data = request.data['image']
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]
                image_file = ContentFile(base64.b64decode(imgstr), name=f"{user_id}.{ext}")
                user.image.save(f"{user_id}.{ext}", image_file)
            
            # print(serializer.initial_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'detail':'User not found'}, status=status.HTTP_404_NOT_FOUND)    
    
    
class SmartphonePagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    
class SmartphonePaginatedList(APIView):
    pagination_class = SmartphonePagination
    
    def get(self, request):
        smartphones = Smartphone.objects.all()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(smartphones, request)
        serializer = SmartphoneSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    
class SmartphoneList(APIView):
    
    def get(self, request):
        smartphones = Smartphone.objects.all()
        serializer = SmartphoneSerializer(smartphones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class SmartphoneById(APIView):

    def get(self, request, smartphone_id):
        try:
            smartphone = Smartphone.objects.get(id=smartphone_id)
            serializer_data = SmartphoneSerializer(smartphone)
            return Response(serializer_data.data)
        except Smartphone.DoesNotExist:
            return Response({'detail': 'Smartphone not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # smartphones.objects.get(pk=)
        
