from django.contrib import admin
from django.db import models
from django.forms import TextInput, Textarea

from .models import Basket, BasketItem, CustomUser, Smartphone

admin.site.register(CustomUser)
admin.site.register(Basket)
admin.site.register(BasketItem)


@admin.register(Smartphone)
class SmartphoneAdmin(admin.ModelAdmin):
    search_fields = ("title", "brand")
    list_filter = ("brand", "launch_year", "os_version")
    ordering = ("-launch_year",)

    fieldsets = (
        (None, {
            "fields": ("title", "brand", "launch_year", "price", "image_url")
        }),
        ("Technical Specifications", {
            "fields": (
                "os_version", "screen_size", "screen_res", "screen_type",
                "screen_fps", "screen_ratio", "ppi", "ram_size", "ram_type",
                "rom_size", "rom_type", "camera_count", "main_camera_mp",
                "camera_type", "max_video_resolution", "front_camera_mp",
                "cpu", "tech_process", "gpu",
            )
        }),
        ("Dimensions and Materials", {
            "fields": (
                "length", "width", "thickness", "weight",
                "back_material", "edges_material", "back_color", "protection",
            )
        }),
        ("Battery and Connectivity", {
            "fields": (
                "accum_type", "accum_volume", "charging_power",
                "wireless_charging", "bluetooth", "audio_port", "charge_port",
                "wifi", "nfc", "has_5g", "sim_count", "sim_type",
            )
        }),
    )

    formfield_overrides = {
        models.CharField: {"widget": TextInput(attrs={"size": "20"})},
        models.TextField: {"widget": Textarea(attrs={"rows": 2, "cols": 100})},
    }
