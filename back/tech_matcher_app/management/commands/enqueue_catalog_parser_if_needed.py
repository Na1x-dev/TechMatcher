from django.conf import settings
from django.core.management.base import BaseCommand

from tech_matcher_app.models import Smartphone
from tech_matcher_app.tasks import parse_smartphone_catalog


class Command(BaseCommand):
    help = "Queue catalog parsing at startup only when the catalog is below its configured threshold."

    def handle(self, *args, **options):
        if not getattr(settings, "PARSER_ENABLED", True):
            self.stdout.write("Catalog parser is disabled.")
            return

        threshold = max(1, int(getattr(settings, "PARSER_MIN_PRODUCTS", 100)))
        count = Smartphone.objects.count()
        if count >= threshold:
            self.stdout.write(f"Catalog already contains {count} products (threshold {threshold}); skipping.")
            return

        result = parse_smartphone_catalog.delay()
        self.stdout.write(self.style.SUCCESS(
            f"Queued catalog parser task {result.id}; current products={count}, threshold={threshold}."
        ))
