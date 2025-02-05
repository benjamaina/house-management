from django.contrib import admin
from .models import Tennant, House, RentPayment,FlatBuilding,PaymentHistory
from .forms import TennantForm
# Register your models here.

admin.site.register(Tennant)
admin.site.register(PaymentHistory)
admin.site.register(House)
admin.site.register(RentPayment)
admin.site.site_header = 'House Administration'

class TennantAdmin(admin.ModelAdmin):
    list_display = ("__all__")
class RentPaymentAdmin(admin.ModelAdmin):
    list_display = ('amount', 'payment_date', 'rent_month', 'is_paid', 'tennant', 'patial_payment')

class FlatBuildingAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'number_of_houses', 'how_many_occupied', 'vacant_houses')

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)  # First, save the object to get a primary key
        obj.refresh_from_db()  # Ensure we have fresh data from the database
        obj.how_many_occupied = obj.houses.filter(occupation=True).count()
        obj.vacant_houses = obj.number_of_houses - obj.how_many_occupied
        obj.save()  # Save the updated fields

admin.site.register(FlatBuilding, FlatBuildingAdmin)