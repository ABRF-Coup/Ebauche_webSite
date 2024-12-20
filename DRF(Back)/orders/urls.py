from django.urls import path
from .views import CartView,AddToCartView,UpdateCartItemView,RemoveFromCartView,CreateOrderView


app_name='orders'

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('update/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('remove/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
]
