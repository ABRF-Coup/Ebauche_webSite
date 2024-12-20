from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from .models import Cart, CartItem
from products.models import Product
from .serializer import CartSerializer,OrderSerializer





class CartView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        user = self.request.user
        return get_object_or_404(Cart, user=user)  # Retourne le panier de l'utilisateur
 

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=user)  # Crée le panier si nécessaire
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Product added to cart successfully"}, status=status.HTTP_200_OK)
    

class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        user = request.user
        cart_item_id = request.data.get('cart_item_id')
        new_quantity = request.data.get('quantity')

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=user)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item does not exist or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = new_quantity
        cart_item.save()

        return Response({"message": "Cart item updated successfully"}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        user = request.user
        cart_item_id = request.query_params.get('cart_item_id')

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=user)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item does not exist or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()

        return Response({"message": "Product removed from cart successfully"}, status=status.HTTP_200_OK)
 


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty. Add items to the cart before placing an order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_items = []
        total_amount = 0

        # Création des articles de commande
        for item_data in request.data.get('items', []):
            product_id = item_data['product_id']
            quantity = item_data['quantity']

            try:
                cart_item = cart_items.get(product_id=product_id)
                product = cart_item.product

                # Vérification du stock
                if product.qte_stock < quantity:
                    return Response(
                        {"error": f"Not enough stock for product {product.name} (ID: {product_id})."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Préparer l'article de commande
                order_item = {
                    'product_id': product.id,
                    'quantity': quantity,
                    'price': product.price,
                }
                order_items.append(order_item)

                # Calculer le montant total
                total_amount += product.price * quantity
            except CartItem.DoesNotExist:
                return Response(
                    {"error": f"Product with ID {product_id} does not exist in the cart."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Préparation des données pour le serializer
        order_data = {
            'user': user.id,
            'total_amount': total_amount,
            'items': order_items,
        }

        serializer = OrderSerializer(data=order_data)

        # Validation du serializer
        try:
            serializer.is_valid(raise_exception=True)
        except serializer.ValidationError as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Sauvegarde de la commande et mise à jour des stocks
        order = serializer.save()

        for item in order_items:
            product = Product.objects.get(id=item['product_id'])
            product.qte_stock -= item['quantity']
            product.save()

        # Suppression des articles du panier après commande
        cart_items.delete()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
