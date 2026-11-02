from django.shortcuts import render
from rest_framework import viewsets,filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Category,ProductImage,Product
from .permissions import IsStaffOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductImageSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductWriteSerializer
)

# Create your views here.

class StandardResultsPagination(PageNumberPagination):
    page_size=12
    page_query_param='page_size'
    max_page_size=50

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class=CategorySerializer
    permission_classes=[IsStaffOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Category.objects.filter(is_active=True)

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes=[IsStaffOrReadOnly]
    pagination_class=StandardResultsPagination
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['name','description','sku','material','available_colours']
    ordering_fields=['price','created_at','name']
    ordering=['-created_at']

    def get_queryset(self):
        if self.request.user.is_staff:
            queryset=Product.objects.all().select_related('category')

        else:
            queryset=Product.objects.filter(is_active=True).select_related('category')
        
        category_slug=self.request.query_params.get('category')

        if category_slug:
            queryset=queryset.filter(category_slug=category_slug)

        in_stock=self.request.query_params.get('in_stock')

        if in_stock and in_stock.lower()=='true':
            queryset=queryset.filter(stock_quentity_gt=0)

        min_price=self.request.query_params.get('min_price')
        max_price=self.request.query_params.get('max_price')

        if min_price:
            queryset=queryset.filter(price_gte=min_price)

        if max_price:
            queryset=queryset.filter(price_lte=max_price)

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

