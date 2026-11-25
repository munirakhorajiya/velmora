from django.db import models
from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator
from products.models import Product

# Create your models here.

class Cart(models.Model):
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='cart')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"cart for {self.user.email}"

    @property
    def total_price(self):
        total = sum(item.subtotal for item in self.cart_items.all())
        return Decimal(total).quantize(Decimal('0.01'))

    @property
    def total_items(self):
        return sum(item.quantity for item in self.cart_items.all())

class CartItem(models.Model):
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name='cart_items')
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='cart_items')
    quantity=models.PositiveIntegerField(default=1,validators=[MinValueValidator(1)])
    selected_size=models.CharField(max_length=50,blank=True,default='')
    selected_colour=models.CharField(max_length=50,blank=True,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together=('cart','product','selected_size','selected_colour')
        ordering=['-created_at']

    @property
    def subtotal(self):
        return Decimal(self.quantity*self.product.current_price).quantize(Decimal('0.01'))

    def __str__(self):
        return f"{self.quantity}x {self.product.name} ({self.selected_colour})"
