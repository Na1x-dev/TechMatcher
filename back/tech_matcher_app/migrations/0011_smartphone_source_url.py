from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tech_matcher_app", "0010_remove_smartphone__5g_smartphone_has_5g_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="smartphone",
            name="source_url",
            field=models.URLField(blank=True, max_length=500, null=True, unique=True),
        ),
    ]
