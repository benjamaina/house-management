# Generated by Django 5.1.4 on 2025-01-31 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tennants", "0005_rentpayment_confermation_recieved_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="rentpayment",
            name="amount",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name="rentpayment",
            name="grace_period",
            field=models.IntegerField(default=5),
        ),
    ]
