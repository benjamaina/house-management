from django.contrib import admin
from .models import Tennant, House, RentPayment,FlatBuilding

# Register your models here.

admin.site.register(Tennant)
admin.site.register(House)
admin.site.register(RentPayment)
admin.site.register(FlatBuilding)
admin.site.site_header = 'House Administration'

class TennantAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'house', 'date_of_birth', 'date_joined')
    list_filter = ('date_joined', 'house')
    search_fields = ('name', 'phone_number', 'email', 'house')
    ordering = ('date_joined',)