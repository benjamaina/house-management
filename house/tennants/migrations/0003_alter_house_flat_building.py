# Generated by Django 5.1.4 on 2025-01-30 12:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tennants", "0002_alter_tennant_house"),
    ]

    operations = [
        migrations.AlterField(
            model_name="house",
            name="flat_building",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="house",
                to="tennants.flatbuilding",
            ),
        ),
    ]
