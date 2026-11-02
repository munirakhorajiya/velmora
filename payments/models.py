from django.db import models
import uuid
from django.conf import settings
from orders.models import Order

# Create your models here.

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        AUTHORIZED = 'AUTHORIZED', 'Authorized'
        PAID = 'PAID', 'Paid / Completed'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    class Provider(models.TextChoices):
        RAZORPAY='RAZORPAY','Razorpay'
        DEMO_SIMULATED='DEMO_SIMULATED', 'Demo / Simulated Gateway'
        CASH_ON_DELIVERY = 'COD', 'Cash On Delivery'

    order=models.OneToOneField(Order,on_delete=models.CASCADE,related_name='payment')
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='payments')
    provider=models.CharField(max_length=30,choices=Provider.choices,default=Provider.RAZORPAY)
    transaction_id=models.CharField(max_length=64,unique=True,editable=False)
    amount=models.DecimalField(max_digits=10,decimal_places=2)
    currency=models.CharField(max_length=10,default='INR')
    status=models.CharField(max_length=20,choices=Status.choices,default=Status.PENDING)


    razorpay_order_id=models.CharField(max_length=100,blank=True,null=True)
    razorpay_payment_id=models.CharField(max_length=100,blank=True,null=True)
    razorpay_signature=models.CharField(max_length=255,blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self,*args,**kwargs):
        if not self.transaction_id:
            self.transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}"
            super().save(*args,**kwargs)

    def __str__(self):
        return f"{self.transaction_id} - Order {self.order.order_number} ({self.get_status_display()})"


