from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from core import settings

# Fonction pour le chemin de téléchargement des fichiers
def upload_to(instance, filename):
    return 'products/{filename}'.format(filename=filename)

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=False, blank=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    image = models.ImageField(_("Image"), upload_to=upload_to, default='products/asd.png')
    price = models.FloatField(default=100)
    qte_stock = models.IntegerField(default=1)
    description = models.TextField(max_length=500)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
