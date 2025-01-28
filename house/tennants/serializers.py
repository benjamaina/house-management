from rest_framework import serializers
from .models import Tennant, House, RentPayment, FlatBuilding

class FlatBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatBuilding
        fields = ['name', 'address', 'number_of_houses', 'how_many_occupied', 'vacant_houses']
        
class RentPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentPayment
        fields = ['amount', 'payment_date', 'rent_month', 'is_paid']

class TennantSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        model = Tennant
        fields = ['name', 'phone','balance', 'id_number', 'house', 'is_active']
    def get_balance(self, obj):
        return obj.outstanding_rent()

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['address', 'house_num', 'house_size', 'house_rent_amount',]