# Generated by Django 5.1.7 on 2025-04-26 09:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tennants', '0010_alter_tennant_balance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tennant',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
