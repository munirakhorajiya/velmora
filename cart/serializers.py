from decimal import Decimal
from rest_framework import serializers
from products.models import Product
from .models import Cart,CartItem

class CartItemReadSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    unit_price = serializers.DecimalField(source='product.current_price', max_digits=10, decimal_places=2, read_only=True)
    main_image = serializers.ImageField(source='product.main_image', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model=CartItem
        fields=['id', 'product_id', 'product_name', 'product_slug','product_sku', 'unit_price', 'main_image','quantity', 'selected_size', 'selected_colour', 'subtotal']

class CartSerializer(serializers.ModelSerializer):
    items=CartItemReadSerializer(many=True,read_only=True)
    total_items=serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'updated_at'] 

class AddCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)
    selected_size = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    selected_colour = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')     

    def validate(self, data):
        try:
            product=Product.objects.get(id=data['product_id'],is_activate=True)
        
        except Product.DoesNotExist:
            raise serializers.ValidationError({'product_id':'product not found or is no longer available.'})

        if product.stock_quantity<data['quantity']:
            raise serializers.ValidationError({'equality':f"only {product.stock_quantity} item(s) available in stock."})

        data['product']=product
        return data

class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_quantity(self, value):
        cart_item = self.context.get('cart_item')
        if cart_item and cart_item.product.stock_quantity < value:
            raise serializers.ValidationError(f"Cannot update. Only {cart_item.product.stock_quantity} item(s) in stock.")
        return value
