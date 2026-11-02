from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'sku', 'unit_price', 'quantity', 'selected_colour', 'selected_size', 'line_total')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__email', 'customer_name', 'phone_number')
    readonly_fields = ('order_number', 'subtotal', 'total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
