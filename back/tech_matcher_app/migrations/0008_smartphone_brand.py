# Generated by Django 5.1.1 on 2024-09-24 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tech_matcher_app', '0007_alter_smartphone_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='smartphone',
            name='brand',
            field=models.TextField(default=234),
            preserve_default=False,
        ),
    ]