from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from test.support.threading_helper import start_threads


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
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'  # Поле для аутентификации
    REQUIRED_FIELDS = []  # Поля, которые обязательны при создании суперпользователя

    objects = CustomUserManager()

    def __str__(self):
        if len(self.first_name) > 0 and len(self.last_name) > 0 and len(self.patronymic) > 0:
            return f"{self.last_name} {self.first_name[0]}. {self.patronymic[0]}."
        else: 
            return f"admin - {self.email}"
        
        
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
