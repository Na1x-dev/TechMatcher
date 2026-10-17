import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or ensure the configured Django superuser exists (safe to run repeatedly)."

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.getenv("ADMIN_EMAIL", "admin@example.com").strip().lower()
        password = os.getenv("ADMIN_PASSWORD", "")
        first_name = os.getenv("ADMIN_FIRST_NAME", "Admin")
        last_name = os.getenv("ADMIN_LAST_NAME", "Administrator")

        if not password:
            raise CommandError(
                "ADMIN_PASSWORD is empty. Set it in your local .env before starting the backend."
            )

        user = User.objects.filter(email__iexact=email).first()
        if user:
            changed_fields = []
            if not user.is_staff:
                user.is_staff = True
                changed_fields.append("is_staff")
            if not user.is_superuser:
                user.is_superuser = True
                changed_fields.append("is_superuser")
            if not user.is_active:
                user.is_active = True
                changed_fields.append("is_active")
            if changed_fields:
                user.save(update_fields=changed_fields)
                self.stdout.write(self.style.WARNING(
                    f"Existing account {email} promoted to superuser; password was not changed."
                ))
            else:
                self.stdout.write(self.style.SUCCESS(
                    f"Superuser {email} already exists; nothing to change."
                ))
            return

        user = User.objects.create_superuser(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        self.stdout.write(self.style.SUCCESS(f"Created superuser: {user.email}"))
