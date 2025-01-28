from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from phonenumbers import parse, format_number, PhoneNumberFormat
from django.core.exceptions import ValidationError
# Create your models here.
class Tennant(models.Model):
    name = models.CharField(max_length=50)
    phone = PhoneNumberField(unique=True)
    id_number = models.CharField(max_length=10, default= '00000000', unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rent_due_date = models.DateField(default=datetime.now)
    house = models.ForeignKey('House', on_delete=models.CASCADE, related_name='tennants')
    is_active = models.BooleanField(default=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)


    def save_phone(self, *args, **kwargs):
        if self.phone:
            try:
                parsed_phone = parse(self.phone, "KE")
                self.phone = format_number(parsed_phone, PhoneNumberFormat.INTERNATIONAL)
            except NumberParseException:
                raise ValidationError('Invalid phone number')
        super().save(*args, **kwargs)

    def outstanding_rent(self):
        unpaid_rent = self.rent_payments.filter(is_paid=False)

        if unpaid_rent.exist():
            total = unpaid_rent.aggregate(models.Sum('amount'))['amount__sum']
            return total or 0

        else:
            return 0


    def __str__(self):
        return self.name

class FlatBuilding(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    number_of_houses = models.IntegerField(default=0)
    how_many_occupied = models.IntegerField(default=0, editable=False)
    vacant_houses = models.IntegerField(default=0, editable=False)

    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.vacant_houses = self.number_of_houses - self.how_many_occupied
            self.how_many_occupied = self.houses.filter(occupation=True).count()    
            self.vacant_houses = self.number_of_houses - self.how_many_occupied
            super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class House(models.Model):
    flat_building = models.ForeignKey(FlatBuilding, on_delete=models.CASCADE, related_name='houses')
    house_num = models.CharField(max_length=5, unique=True)
    house_size = models.CharField(max_length=10, default='1 bedroom')
    house_rent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    occupation = models.BooleanField(default=False)

    def clean(self):
        if self.flat_building.number_of_houses > 0:
            number_of_houses = House.objects.filter(flat_building=self.flat_building).count()
            if number_of_houses + 1 > self.flat_building.number_of_houses:
                raise ValidationError(f'The building {self.flat_building.name} is full')
    


    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
        self.flat_building.save()


    def tennant_count(self):
        return f"house{self.house_num}- {self.flat_building.name} has {self.tennants.count()} tennants"


    def __str__(self):
        return f"House {self.house_num}"

class RentPayment(models.Model):
    MONTH_CHOICES = [
        (1, 'January'),
        (2, 'February'),
        (3, 'March'),
        (4, 'April'),
        (5, 'May'),
        (6, 'June'),
        (7, 'July'),
        (8, 'August'),
        (9, 'September'),
        (10, 'October'),
        (11, 'November'),
        (12, 'December')
    ]
    tennant = models.ForeignKey(Tennant, on_delete=models.CASCADE, related_name='rent_payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    rent_month = models.IntegerField(choices=MONTH_CHOICES)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    def is_rent_due(self):
        if not self.rent_month:
            return False
        current_month = timezone.now().month
        return self.rent_month < current_month


    def __str__(self):
        return f'paymen of {self.amount} by {self.tennant.name}'