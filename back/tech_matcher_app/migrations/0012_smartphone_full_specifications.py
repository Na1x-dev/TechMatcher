from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tech_matcher_app", "0011_smartphone_source_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="smartphone",
            name="specifications",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="smartphone",
            name="wireless_charging_power",
            field=models.PositiveIntegerField(blank=True, help_text="Мощность беспроводной зарядки, Вт", null=True),
        ),
        migrations.AlterField(
            model_name="smartphone",
            name="nfc",
            field=models.BooleanField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name="smartphone",
            name="has_5g",
            field=models.BooleanField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name="smartphone",
            name="wireless_charging",
            field=models.BooleanField(blank=True, default=None, null=True),
        ),
    ]
