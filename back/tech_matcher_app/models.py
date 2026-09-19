from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Электронная почта должна быть указана')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50, verbose_name='Имя')
    last_name = models.CharField(max_length=50, verbose_name='Фамилия')
    patronymic = models.CharField(max_length=50, verbose_name='Отчество', blank=True)
    email = models.EmailField(unique=True, verbose_name='Электронная почта')
    phone_number = models.CharField(max_length=20, verbose_name='Номер телефона', blank=True)
    image = models.ImageField(upload_to='images/%Y/%m/%d/', default='default_user.svg')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.last_name} {self.first_name[0]}."
        return f"admin - {self.email}"

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class Smartphone(models.Model):
    # Основная информация
    title = models.CharField(max_length=255, db_index=True)
    brand = models.CharField(max_length=100, db_index=True)
    launch_year = models.PositiveIntegerField(null=True, blank=True, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_index=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)

    # Технические характеристики
    os_version = models.CharField(max_length=100, blank=True)
    screen_size = models.FloatField(verbose_name="Диагональ экрана", null=True, blank=True)
    screen_res = models.CharField(max_length=50, blank=True)
    screen_type = models.CharField(max_length=100, blank=True)
    screen_fps = models.PositiveIntegerField(null=True, blank=True)
    screen_ratio = models.CharField(max_length=20, blank=True)
    screen_protector = models.CharField(max_length=100, blank=True)
    ppi = models.PositiveIntegerField(null=True, blank=True)
    color_count = models.CharField(max_length=50, blank=True)

    # Память
    ram_size = models.PositiveIntegerField(verbose_name="ОЗУ (ГБ)", null=True, blank=True)
    ram_type = models.CharField(max_length=50, blank=True)
    rom_size = models.PositiveIntegerField(verbose_name="ПЗУ (ГБ)", null=True, blank=True)
    rom_type = models.CharField(max_length=50, blank=True)

    # Камеры
    camera_count = models.PositiveIntegerField(default=1)
    main_camera_mp = models.CharField(max_length=100, blank=True)
    camera_type = models.CharField(max_length=255, blank=True)
    camera_block = models.TextField(blank=True)
    max_video_resolution = models.CharField(max_length=100, blank=True)
    front_camera_mp = models.CharField(max_length=50, blank=True)
    front_camera_aperture = models.CharField(max_length=50, blank=True)

    # Процессор
    cpu = models.CharField(max_length=255, blank=True)
    tech_process = models.CharField(max_length=50, blank=True)
    gpu = models.CharField(max_length=255, blank=True)

    # Корпус и материалы
    edges_material = models.CharField(max_length=100, blank=True)
    back_material = models.CharField(max_length=100, blank=True)
    back_color = models.CharField(max_length=100, blank=True)
    protection = models.CharField(max_length=100, blank=True)
    length = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    thickness = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)

    # Аккумулятор
    accum_type = models.CharField(max_length=50, blank=True)
    accum_volume = models.PositiveIntegerField(verbose_name="Емкость батареи (mAh)", null=True, blank=True)
    charging_power = models.PositiveIntegerField(null=True, blank=True)
    wireless_charging = models.BooleanField(default=False)

    # Интерфейсы и связь
    bluetooth = models.CharField(max_length=50, blank=True)
    audio_port = models.CharField(max_length=50, blank=True)
    charge_port = models.CharField(max_length=50, blank=True)
    wifi = models.CharField(max_length=100, blank=True)
    nfc = models.BooleanField(default=False)
    has_5g = models.BooleanField(default=False)
    sim_count = models.PositiveIntegerField(default=2)
    sim_type = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.brand} {self.title} ({self.launch_year})"


class BasketItem(models.Model):
    smartphone = models.ForeignKey(Smartphone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.smartphone.title} - {self.quantity} шт."


class Basket(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(BasketItem, blank=True)

    def __str__(self):
        return f"Корзина пользователя: {self.user.email}"

    def total_price(self):
        # Теперь это гарантированно работает, так как price — числовой тип
        return sum(
            (item.smartphone.price or 0) * item.quantity 
            for item in self.items.all()
        )
