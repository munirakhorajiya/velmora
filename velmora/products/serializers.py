import random
from django.utils.text import slugify
from rest_framework import serializers
from .models import Product, Category, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 'products_count']

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'display_order']

    def get_image_url(self, obj):
        if not obj.image:
            return ''
        val = str(obj.image).strip().replace('\\', '/')
        if val.startswith('http://') or val.startswith('https://'):
            return val
        if val.startswith('/'):
            return val
        if val.startswith('media/'):
            return f"/{val}"
        return f"/media/{val}"

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    display_image_url = serializers.CharField(read_only=True)
    gallery_images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'category_name',
            'price', 'sale_price', 'current_price', 'stock_quantity',
            'main_image', 'display_image_url', 'gallery_images',
            'available_colours', 'available_sizes', 'material', 'is_in_stock', 'is_active'
        ]

    def get_gallery_images(self, obj):
        urls = []
        for img in obj.images.all().order_by('display_order', 'id'):
            val = str(img.image).strip().replace('\\', '/')
            if val.startswith('http://') or val.startswith('https://') or val.startswith('/'):
                urls.append(val)
            elif val.startswith('media/'):
                urls.append(f"/{val}")
            else:
                urls.append(f"/media/{val}")
        return urls

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    display_image_url = serializers.CharField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    gallery_images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'category_name',
            'description', 'price', 'sale_price', 'current_price',
            'stock_quantity', 'is_in_stock', 'display_image_url',
            'available_sizes', 'available_colours', 'material',
            'main_image', 'images', 'gallery_images',
            'is_active', 'created_at', 'updated_at'
        ]

    def get_gallery_images(self, obj):
        urls = []
        for img in obj.images.all().order_by('display_order', 'id'):
            val = str(img.image).strip().replace('\\', '/')
            if val.startswith('http://') or val.startswith('https://') or val.startswith('/'):
                urls.append(val)
            elif val.startswith('media/'):
                urls.append(f"/{val}")
            else:
                urls.append(f"/media/{val}")
        return urls

class ProductWriteSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    material = serializers.CharField(required=False, allow_blank=True)
    available_sizes = serializers.CharField(required=False, allow_blank=True)
    available_colours = serializers.CharField(required=False, allow_blank=True)
    slug = serializers.CharField(required=False, allow_blank=True)
    sku = serializers.CharField(required=False, allow_blank=True)
    main_image = serializers.CharField(required=False, allow_blank=True)
    gallery_images = serializers.ListField(child=serializers.CharField(), required=False, write_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'name', 'slug', 'description', 'sku',
            'price', 'sale_price', 'stock_quantity', 'available_sizes',
            'available_colours', 'material', 'main_image', 'gallery_images', 'is_active'
        ]

    def validate(self, data):
        price = data.get('price', getattr(self.instance, 'price', None))
        sale_price = data.get('sale_price', getattr(self.instance, 'sale_price', None))

        if sale_price is not None and price is not None and sale_price >= price:
            raise serializers.ValidationError({'sale_price': 'Sale price must be strictly lower than regular price.'})

        # Ensure description is never empty
        if not data.get('description'):
            default_desc = getattr(self.instance, 'description', '') if self.instance else ''
            p_name = data.get('name', getattr(self.instance, 'name', 'Piece') if self.instance else 'Piece')
            data['description'] = default_desc or f"The {p_name} embodies sculptural elegance, handcrafted in limited numbers from sustainably sourced materials with signature Velmora brass hardware."

        # Only generate default slug/sku/main_image during creation
        if not self.instance:
            if not data.get('slug') and data.get('name'):
                base_slug = slugify(data['name'])
                data['slug'] = f"{base_slug}-{random.randint(100, 999)}"

            if not data.get('sku'):
                data['sku'] = f"VEL-{random.randint(1000, 9999)}"

            if not data.get('main_image'):
                data['main_image'] = '/media/editorial/cat_shoulder.jpg'

        return data

    def create(self, validated_data):
        gallery_images = validated_data.pop('gallery_images', None)
        product = super().create(validated_data)
        if gallery_images:
            for i, img_path in enumerate(gallery_images):
                clean_path = str(img_path).replace('/media/', '').strip()
                if clean_path:
                    ProductImage.objects.create(
                        product=product,
                        image=clean_path,
                        display_order=i
                    )
        return product

    def update(self, instance, validated_data):
        gallery_images = validated_data.pop('gallery_images', None)
        product = super().update(instance, validated_data)
        if gallery_images is not None:
            # Sync gallery images
            instance.images.all().delete()
            for i, img_path in enumerate(gallery_images):
                clean_path = str(img_path).replace('/media/', '').strip()
                if clean_path:
                    ProductImage.objects.create(
                        product=product,
                        image=clean_path,
                        display_order=i
                    )
        return product
