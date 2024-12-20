from rest_framework import serializers
from .models import CartItem, Cart, Order, OrderItem
from products.serializer import ProductSerializerNormale


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializerNormale(read_only=True)  # Pour afficher les détails du produit
    product_id = serializers.IntegerField(write_only=True)  # Pour écrire les données via l'ID du produit

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializerNormale()

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price  # Appelle la propriété définie sur le modèle


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)  # Inclut les articles de commande
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_amount', 'status', 'created_at']

    def create(self, validated_data):
        """
        Personnalisation de la création pour enregistrer les articles de commande.
        """
        items_data = validated_data.pop('items')  # Extrait les articles de la commande
        order = Order.objects.create(**validated_data)  # Crée la commande

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)  # Enregistre chaque article

        return order
