import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tech_matcher.settings")

app = Celery("tech_matcher")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
