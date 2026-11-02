from django.shortcuts import render
from decimal import Decimal
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import (
    OrderDetailSerializer,
    OrderCreateSerializer,
    OrderStatusUpdateSerializer
)
# Create your views here.

class OrderListCreateView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request):
        if request.user.is_staff:
            orders=Order.objects.all()
        else:
            orders=Order.objects.filter(user=request.user)

        serializer=OrderDetailSerializer(orders,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request):
        serializer=OrderCreateSerializer(data=request.data,context={'request':request})
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


        cart=Cart.objects.filter(user=request.user).first()

        if not cart or cart.items.count()==0:
            return Response({'error':'your shopping bag is empty.'},status=status.HTTP_400_BAD_REQUEST)
        
        validated_data=serializer.validated_data

        with transaction.atomic():
            cart_items=list(cart.items.select_related('product').all())

            for item in cart_items:
                if item.product.stock_quantity<item.quantity:
                    return Response({'error':f"sorry,'{item.product.name}'only has {item.product.stock_quantity}itme(s) left in stock"},
                                    status=status.HTTP_400_BAD_REQUEST)
                subtotal=cart.total_price
                shipping_fee=Decimal('0.00')
                discount_amount=Decimal('0.00')
                total_amount=subtotal + shipping_fee - discount_amount

                order=Order.objects.create(
                    user=request.user,
                    customer_name=validated_data['customer_name'],
                    phone_number=validated_data['phone_number'],
                    shipping_address=['shipping_address'],
                    subtotal=subtotal,
                    shipping_fee=shipping_fee,
                    discount_amount=discount_amount,
                    total_amount=total_amount,
                    status=Order.status.CONFIRMED   
                    )
                for item in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        product_name=item.product.name,
                        sku=item.product.sku,
                        unit_price=item.product.current_price,
                        quantity=item.quantity,
                        selected_size=item.selected_size,
                        selected_colour=item.selected_colour,
                        line_total=item.subtotal,)
                    
                item.product.stock_quantity -= item.quantity
                item.product.save(update_fields=['stock_quantity'])

                cart.items.all().delete()

                return Response({
                    'message':'order placed successfully!',
                    'order':OrderDetailSerializer(order).data
                },status=status.HTTP_201_CREATED)

class OrderDetailView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,pk):
        if request.user.is_staff:
            order=get_object_or_404(Order,id=pk)
        else:
            order=get_object_or_404(Order,id=pk,user=request.user)
        serializer=OrderDetailSerializer(order)
        return Response(serializer.data,status=status.HTTP_200_OK)

class OrderCancelView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self,request,pk):
        if request.user.is_staff:
            order=get_object_or_404(Order,id=pk)
        else:
            order=get_object_or_404(Order,id=pk,user=request.user)

        if order.status in [Order.Status.SHIPPED,Order.Status.DELIVERED]:
            return Response({ "error": "This order cannot be cancelled as it has already been dispatched."},
                            status=status.HTTP_400_BAD_REQUEST)

        if order.status==Order.Status.CANCELLED:
            return Response({"error": "This order is already cancelled."},
                            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order.status=Order.Status.CANCELLED
            order.save(update_fields=['status'])

            for item in order.items.all():
                if item.product:
                    item.product.stock_quantity += item.quantity
                    item.product.save(update_fields=['stock_quantity'])

                    return Response({ "message": "Order cancelled successfully. Stock has been restored.","order_number": order.order_number, "status": order.status},
                                    status=status.HTTP_200_OK)


class OrderStatusUpdateView(APIView):
    permission_classes=[permissions.IsAdminUser]

    def patch(self,request,pk):
        order=get_object_or_404(Order,id=pk)
        serializer=OrderStatusUpdateSerializer(order,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message':f"order status updated to {order.status}",
                'order':OrderDetailSerializer(order).data
            },status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
                   
        
                    
