from django.db import models
from core import settings
from products.models import Product



class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        return sum(item.product.price * item.quantity for item in self.items.all())
    

    def __str__(self):
        return f"Cart of {self.user.user_name}"
    


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, 
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.PROTECT
    )
    quantity = models.PositiveIntegerField(default=1)

    def is_available(self):
        return self.product.qte_stock >= self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart.user.user_name}'s cart"
    

    

##################################################""""

class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="orders"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('shipped', 'Shipped'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
        ],
        default='pending'
    )


    def confirm_order(self):
        for item in self.items.all():
            if item.product.qte_stock < item.quantity:
                raise ValueError(f"Not enough stock for {item.product.name}")
            item.product.qte_stock -= item.quantity
            item.product.save()
        self.status = 'paid'
        self.save()

    def __str__(self):
        return f"Order {self.id} by {self.user.user_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.PROTECT
    )
    quantity = models.PositiveIntegerField()
    price = models.FloatField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in order {self.order.id}"

