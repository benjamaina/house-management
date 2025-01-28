from django.test import TestCase
from .models import Tennant, House

class TennantModelTest(TestCase):
    def setUp(self):
        # Create a House instance
        self.house = House.objects.create(
            address="123 Main St",
            house_num=1,
            house_size="Medium",
            house_rent_amount=1500.00,
            occupation=False,
        )

        # Create a Tennant instance associated with the house
        self.tennant = Tennant.objects.create(
            name="John Doe",
            phone="1234567890",
            email="john@example.com",
            rent_due_date="2025-01-31",
            house=self.house,  # Associate the tennant with the house
        )

    def test_tennant_str(self):
        self.assertEqual(str(self.tennant), "John Doe")
