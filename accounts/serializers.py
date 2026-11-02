from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User,Address,ServiceProviderProfile

class UserRegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=8,style={'input_type':'password'},help_text="password must be at least 8 characters long")

    class Meta:
        model=User
        fields=['id','email','username','first_name','last_name','phone_number','password']

        def create(self,validated_data):
            user=User.objects.create_user(
                email=validated_data['email'],
                username=validated_data.get('username') or validated_data['email'].split('@')[0],
                first_name=validated_data.get('first_name',''),
                last_name=validated_data.get('last_name',''),
                phone_number=validated_data.get['phone_number',''],
                role=User.Role.CUSTOMER
            )
            return user

        
class UserLoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True,style={'input_type':'password'})

    def validate(self, data):
        email=data.get('email')
        password=data.get('password')

        if email and password:
            user=authenticate(username=email,password=password)

            if not user:
                raise serializers.ValidationError('invalid email or password')

            if not user.is_active:
                raise serializers.ValidationError('this account has been disabled')
            else:
                raise serializers.ValidationError('both email and password are required')

        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','email','username','first_name','last_name','phone_number','role','date_joined']
        read_only_fields=['id','email','role','date_joined']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields=['id','full_name','phone_number','address_line_1','address_line_2','city','state','postal_code','country','is_default','created_at']
        read_only_fields=['id','created_at']


class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    user_email=serializers.EmailField(source='user.email',read_only=True)
    
    class Meta:
        model=ServiceProviderProfile
        fields=['id','user_email','store_name','contact_email','phone','workshop_address','payout_bank_details','is_verified','created_at']
        read_only_fields=['id','is_verified','created_at']


