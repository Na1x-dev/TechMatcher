from celery import shared_task


@shared_task(name="tech_matcher_app.tasks.celery_healthcheck")
def celery_healthcheck():
    """Small deterministic task to verify broker, worker, and result backend."""
    return {"status": "ok", "message": "Celery worker processed the healthcheck task"}
