# orders/admin.py
from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem

# Register your models here.

class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)



class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    search_fields = ('product__name', 'cart__user__username')
    list_filter = ('cart',)
    ordering = ('cart',)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at')
    search_fields = ('user__username', 'status')
    list_filter = ('status', 'created_at')
    ordering = ('-created_at',)


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('product__name', 'order__id')
    list_filter = ('order',)
    ordering = ('order',)



admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)