import logging
import uuid

import redis
from celery import shared_task
from django.conf import settings

from tech_matcher_app.models import Smartphone
from tech_matcher_app.services.catalog_parser import run_catalog_parser

logger = logging.getLogger(__name__)


@shared_task(name="tech_matcher_app.tasks.celery_healthcheck")
def celery_healthcheck():
    """Small deterministic task to verify broker, worker, and result backend."""
    return {"status": "ok", "message": "Celery worker processed the healthcheck task"}


@shared_task(
    bind=True,
    name="tech_matcher_app.tasks.parse_smartphone_catalog",
    autoretry_for=(redis.RedisError,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def parse_smartphone_catalog(self, force=False):
    """Fill/update the catalog asynchronously; Redis lock prevents overlapping runs."""
    if not getattr(settings, "PARSER_ENABLED", True):
        return {"status": "disabled"}

    threshold = max(1, int(getattr(settings, "PARSER_MIN_PRODUCTS", 100)))
    current_count = Smartphone.objects.count()
    if not force and current_count >= threshold:
        return {"status": "skipped", "reason": "catalog_threshold_reached", "count": current_count}

    redis_url = getattr(settings, "CELERY_BROKER_URL", "redis://redis:6379/0")
    client = redis.Redis.from_url(redis_url)
    lock_key = "techmatcher:catalog-parser:lock"
    lock_token = str(uuid.uuid4())
    lock_ttl = max(1800, int(getattr(settings, "PARSER_MAX_PAGES", 10)) * 180)

    if not client.set(lock_key, lock_token, nx=True, ex=lock_ttl):
        return {"status": "skipped", "reason": "parser_already_running"}

    try:
        logger.info("Starting catalog parser; current products=%s threshold=%s", current_count, threshold)
        return run_catalog_parser()
    finally:
        # Release only our own lock, even if its TTL was refreshed/reacquired.
        client.eval(
            "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
            1,
            lock_key,
            lock_token,
        )
