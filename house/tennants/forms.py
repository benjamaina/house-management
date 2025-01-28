from django import forms
from .models import Tennant, House, RentPayment

class TennantForm(forms.ModelForm):
    class Meta:
        model = Tennant
        fields = '__all__'