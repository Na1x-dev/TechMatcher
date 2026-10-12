from django.core.management.base import BaseCommand

from tech_matcher_app.services.catalog_parser import run_catalog_parser


class Command(BaseCommand):
    help = "Parse smartphone catalog and upsert products through Django ORM."

    def handle(self, *args, **options):
        result = run_catalog_parser()
        self.stdout.write(self.style.SUCCESS(f"Catalog parser finished: {result}"))
