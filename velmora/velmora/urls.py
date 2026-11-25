from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

def api_root_view(request):
    """
    Root status endpoint for Velmora Headless Backend.
    """
    return JsonResponse({
        'name': 'Velmora Atelier Headless API Server',
        'status': 'online',
        'version': 'v1',
        'documentation': '/api/docs/',
        'admin_panel': '/admin/',
        'endpoints': {
            'accounts': '/api/v1/accounts/',
            'products': '/api/v1/products/',
            'categories': '/api/v1/categories/',
            'cart': '/api/v1/cart/',
            'orders': '/api/v1/orders/',
            'payments': '/api/v1/payments/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root_view, name='api_root'),

    # Swagger Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Headless REST APIs for React Frontend
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/', include('products.urls')),
    path('api/v1/cart/', include('cart.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/payments/', include('payments.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
