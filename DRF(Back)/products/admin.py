from django.contrib import admin
from .models import Product,Category

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display= ('id','name')

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name','price','category','author','qte_stock','description')
    prepopulated_fields =  {'slug':('name',)}





admin.site.register(Category,CategoryAdmin)
admin.site.register(Product,ProductAdmin)


