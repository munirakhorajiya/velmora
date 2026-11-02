from rest_framework import serializers
from .models import Payment
from orders.models import Order



class PaymentDetailSerializer(serializers.ModelSerializer):
    order_number=serializers.CharField(source='order.order_number',read_only=True)
    user_email=serializers.EmailField(source='user.email',read_only=True)

    class Meta:
        model=Payment
        fields=[
            'id', 'transaction_id', 'order', 'order_number','user_email', 'provider', 'amount', 'currency',
            'status', 'razorpay_order_id', 'razorpay_payment_id','created_at', 'updated_at'
        ]

        read_only_fields=['id', 'transaction_id', 'status', 'created_at', 'updated_at']

class RazorpayCreateOrderSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()

    def validate_order_id(self, value):
        user = self.context['request'].user
        
        try:
            order = Order.objects.get(id=value, user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found or does not belong to your account.")
        
        if order.status == Order.Status.CANCELLED:
            raise serializers.ValidationError("Cannot process payment for a cancelled order.")
        
        if hasattr(order, 'payment') and order.payment.status == Payment.Status.PAID:
            raise serializers.ValidationError("This order has already been paid.")
        return value

class RazorpayVerifyPaymentSerializer(serializers.Serializer):
    order_id=serializers.IntegerField()
    razorpay_order_id=serializers.CharField()
    razorpay_payment_id=serializers.CharField()
    razorpay_signature=serializers.CharField()

    