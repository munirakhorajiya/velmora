from django.shortcuts import render
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.authtoken.models import Token
from .models import User, Address, ServiceProviderProfile
from .permissions import IsServiceProvider
from .serializers import (
    UserLoginSerializer,
    UserProfileSerializer,
    UserRegisterSerializer,
    AddressSerializer,
    ServiceProviderProfileSerializer
)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'message': 'Registration successful!',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role,
                    'is_service_provider': user.is_service_provider,
                    'is_admin': user.is_admin_user,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Login successful!',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'is_service_provider': user.is_service_provider,
                    'is_admin': user.is_admin_user,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ServiceProviderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ServiceProviderProfileSerializer
    permission_classes = [IsServiceProvider]

    def get_object(self):
        profile, _ = ServiceProviderProfile.objects.get_or_create(user=self.request.user)
        return profile


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = (request.data.get('current_password') or request.data.get('old_password') or '').strip()
        new_password = request.data.get('new_password', '').strip()
        confirm_password = request.data.get('confirm_password', '').strip()

        if not current_password or not new_password:
            return Response({'error': 'Current password and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'New password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        if confirm_password and new_password != confirm_password:
            return Response({'error': 'New password and confirmation password do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({'error': 'The current password you entered is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Generate a fresh token so user session remains valid
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)

        return Response({
            'message': 'Password has been updated successfully.',
            'token': token.key
        }, status=status.HTTP_200_OK)

class ExportUserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        from orders.models import Order
        from orders.serializers import OrderDetailSerializer
        from django.utils import timezone

        orders_data = OrderDetailSerializer(Order.objects.filter(user=user), many=True).data
        addresses_data = AddressSerializer(user.addresses.all(), many=True).data

        export_archive = {
            'organization': 'Velmora Maison Atelier',
            'export_timestamp': str(timezone.now()),
            'data_protection_standard': 'GDPR Article 20 - Right to Data Portability',
            'user_profile': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'role': user.role,
                'date_joined': str(user.date_joined),
                'verified_status': 'Velmora Club Member'
            },
            'saved_addresses': addresses_data,
            'orders_history': orders_data,
        }
        return Response(export_archive, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        password = request.data.get('password', '').strip()

        if not password:
            return Response({'error': 'Please provide your current password to confirm account deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Incorrect password. Account deletion aborted.'}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_staff or user.is_superuser or user.email.lower() == 'admin@velmora.com':
            return Response({'error': 'Primary administrator accounts cannot be deleted.'}, status=status.HTTP_400_BAD_REQUEST)

        Token.objects.filter(user=user).delete()
        user_email = user.email
        user.delete()

        return Response({
            'message': f"Account for {user_email} has been permanently erased in compliance with privacy regulations."
        }, status=status.HTTP_200_OK)
