from django.core.management.base import BaseCommand
from tennants.models import FlatBuilding, House

class Command(BaseCommand):
    help = 'Populate dummy data for house management project'

    def handle(self, *args, **kwargs):
        # Create and save Flat Buildings to ensure they have primary keys
        building1 = FlatBuilding(name="Green View Apartments", address="123 Green Street", number_of_houses=5)
        building1.save()  # Save to generate the primary key

        building2 = FlatBuilding(name="Blue Sky Towers", address="456 Blue Avenue", number_of_houses=3)
        building2.save()  # Save to generate the primary key

        # Add Houses to Green View Apartments
        House.objects.create(flat_building=building1, house_num="A1", house_size="2 bedroom", house_rent_amount=1500.00, occupation=True)
        House.objects.create(flat_building=building1, house_num="A2", house_size="1 bedroom", house_rent_amount=1200.00, occupation=False)
        House.objects.create(flat_building=building1, house_num="A3", house_size="1 bedroom", house_rent_amount=1100.00, occupation=True)
        House.objects.create(flat_building=building1, house_num="A4", house_size="3 bedroom", house_rent_amount=2500.00, occupation=False)
        House.objects.create(flat_building=building1, house_num="A5", house_size="2 bedroom", house_rent_amount=1800.00, occupation=True)

        # Add Houses to Blue Sky Towers
        House.objects.create(flat_building=building2, house_num="B1", house_size="1 bedroom", house_rent_amount=1000.00, occupation=False)
        House.objects.create(flat_building=building2, house_num="B2", house_size="2 bedroom", house_rent_amount=2000.00, occupation=True)
        House.objects.create(flat_building=building2, house_num="B3", house_size="3 bedroom", house_rent_amount=3000.00, occupation=True)

        self.stdout.write(self.style.SUCCESS('Dummy data populated successfully!'))
