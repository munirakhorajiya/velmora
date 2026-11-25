from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils.text import slugify
# Create your models here.
class Category(models.Model):
    name=models.CharField(max_length=200,unique=True)
    slug=models.SlugField(max_length=140,unique=True,blank=True)
    description=models.TextField(blank=True)
    image=models.ImageField(upload_to='categories/',blank=True,null=True)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)


    class Meta:
        verbose_name_plural='Categories'
        ordering=['name']

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.name)
        super().save(*args,**kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    category=models.ForeignKey(Category,on_delete=models.PROTECT,related_name='products')
    name=models.CharField(max_length=200)
    slug=models.SlugField(max_length=220,unique=True,blank=True)
    description=models.TextField(blank=True)
    sku=models.CharField(max_length=50,unique=True,verbose_name='SKU')
    price=models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0.01)])
    sale_price=models.DecimalField(max_digits=10,decimal_places=2,blank=True,null=True,validators=[MinValueValidator(0.00)])
    stock_quantity=models.PositiveBigIntegerField(default=0)
    available_sizes=models.CharField(max_length=200,blank=True,help_text='comma-separated sizes, e.g. one size, mini, regular')
    available_colours=models.CharField(max_length=200,blank=True,help_text='comma-separated colors, e.g. black, ink, acron, forest')
    material=models.CharField(max_length=150,blank=True,help_text='e.g. capra goat leather, solid brass hardware')
    main_image=models.ImageField(upload_to='products/%Y/%m/',max_length=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering=['-created_at']

    def clean(self):
        if self.sale_price is not None and self.sale_price>=self.price:
            raise ValidationError({'sale_price':'sale price must be strictly lower than regular price.'})

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.name)
        self.full_clean()
        super().save(*args,**kwargs)


    @property
    def current_price(self):
        return self.sale_price if self.sale_price is not None else self.price

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

    @property
    def display_image_url(self):
        val = str(self.main_image or '').strip().replace('\\', '/')
        if not val or val == '/media/editorial/cat_shoulder.jpg':
            first_img = self.images.all().order_by('display_order', 'id').first()
            if first_img and first_img.image:
                val = str(first_img.image).strip().replace('\\', '/')
        if not val:
            return '/media/editorial/cat_shoulder.jpg'

        for prefix in ['http://127.0.0.1:8000', 'http://localhost:8000']:
            if val.startswith(prefix):
                val = val[len(prefix):]
                break

        if val.startswith('http://') or val.startswith('https://'):
            return val
        if val.startswith('/media/'):
            return val
        if val.startswith('media/'):
            return f"/{val}"
        if val.startswith('/'):
            return val
        return f"/media/{val}"

    def __str__(self):
        return f"{self.name}({self.sku})"

class ProductImage(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='images')
    image=models.ImageField(upload_to='products/gallery/%Y/%m',max_length=500)
    alt_text=models.CharField(max_length=150,blank=True)
    display_order=models.PositiveBigIntegerField(default=0)

    class Meta:
        ordering=['display_order','id']

    def __str__(self):
        return f"image for {self.product.name}(#{self.display_order})"
    

        
