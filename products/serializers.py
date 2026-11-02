from rest_framework import serializers
from .models import Product,Category,ProductImage

class CategorySerializer(models_serializer:=serializers.ModelSerializer):
    products_count=serializers.IntegerField(source='products.count',read_only=True)

    class Meta:
        model=Category
        fields=['id','name','slug','description','image','is_active','products_count']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields=['id','image','alt_text','display_order']

class ProductListSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source='category.name',read_only=True)
    current_price=serializers.DecimalField(max_digits=10,decimal_places=2, read_only=True)
    is_in_stock=serializers.BooleanField(read_only=True)

    class Meta:
        model=Product
        fields=[ 'id', 'name', 'slug', 'sku', 'category', 'category_name','price', 'sale_price', 'current_price', 'main_image','available_colours', 'material', 'is_in_stock', 'is_active']

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source='category.name',read_only=True)
    current_price=serializers.DecimalField(max_digits=10,decimal_places=2,read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'sku', 'category', 'category_name','description', 'price', 'sale_price', 'current_price','stock_quantity', 'is_in_stock', 'available_sizes','available_colours', 'material', 'main_image', 'images',
            'is_active', 'created_at', 'updated_at']

class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields=['id', 'category', 'name', 'slug', 'description', 'sku','price', 'sale_price', 'stock_quantity', 'available_sizes','available_colours', 'material', 'main_image', 'is_active']

        def validate(self,data):
            price=data.get('price',getattr(self.instance,'price',None))
            sale_price=data.get('sale_price',getattr(self.instance,'sale_price',None))

            if sale_price is not None and price is not None and sale_price>=price:
                raise serializers.ValidationError({'sale_price':'sale price must be strictly lower than regular price.'})
            return data
        
       