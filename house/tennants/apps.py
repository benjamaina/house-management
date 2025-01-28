from django.apps import AppConfig


class TennantsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "tennants"
    def ready(self):
        import tennants.signals