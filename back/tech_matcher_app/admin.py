from django.contrib import admin
from .models import CustomUser, Basket, BasketItem, Smartphone
from django.db import models
from django.forms import TextInput, Textarea

admin.site.register(CustomUser)
admin.site.register(Basket)
admin.site.register(BasketItem)

@admin.register(Smartphone)
class SmartphoneAdmin(admin.ModelAdmin):
    search_fields = ('title', 'brand')
    list_filter = ('brand', 'launch_year', 'os_version')
    ordering = ('launch_year', )

    fieldsets = (
        (None, {
            'fields': ('title', 'brand', 'launch_year', 'price')
        }),
        ('Technical Specifications', {
            'fields': (
                'os_version', 'screen_size', 'ram_size', 'rom_size',
                'camera_count', 'main_camera_mp', 'cpu', 'gpu'
            )
        }),
        ('Dimensions and Materials', {
            'fields': (
                'length', 'width', 'thickness', 'weight',
                'back_material', 'edges_material'
            )
        }),
        ('Battery and Connectivity', {
            'fields': (
                'accum_volume', 'charging_power', 'wireless_charging',
                'bluetooth', 'wifi', '_5g'
            )
        }),
        ('Images and Media', {
            'fields': ('image_url',)
        }),
    )
    formfield_overrides = {
        models.CharField: {'widget': TextInput(attrs={'size':'20'})},
        models.TextField: {'widget': Textarea(attrs={'rows':2, 'cols':100})},
    }

