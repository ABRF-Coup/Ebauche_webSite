from django.core.management.base import BaseCommand
from users.models import UserCustom  # Remplacez UserCustom par le modèle utilisateur que vous utilisez
from orders.models import Cart

class Command(BaseCommand):
    help = 'Create or link existing users to their carts'

    def handle(self, *args, **kwargs):
        users = UserCustom.objects.all()  # Récupérer tous les utilisateurs existants
        for user in users:
            cart, created = Cart.objects.get_or_create(user=user)
            if created:
                self.stdout.write(f'Cart created for user: {user.user_name}')
            else:
                self.stdout.write(f'Cart already exists for user: {user.user_name}')
