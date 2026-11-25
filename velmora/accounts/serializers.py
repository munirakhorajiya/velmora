from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Address, ServiceProviderProfile


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'password']

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please sign in or use a different email.")
        return email

    def create(self, validated_data):
        email = validated_data['email'].strip().lower()
        base_username = validated_data.get('username') or email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        # Public registration is strictly reserved for client/customer accounts
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', '').strip(),
            last_name=validated_data.get('last_name', '').strip(),
            phone_number=validated_data.get('phone_number', '').strip(),
            role=User.Role.CUSTOMER
        )
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    role = serializers.CharField(required=False, default='CUSTOMER')

    def validate(self, data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        selected_role = data.get('role', 'CUSTOMER')

        if not (email and password):
            raise serializers.ValidationError('Both email and password are required.')

        user = authenticate(username=email, password=password)
        if not user:
            # Fallback lookup in case username differs from email or case sensitivity
            u_match = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()
            if u_match and u_match.check_password(password):
                user = u_match

        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account has been disabled. Please contact concierge support.')

        # Security check: Account role verification
        if selected_role == 'SERVICE_PROVIDER' and not (user.is_service_provider or user.is_admin_user):
            raise serializers.ValidationError('Access restricted. This account is registered as a Client/Customer, not an authorized Service Provider.')

        if selected_role == 'ADMIN' and not user.is_admin_user:
            raise serializers.ValidationError('Access restricted. This account does not have Administrator credentials.')

        # Main Service Provider Authorization & Verification Check
        if (selected_role == 'SERVICE_PROVIDER' or user.is_service_provider) and not user.is_admin_user:
            profile = getattr(user, 'provider_profile', None)
            is_main = bool(profile and profile.is_main_provider or user.email in ['provider@velmora.com', 'providervelmora@gmail.com'])
            is_permitted = bool(profile and (is_main or profile.is_verified))
            if not is_permitted:
                raise serializers.ValidationError(
                    'Security Alert: Your Service Provider registration is pending authorization and permission from the Main Service Provider. For boutique security and catalog safety, you do not have permission to edit website items or log in until approved.'
                )

        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'role', 'date_joined']
        read_only_fields = ['id', 'email', 'role', 'date_joined']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone_number', 'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ServiceProviderProfile
        fields = ['id', 'user_email', 'store_name', 'contact_email', 'phone', 'workshop_address', 'payout_bank_details', 'is_verified', 'is_main_provider', 'created_at']
        read_only_fields = ['id', 'is_verified', 'is_main_provider', 'created_at']
