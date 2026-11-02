from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_list_or_404
from .models import Cart,CartItem
from .serializers import (
    CartSerializer,
    CartItemReadSerializer,
    AddCartSerializer,
    UpdateCartItemSerializer
)

# Create your views here.

class CartDetailView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        cart, _ =Cart.objects.get_or_create(user=request.user)
        serializer=CartSerializer(cart)
        return Response(serializer.data,status=status.HTTP_200_OK)

class CartItemAddView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer=AddCartSerializer(data=request.data)

        if serializer.is_valid():
            product=serializer._validated_data['product']
            quantity = serializer.validated_data['quantity']
            selected_size = serializer.validated_data.get('selected_size', '')
            selected_colour = serializer.validated_data.get('selected_colour', '')
            cart, _ = Cart.objects.get_or_create(user=request.user)

            cart_item, created=CartItem.objects.get_or_create(cart=cart,product=product,selected_size=selected_size,selected_colour=selected_colour,defaults={'quentity':quantity})

            if not created:
                new_quantity=cart_item.quentity+quantity

                if product.stock_quantity<new_quantity:
                    return Response({'error':f"cannot add more. you have {cart_item.quentity} in cart and only {product.stock_quantity} available."},
                                    status=status.HTTP_400_BAD_REQUEST)
                cart_item.quentity=new_quantity
                cart_item.save()

            item_serializer=CartItemReadSerializer(cart_item)
            return Response({
                'message':'item added to bag successfully',
                'item':item_serializer.data,
                'cart_total_items':cart.total_item,
                'cart_total_price':cart.total_price
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CartItemDetailView(APIView):
    permission_classes=[IsAuthenticated]

    def patch(self,request,pk):
        cart,_=Cart.objects.get_or_create(user=request.user)
        cart_item=get_list_or_404(CartItem,id=pk,cart=cart)
        serializer=UpdateCartItemSerializer(data=request.data,context={'cart_item':cart_item})

        if serializer.is_valid():
            cart_item.quantity=serializer.validated_data['quantity']
            cart_item.save()
            return Response({'message':'quantity updated.',
                             'item':CartItemReadSerializer(cart_item).data,
                             'cart_total_price':cart.total_price
                             },status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
    def delete(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item=get_object_or_404(CartItem, id=pk, cart=cart)
        cart_item.delete()
        return Response({"message": "Item removed from bag.",
                        "cart_total_items": cart.total_items,
                        "cart_total_price": cart.total_price
                         }, status=status.HTTP_200_OK)

class CartClearView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared successfully."}, status=status.HTTP_200_OK)



                
                
