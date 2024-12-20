from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Cart
from users.models import UserCustom  # Assurez-vous que votre utilisateur a un modèle spécifique

@receiver(post_save, sender=UserCustom)  # Le signal s'exécutera après la création d'un UserCustom
def create_user_cart(sender, instance, created, **kwargs):
    if created:
        Cart.objects.get_or_create(user=instance)
