from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import RentPayment, House
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.db.models.signals import pre_save


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        
@receiver(post_save, sender=RentPayment)
def notify_tennant(sender, instance, created, **kwargs):
    if created:
        subject = "Rent Payment"
        message = f"Dear {instance.tennant.name},\n\nYour rent payment for the month of {instance.get_rent_month_display()} has been received. Thank you for your payment."
        from_email = settings.EMAIL_HOST_USER
        to_email = [instance.tennant.email]
        send_mail(subject, message, from_email, to_email)

@receiver(pre_save, sender=House)
def vacant_occupied_houses(sender, instance, **kwargs):

    flat_building = instance.flat_building

    if instance.occupation:
        occupied_count = House.objects.filter(flat_building=flat_building, occupation=True).count()
        if occupied_count >= flat_building.number_of_houses:
            raise ValidationError(f'The biulding {flat_building.name} is full')   