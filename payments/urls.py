from django.urls import path
from .views import (
    RazorpayCreateOrderView,
    RazorpayVerifyPaymentView,
    PaymentDetailView,
    OrderPaymentReceiptView
)

urlpatterns = [
    path('razorpay/create-order/', RazorpayCreateOrderView.as_view(), name='razorpay-create-order'),
    path('razorpay/verify/', RazorpayVerifyPaymentView.as_view(), name='razorpay-verify'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('order/<int:order_id>/', OrderPaymentReceiptView.as_view(), name='order-payment-receipt'),
]
