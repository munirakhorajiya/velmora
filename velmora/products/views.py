import json
from decimal import Decimal
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Category, ProductImage, Product
from .permissions import IsStaffOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductImageSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductWriteSerializer
)
from orders.models import Order, OrderItem
from accounts.models import Address
from payments.models import Payment
from django.conf import settings
import razorpay

# Create your views here.
def home_view(request):
    return render(request, 'home.html')

COLLECTION_METADATA = {
    'all': {
        'department': 'all',
        'title': 'COLLECTIONS',
        'subtitle': 'All Collections',
        'breadcrumb': 'Shop All',
        'description': 'Explore our complete curation of handcrafted leather handbags, artisan footwear, and small goods crafted in limited editions.'
    },
    'bags': {
        'department': 'Bags',
        'title': 'BAGS',
        'subtitle': 'Handbags',
        'breadcrumb': 'Bags',
        'description': 'Every style, in every shade. Browse the complete Velmora collection of handcrafted leather bags - totes, shoulder bags, crossbody styles, and clutches.'
    },
    'shop-all-bags': {
        'department': 'Bags',
        'title': 'BAGS',
        'subtitle': 'Handbags',
        'breadcrumb': 'Bags',
        'description': 'Every style, in every shade. Browse the complete Velmora collection of handcrafted leather bags - totes, shoulder bags, crossbody styles, and clutches.'
    },
    'all-bags': {
        'department': 'Bags',
        'title': 'BAGS',
        'subtitle': 'Handbags',
        'breadcrumb': 'Bags',
        'description': 'Every style, in every shade. Browse the complete Velmora collection of handcrafted leather bags - totes, shoulder bags, crossbody styles, and clutches.'
    },
    'shoes': {
        'department': 'Shoes',
        'title': 'SHOES',
        'subtitle': 'Footwear',
        'breadcrumb': 'Shoes',
        'description': 'Every style, every season. Browse the complete Velmora footwear collection - flats, loafers, boots, sneakers, heels, and sandals, all in one place.'
    },
    'accessories': {
        'department': 'Accessories',
        'title': 'ACCESSORIES',
        'subtitle': 'Small Leather Goods',
        'breadcrumb': 'Accessories',
        'description': 'Handcrafted small leather goods made to accompany you everywhere. Browse the complete Velmora accessories collection - wallets, belts, scarves, and leather care.'
    },
    'wallets': {
        'department': 'Accessories',
        'category': 'Wallets',
        'title': 'WALLETS',
        'subtitle': 'Leather Wallets',
        'breadcrumb': 'Wallets',
        'description': 'Every wallet style, in one place. From slim cardholders to full-sized leather wallets, browse the complete Velmora wallet collection and find the one that fits how you carry.'
    },
    'all-footwear': {
        'department': 'Shoes',
        'title': 'ALL FOOTWEAR',
        'subtitle': 'Footwear',
        'breadcrumb': 'All Footwear',
        'description': 'Every style, every season. Browse the complete Velmora footwear collection - flats, loafers, boots, sneakers, heels, and sandals, all in one place.'
    },
    'footwear': {
        'department': 'Shoes',
        'title': 'FOOTWEAR',
        'subtitle': 'Footwear',
        'breadcrumb': 'Footwear',
        'description': 'Every style, every season. Browse the complete Velmora footwear collection - flats, loafers, boots, sneakers, heels, and sandals, all in one place.'
    },
    'new-arrivals': {
        'department': 'all',
        'badge': 'New Season',
        'title': 'NEW ARRIVALS',
        'subtitle': 'Resort & Spring Editions',
        'breadcrumb': 'New Arrivals',
        'description': 'The latest additions to the Velmora maison. Introducing sculptural silhouettes, fresh seasonal color palettes, and handcrafted tactile leathers.'
    }
}

def collections_view(request, collection_slug=None):
    slug_key = (collection_slug or '').lower().strip()
    dept_param = request.GET.get('department', '').lower().strip()
    cat_param = request.GET.get('category', '').lower().strip()

    if slug_key in COLLECTION_METADATA:
        meta = COLLECTION_METADATA[slug_key]
    elif cat_param in COLLECTION_METADATA:
        meta = COLLECTION_METADATA[cat_param]
    elif dept_param in COLLECTION_METADATA:
        meta = COLLECTION_METADATA[dept_param]
    elif cat_param in ['bags', 'shoes', 'accessories']:
        meta = COLLECTION_METADATA[cat_param]
    else:
        meta = COLLECTION_METADATA['all']

    context = {
        'active_dept': meta['department'],
        'collection_title': meta['title'],
        'collection_desc': meta['description'],
        'breadcrumb_label': meta['breadcrumb'],
        'collection_slug': collection_slug or '',
        'initial_category': request.GET.get('category', ''),
        'initial_badge': meta.get('badge', request.GET.get('badge', ''))
    }
    return render(request, 'products/collections.html', context)

def product_detail_view(request, product_id):
    return render(request, 'products/details.html', {
        'product_id': str(product_id).strip(),
    })

def cart_view(request):
    return render(request, 'cart/cart.html')

def checkout_view(request):
    """
    Checkout & Order Confirmation View:
    - Without login, user cannot access checkout or confirm an order.
      Redirects to /login/?next=/checkout/ with notice.
    - If logged in, automatically pre-fills user's contact details:
      email, first_name, last_name, phone_number, and default shipping address.
    - On POST (order confirmation):
      Creates real Order and OrderItem records in PostgreSQL and renders receipt.
    """
    if not request.user.is_authenticated:
        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
            return JsonResponse({
                'success': False,
                'error': 'Authentication required. Please sign in to your Velmora account to confirm order.',
                'redirect_url': '/login/?next=/checkout/'
            }, status=401)
        messages.info(request, "Please sign in to your Velmora account to proceed with checkout and confirm your order.")
        return redirect('/login/?next=/checkout/')

    user = request.user
    default_addr = None
    if user.is_authenticated:
        try:
            default_addr = user.addresses.filter(is_default=True).first() or user.addresses.first()
        except Exception:
            default_addr = None

    user_first_name = user.first_name if user.is_authenticated and user.first_name else ''
    user_last_name = user.last_name if user.is_authenticated and user.last_name else ''
    user_email = user.email if user.is_authenticated and user.email else ''
    user_phone = (user.phone_number if user.is_authenticated and user.phone_number else '') or (default_addr.phone_number if default_addr else '') or ''
    street_address_val = default_addr.address_line_1 if default_addr else ''
    city_val = default_addr.city if default_addr else 'Auckland'
    postal_code_val = default_addr.postal_code if default_addr else '1010'

    if request.method == 'POST':
        # Handle both JSON payloads and form posts
        if request.content_type == 'application/json':
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception:
                payload = {}
        else:
            payload = request.POST

        first_name = payload.get('first_name', user.first_name or '').strip()
        last_name = payload.get('last_name', user.last_name or '').strip()
        email = payload.get('email', user.email).strip()
        phone_number = payload.get('phone_number', user.phone_number or '').strip()
        street_address = payload.get('street_address', '').strip()
        city = payload.get('city', '').strip()
        postal_code = payload.get('postal_code', '').strip()
        items_raw = payload.get('cart_items', '[]')

        if isinstance(items_raw, str):
            try:
                cart_items = json.loads(items_raw)
            except Exception:
                cart_items = []
        else:
            cart_items = items_raw or []

        # Auto-update user profile details if provided
        user_updated = False
        if phone_number and user.phone_number != phone_number:
            user.phone_number = phone_number
            user_updated = True

        if first_name and user.first_name != first_name:
            user.first_name = first_name
            user_updated = True

        if last_name and user.last_name != last_name:
            user.last_name = last_name
            user_updated = True

        if user_updated:
            user.save()

        # Create or update default address
        if street_address:
            if default_addr:
                default_addr.address_line_1 = street_address
                if city:
                    default_addr.city = city
                if postal_code:
                    default_addr.postal_code = postal_code
                default_addr.save()
            else:
                default_addr = Address.objects.create(
                    user=user,
                    full_name=f"{first_name} {last_name}".strip() or user.email,
                    phone_number=phone_number or user.phone_number,
                    address_line_1=street_address,
                    city=city or 'Auckland',
                    state=city or 'Auckland',
                    postal_code=postal_code or '1010',
                    is_default=True
                )

        full_shipping_address = f"{street_address}, {city} {postal_code}".strip(", ")
        if not full_shipping_address and default_addr:
            full_shipping_address = f"{default_addr.address_line_1}, {default_addr.city} {default_addr.postal_code}".strip(", ")
        if not full_shipping_address:
            full_shipping_address = "Complimentary Boutique Dispatch"

        # Calculate total
        subtotal = Decimal('0.00')
        for itm in cart_items:
            try:
                p = Decimal(str(itm.get('price', 0)))
                q = int(itm.get('quantity', 1))
                subtotal += (p * q)
            except Exception:
                pass

        if subtotal <= 0:
            subtotal = Decimal('350.00')

        payment_method = payload.get('payment_method', 'RAZORPAY').upper().strip()
        if payment_method not in ['RAZORPAY', 'COD']:
            payment_method = 'RAZORPAY'

        # Initial order status based on payment method
        initial_order_status = Order.Status.CONFIRMED if payment_method == 'COD' else Order.Status.PENDING

        order = Order.objects.create(
            user=user,
            customer_name=f"{first_name} {last_name}".strip() or user.email,
            phone_number=phone_number or user.phone_number or "+64 21 000 0000",
            shipping_address=full_shipping_address,
            subtotal=subtotal,
            shipping_fee=Decimal('0.00'),
            total_amount=subtotal,
            status=initial_order_status
        )

        for itm in cart_items:
            p_name = itm.get('name', 'Velmora Atelier Piece')
            color = itm.get('color', 'Standard')
            q = int(itm.get('quantity', 1))
            p = Decimal(str(itm.get('price', 0)))
            p_obj = None
            raw_id = str(itm.get('id', ''))
            if raw_id.isdigit():
                p_obj = Product.objects.filter(id=int(raw_id)).first()

            OrderItem.objects.create(
                order=order,
                product=p_obj,
                product_name=p_name,
                sku=f"VEL-{raw_id.upper()}" if raw_id else "VEL-PIECE",
                unit_price=p,
                quantity=q,
                selected_colour=color,
                line_total=p * q
            )

        # Handle Cash on Delivery (COD)
        if payment_method == 'COD':
            Payment.objects.create(
                order=order,
                user=user,
                provider=Payment.Provider.CASH_ON_DELIVERY,
                amount=subtotal,
                currency='INR',
                status=Payment.Status.PENDING
            )

            if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
                return JsonResponse({
                    'success': True,
                    'payment_method': 'COD',
                    'order_id': order.id,
                    'order_number': order.order_number,
                    'total_amount': str(order.total_amount),
                    'redirect_url': f'/checkout/confirmation/{order.id}/'
                })
            return redirect('order_confirmation', order_id=order.id)

        # Handle Razorpay (UPI, Cards, NetBanking)
        try:
            rzp_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            amount_in_paise = int(order.total_amount * 100)
            rzp_order = rzp_client.order.create({
                "amount": amount_in_paise,
                "currency": settings.RAZORPAY_CURRENCY,
                "receipt": f"rcpt_{order.order_number}",
                "notes": {
                    "order_id": str(order.id),
                    "order_number": order.order_number,
                    "customer_email": user.email
                }
            })

            Payment.objects.create(
                order=order,
                user=user,
                provider=Payment.Provider.RAZORPAY,
                amount=order.total_amount,
                currency=settings.RAZORPAY_CURRENCY,
                status=Payment.Status.PENDING,
                razorpay_order_id=rzp_order['id']
            )

            return JsonResponse({
                'success': True,
                'payment_method': 'RAZORPAY',
                'order_id': order.id,
                'order_number': order.order_number,
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'razorpay_order_id': rzp_order['id'],
                'amount': amount_in_paise,
                'currency': settings.RAZORPAY_CURRENCY,
                'customer_name': order.customer_name,
                'customer_email': user.email,
                'customer_phone': order.phone_number
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Failed to initialize Razorpay gateway: {str(e)}'
            }, status=502)

    return render(request, 'checkout.html', {
        'user': user,
        'user_first_name': user_first_name,
        'user_last_name': user_last_name,
        'user_email': user_email,
        'user_phone': user_phone,
        'street_address_val': street_address_val,
        'city_val': city_val,
        'postal_code_val': postal_code_val,
        'default_address': default_addr,
        'razorpay_key_id': settings.RAZORPAY_KEY_ID,
        'razorpay_currency': settings.RAZORPAY_CURRENCY
    })


@login_required(login_url='/login/')
def order_confirmation_view(request, order_id):
    """
    Displays the luxury order confirmation receipt.
    Only accessible by the authenticated user who placed the order.
    """
    order = get_object_or_404(Order, id=order_id, user=request.user)
    payment = getattr(order, 'payment', None)
    return render(request, 'order_confirmation.html', {
        'order': order,
        'payment': payment
    })

def loyalty_view(request):
    return render(request, 'pages/loyalty.html')

def transparency_view(request):
    return render(request, 'pages/transparency.html')

def stores_view(request):
    return render(request, 'pages/stores.html')

def journal_view(request):
    return render(request, 'pages/journal.html')

def shipping_view(request):
    return render(request, 'pages/shipping.html')

def contact_view(request):
    return render(request, 'pages/contact.html')

class StandardResultsPagination(PageNumberPagination):
    page_size=12
    page_size_query_param='page_size'
    max_page_size=500

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class=CategorySerializer
    permission_classes=[IsStaffOrReadOnly]
    queryset = Category.objects.all()

    def get_queryset(self):
        return Category.objects.all()

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes=[IsStaffOrReadOnly]
    pagination_class=StandardResultsPagination
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['name','description','sku','material','available_colours']
    ordering_fields=['price','created_at','name']
    ordering=['-created_at']

    def get_queryset(self):
        is_admin = bool(
            self.request.user and 
            self.request.user.is_authenticated and 
            (self.request.user.is_staff or getattr(self.request.user, 'role', '') == 'ADMIN' or self.request.user.is_superuser)
        )
        if is_admin:
            queryset = Product.objects.all().select_related('category')
        else:
            queryset = Product.objects.filter(is_active=True).select_related('category')
        
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        in_stock = self.request.query_params.get('in_stock')
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)

        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def get_serializer_class(self):
        if self.action=='retrieve':
            return ProductDetailSerializer
        elif self.action in ['create','update','partial_update']:
            return ProductWriteSerializer
        return ProductListSerializer

    @action(detail=False,methods=['get'])
    def featured(self,request):
        featured_products=Product.objects.filter(is_active=True)[:6]
        serializer=ProductListSerializer(featured_products,many=True)
        return Response(serializer.data)

    @action(detail=True,methods=['post'],permission_classes=[IsStaffOrReadOnly])
    def upload_image(self,request,pk=None):
        product=self.get_object()
        serializer=ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)

