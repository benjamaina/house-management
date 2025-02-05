from django import forms
from .models import Tennant, House, RentPayment

class TennantForm(forms.ModelForm):
    class Meta:
        model = Tennant
        fields = '__all__'
    
    # def clean(self):
    #         cleaned_data = super().clean()
    #         house = cleaned_data.get('house')
    #         is_active = cleaned_data.get('is_active')

    #         # Only check if the tenant is active
    #         if house and is_active:  
    #             # Make sure no other active tenant exists for this house
    #             if house.occupation:  # Assuming house.occupation is True when the house is occupied
    #                 raise ValidationError("This house is already occupied.")

    #         return cleaned_data

class HouseForm(forms.ModelForm):
    class Meta:
        model = House
        fields = '__all__'

class RentPaymentForm(forms.ModelForm):
    class Meta:
        model = RentPayment
        fields = '__all__'

class TennantForm(forms.ModelForm):
    class Meta:
        model = Tennant
        fields = '__all__'