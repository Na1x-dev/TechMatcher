from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from test.support.threading_helper import start_threads
from django.conf import settings


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Создает и возвращает пользователя с электронной почтой и паролем."""
        if not email:
            raise ValueError('Электронная почта должна быть указана')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Создает и возвращает суперпользователя с электронной почтой и паролем."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30, verbose_name='Имя')
    last_name = models.CharField(max_length=30, verbose_name='Фамилия')
    patronymic = models.CharField(max_length=30, verbose_name='Отчество', blank=True)
    email = models.EmailField(unique=True, verbose_name='Электронная почта')
    phone_number = models.CharField(max_length=15, verbose_name='Номер телефона', blank=True)
    image = models.ImageField(upload_to='images/') 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = [] 

    objects = CustomUserManager()

    def __str__(self):
        if len(self.first_name) > 0 and len(self.last_name) > 0 and len(self.patronymic) > 0:
            return f"{self.last_name} {self.first_name[0]}. {self.patronymic[0]}."
        else: 
            return f"admin - {self.email}"
        
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


  

class Smartphone(models.Model):
    launch_year = models.TextField()
    os_version = models.TextField()
    screen_size = models.TextField()
    screen_res = models.TextField()
    screen_type = models.TextField()
    screen_fps = models.TextField()
    ram_size = models.TextField()
    ram_type = models.TextField()
    rom_size = models.TextField()
    rom_type = models.TextField()
    camera_count = models.TextField()
    main_camera_mp = models.TextField()
    camera_type = models.TextField()
    camera_block = models.TextField()
    max_video_resolution = models.TextField()
    front_camera_mp = models.TextField()
    front_camera_aperture = models.TextField()
    cpu = models.TextField()
    tech_process = models.TextField()
    gpu = models.TextField()
    edges_material = models.TextField()
    back_material = models.TextField()
    back_color = models.TextField()
    protection = models.TextField()
    length = models.TextField()
    width = models.TextField()
    thickness = models.TextField()
    weight = models.TextField()
    screen_ratio = models.TextField()
    screen_protector = models.TextField()
    color_count = models.TextField()
    ppi = models.TextField()
    accum_type = models.TextField()
    accum_volume = models.TextField()
    charging_power = models.TextField()
    wireless_charging = models.TextField()
    bluetooth = models.TextField()
    audio_port = models.TextField()
    charge_port = models.TextField()
    wifi = models.TextField()
    nfc = models.BooleanField()
    _5g = models.BooleanField() 
    sim_count = models.TextField()
    sim_type = models.TextField()
    title = models.TextField()
    image_url = models.TextField()
    price = models.TextField(null=True, blank=True)
    brand = models.TextField()

    

    def __str__(self):
        return f"{self.launch_year} - {self.os_version}"

class BasketItem(models.Model):
    smartphone = models.ForeignKey('smartphone', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.smartphone.name} - {self.quantity}"


class Basket(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(BasketItem, blank=True)

    def __str__(self):
        return f"Корзина пользователя: {self.user.email}"

    def total_price(self):
        return sum(item.smartphone.price * item.quantity for item in self.items.all())