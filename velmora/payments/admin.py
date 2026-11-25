from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'transaction_id', 'order', 'user', 'amount',
        'currency', 'status', 'provider', 'razorpay_payment_id', 'created_at'
    )
    list_filter = ('status', 'provider', 'currency', 'created_at')
    search_fields = (
        'transaction_id', 'order__order_number', 'user__email',
        'razorpay_order_id', 'razorpay_payment_id'
    )
    readonly_fields = (
        'transaction_id', 'order', 'user', 'amount', 'currency',
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'created_at', 'updated_at'
    )

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
