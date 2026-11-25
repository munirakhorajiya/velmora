from products.models import Product
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
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff or getattr(request.user, 'role', '') in ['ADMIN', 'SERVICE_PROVIDER'] or request.user.is_superuser:
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')

        serializer = OrderDetailSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        raw_items = request.data.get('items', [])

        cart = Cart.objects.filter(user=request.user).first() if request.user.is_authenticated else None

        if not raw_items and (not cart or cart.cart_items.count() == 0):
            return Response({'error': 'Your shopping bag is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            subtotal = Decimal('0.00')
            order_items_to_create = []

            if raw_items:
                for item_data in raw_items:
                    prod_id = item_data.get('product_id') or item_data.get('id')
                    qty = int(item_data.get('quantity', 1))
                    try:
                        product = Product.objects.get(id=prod_id)
                    except Product.DoesNotExist:
                        return Response({'error': f"Product ID {prod_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

                    if product.stock_quantity < qty:
                        return Response({
                            'error': f"Sorry, '{product.name}' only has {product.stock_quantity} item(s) left in stock."
                        }, status=status.HTTP_400_BAD_REQUEST)

                    price = product.current_price
                    line_total = price * qty
                    subtotal += line_total

                    order_items_to_create.append({
                        'product': product,
                        'product_name': product.name,
                        'sku': product.sku,
                        'unit_price': price,
                        'quantity': qty,
                        'selected_size': item_data.get('selected_size', item_data.get('size', '')),
                        'selected_colour': item_data.get('selected_colour', item_data.get('color', '')),
                        'line_total': line_total,
                    })
            else:
                cart_items = list(cart.cart_items.select_related('product').all())
                for item in cart_items:
                    if item.product.stock_quantity < item.quantity:
                        return Response({
                            'error': f"Sorry, '{item.product.name}' only has {item.product.stock_quantity} item(s) left in stock."
                        }, status=status.HTTP_400_BAD_REQUEST)
                    line_total = item.product.current_price * item.quantity
                    subtotal += line_total
                    order_items_to_create.append({
                        'product': item.product,
                        'product_name': item.product.name,
                        'sku': item.product.sku,
                        'unit_price': item.product.current_price,
                        'quantity': item.quantity,
                        'selected_size': item.selected_size,
                        'selected_colour': item.selected_colour,
                        'line_total': line_total,
                    })

            shipping_fee = Decimal('0.00')
            discount_amount = Decimal('0.00')
            total_amount = subtotal + shipping_fee - discount_amount

            order_user = request.user if request.user.is_authenticated else None
            if not order_user:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                order_user = User.objects.filter(is_staff=True).first()

            order = Order.objects.create(
                user=order_user,
                customer_name=validated_data['customer_name'],
                phone_number=validated_data['phone_number'],
                shipping_address=validated_data['shipping_address'],
                subtotal=subtotal,
                shipping_fee=shipping_fee,
                discount_amount=discount_amount,
                total_amount=total_amount,
                status=Order.Status.CONFIRMED
            )

            for item_info in order_items_to_create:
                OrderItem.objects.create(
                    order=order,
                    product=item_info['product'],
                    product_name=item_info['product_name'],
                    sku=item_info['sku'],
                    unit_price=item_info['unit_price'],
                    quantity=item_info['quantity'],
                    selected_size=item_info['selected_size'],
                    selected_colour=item_info['selected_colour'],
                    line_total=item_info['line_total'],
                )
                prod = item_info['product']
                prod.stock_quantity -= item_info['quantity']
                prod.save(update_fields=['stock_quantity'])

            if cart:
                cart.cart_items.all().delete()

            return Response({
                'message': 'Order placed successfully!',
                'order': OrderDetailSerializer(order).data
            }, status=status.HTTP_201_CREATED)

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
            order.status = Order.Status.CANCELLED
            order.save(update_fields=['status'])
        
            for item in order.items.all():
                if item.product:
                    item.product.stock_quantity += item.quantity
                    item.product.save(update_fields=['stock_quantity'])
        
        return Response(
            {
                "message": "Order cancelled successfully. Stock has been restored.",
                "order_number": order.order_number,
                "status": order.status,
            },
            status=status.HTTP_200_OK,
        )

class OrderStatusUpdateView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not (request.user.is_staff or getattr(request.user, 'role', '') in ['ADMIN', 'SERVICE_PROVIDER'] or request.user.is_superuser):
            self.permission_denied(request, message="Administrator credentials required.")

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
                   
        
                    
