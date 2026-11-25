from django.db import models
import uuid
from decimal import Decimal
from django.conf import settings
from products.models import Product

# Create your models here.
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Payment'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        PROCESSING = 'PROCESSING', 'Processing in Workshop'
        SHIPPED = 'SHIPPED', 'Dispatched / In Transit'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    order_number=models.CharField(max_length=50,unique=True,editable=False)
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name='orders')
    status=models.CharField(max_length=20,choices=Status.choices, default=Status.PENDING)

    subtotal=models.DecimalField(max_digits=10,decimal_places=2)
    shipping_fee=models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))
    discount_amount=models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))
    total_amount=models.DecimalField(max_digits=10,decimal_places=2)

    customer_name=models.CharField(max_length=150)
    phone_number=models.CharField(max_length=20)
    shipping_address=models.TextField(help_text='full delivery address at time of purchase')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
   
    def __str__(self):
        return f"{self.order_number} - {self.user.email} ({self.get_status_display()})"

class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True,blank=True,related_name='order_items')
    product_name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    selected_size = models.CharField(max_length=50, blank=True, default='')
    selected_colour = models.CharField(max_length=50, blank=True, default='')
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} ({self.sku})"

