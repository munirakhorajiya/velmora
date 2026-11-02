from django.shortcuts import render
from rest_framework import status,generics,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated 
from rest_framework.authtoken.models import Token
from .models import User,Address,ServiceProviderProfile
from .permissions import IsServiceProvider
from .serializers import (UserLoginSerializer,UserProfileSerializer,UserRegisterSerializer,AddressSerializer,ServiceProviderProfileSerializer)

# Create your views here.

class RegisterView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            token,_=Token.objects.get_or_create(user=user)

            return Response({
                'message':'registration successful!',
                'token':token.key,
                'user':{
                    'id':user.id,
                    'email':user.email,
                    'role':user.role
                }
            },
            status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):

    permission_classes=[AllowAny]

    def post(self,request):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data['user']
            token,_=Token.objects.get_or_create(user=user)
            return Response({
                'message':'login successful!',
                'token':token.key,
                'user':{
                    'id':user.id,
                    'email':user.email,
                    'first_name':user.first_name,
                    'role':user.role
                }
                },
                status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        if hasattr(request.user,'auth_token'):
            request.user.auth_token.delete()
            return Response({'message':'logged out successfully.'},
                            status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class=UserProfileSerializer
    permission_classes=[IsAuthenticated]

    def get_object(self):
        return self.request.user

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class=AddressSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ServiceProviderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class=ServiceProviderProfileSerializer
    permission_classes=[IsServiceProvider]

    def get_object(self):
        profile,_=ServiceProviderProfile.objects.get_or_create(user=self.request.user)
        return profile
    


            

