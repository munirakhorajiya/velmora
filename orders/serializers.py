from decimal import Decimal
from rest_framework import serializers
from .models import Order,OrderItem
from accounts.models import Address

class OrderItemSerializer(serializers.ModelSerializer):
    model=OrderItem
    fields=[ 'id', 'product', 'product_name', 'sku','unit_price', 'quantity', 'selected_size','selected_colour', 'line_total']

class OrderDetailSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    user_email=serializers.EmailField(source='user.email',read_only=True)

    class Meta:
        model=Order
        fields=['id', 'order_number', 'user_email', 'status','subtotal', 'shipping_fee', 'discount_amount', 'total_amount','customer_name', 'phone_number', 'shipping_address','items', 'created_at', 'updated_at']

class OrderCreateSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    customer_name = serializers.CharField(max_length=150, required=False)
    phone_number = serializers.CharField(max_length=20, required=False)
    shipping_address = serializers.CharField(required=False)

    def validate(self, data):
        user=self.context['request'].user
        address_id=data.get('address_id')

        if address_id:
            try:
                address=Address.objects.get(id=address_id,user=user)
                data['customer_name']=address.full_name
                data['phone_number']=address.phone_number
                data['shipping_address']=f"{address.address_line_1},{address.city},{address.state},{address.postal_code},{address.country}"

            except Address.DoesNotExist:
                raise serializers.ValidationError({'address_id':'invalid saved address id.'})


        else:
            if not data.get('customer_name') or not data.get('phone_number') or not data.get('shipping_address'):
                raise serializers.ValidationError("please provide address_id or complete shipping address details.")
        return data

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
