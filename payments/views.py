import razorpay
from django.conf import settings
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment
from orders.models import Order
from .serializers import (
    PaymentDetailSerializer,
    RazorpayCreateOrderSerializer,
    RazorpayVerifyPaymentSerializer
)


class RazorpayCreateOrderView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self,request):
        serializer=RazorpayCreateOrderSerializer(data=request.data,context={'request':request})
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        order_id=serializer.validated_data['order_id']
        order=Order.objects.get(id=order_id,user=request.user)

        amount_in_paise=int(order.total_amount*100)

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({
                "error": "Razorpay API keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        client = get_razorpay_client()

        try:
            razorpay_order=client.order.create({
                 "amount": amount_in_paise,
                "currency": settings.RAZORPAY_CURRENCY,
                "receipt": f"receipt_{order.order_number}",
                "notes": {
                    "order_id": order.id,
                    "order_number": order.order_number,
                    "customer_email": request.user.email
                }
            })

        except Exception as e:
            return Response({ "error": f"Failed to connect to Razorpay: {str(e)}"},
                           status=status.HTTP_502_BAD_GATEWAY)

        payment,_=Payment.objects.get_or_create(order=order,defaults={
                'user': request.user,
                'amount': order.total_amount,
                'currency': settings.RAZORPAY_CURRENCY,
                'provider': Payment.Provider.RAZORPAY,
                'status': Payment.Status.PENDING
        })

        payment.razorpay_order_id=razorpay_order['id']
        payment.save(update_fields=['razorpay_order_id'])

        return Response({
            "key_id": settings.RAZORPAY_KEY_ID,
            "razorpay_order_id": razorpay_order['id'],
            "amount": amount_in_paise,
            "currency": settings.RAZORPAY_CURRENCY,
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "customer_email": request.user.email,
            "phone_number": order.phone_number
        }, status=status.HTTP_200_OK)
       
class RazorpayVerifyPaymentView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def post(self,request):
        serializer=RazorpayVerifyPaymentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        order_id=serializer.validated_data['order_id']
        razorpay_order_id=serializer.validated_data['order_id']
        razorpay_payment_id=serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']
        order = get_object_or_404(Order, id=order_id, user=request.user)
        payment = get_object_or_404(Payment, order=order)
        client = get_razorpay_client()
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            client.utility.verify_payment_signature(params_dict)

        except razorpay.errors.SignatureVerificationError:
            payment.status = Payment.Status.FAILED
            payment.save(update_fields=['status'])
            return Response({
                "error": "Payment verification failed: Invalid signature."
            },
            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            payment.status=Payment.status.PAID
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.save(update_fields=['status', 'razorpay_payment_id', 'razorpay_signature'])
            order.status = Order.Status.PROCESSING
            order.save(update_fields=['status'])
        
        return Response({
            "message": "Payment verified successfully! Your order is now being processed.",
            "payment": PaymentDetailSerializer(payment).data,
            "order_status": order.status
        }, status=status.HTTP_200_OK)
    
class PaymentDetailView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,pk):
        if request.user.is_staff:
             payment = get_object_or_404(Payment, id=pk)
        
        else:
            payment = get_object_or_404(Payment, id=pk, user=request.user)
        
        serializer = PaymentDetailSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderPaymentReceiptView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, order_id):
        
        if request.user.is_staff:
            order = get_object_or_404(Order, id=order_id)
        
        else:
            order = get_object_or_404(Order, id=order_id, user=request.user)
        
        payment = get_object_or_404(Payment, order=order)
        serializer = PaymentDetailSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)

