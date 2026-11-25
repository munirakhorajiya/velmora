from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER='CUSTOMER','Customer'
        SERVICE_PROVIDER='SERVICE_PROVIDER','Service Provider'
        ADMIN='ADMIN','Admin'

    email=models.EmailField(unique=True)
    phone_number=models.CharField(max_length=20,blank=True)
    role=models.CharField(max_length=20,choices=Role.choices,default=Role.CUSTOMER)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return f"{self.email}({self.get_role_display()})"

    @property
    def is_customer(self):
        return self.role==self.Role.CUSTOMER

    @property
    def is_service_provider(self):
        return self.role==self.Role.SERVICE_PROVIDER

    @property
    def is_admin_user(self):
        return self.role==self.Role.ADMIN or self.is_superuser


class ServiceProviderProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='provider_profile')
    store_name=models.CharField(max_length=150,default='Velmora')
    contact_email=models.EmailField(blank=True)
    phone=models.CharField(max_length=20,blank=True)
    workshop_address=models.TextField(blank=True,help_text="Studio/Dispatch address")
    payout_bank_details=models.TextField(blank=True,help_text="Bank details for store revenue payouts")
    is_verified=models.BooleanField(default=False, help_text="True if approved by Main Service Provider/Admin")
    is_main_provider=models.BooleanField(default=False, help_text="Primary executive atelier provider with permission granting authority")
    approved_at=models.DateTimeField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.store_name} ({self.user.email}) - {'Verified' if self.is_verified else 'Pending Permission'}"


class Address(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='addresses')
    full_name=models.CharField(max_length=150)
    phone_number=models.CharField(max_length=20)
    address_line_1=models.CharField(max_length=255)
    address_line_2=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    postal_code=models.CharField(max_length=20)
    country=models.CharField(max_length=100,default='India')
    is_default=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural='Addresses'
        ordering=['-is_default','-created_at']

    def __str__(self):
        return f"{self.full_name}-{self.city},{self.country}"

