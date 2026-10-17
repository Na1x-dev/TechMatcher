# TechMatcher — подбор и сравнение смартфонов

TechMatcher — веб-приложение для выбора смартфона по характеристикам. В каталоге можно искать устройства, открывать подробные карточки, добавлять товары в корзину и сравнивать несколько моделей. Интерфейс на русском языке адаптирован для компьютеров, планшетов и мобильных телефонов.

## Возможности

- **Каталог смартфонов:** поиск по моделям и брендам, просмотр списка устройств и переход к подробной карточке.
- **Характеристики:** сгруппированные сведения об экране, процессоре, памяти, камерах, аккумуляторе и интерфейсах.
- **Сравнение моделей:** добавление устройств в список сравнения и просмотр их характеристик рядом. На небольших экранах карточки сравнения можно прокручивать по горизонтали.
- **Корзина:** добавление и удаление товаров. Для гостя содержимое хранится локально; для вошедшего пользователя используется API.
- **Учётная запись:** регистрация, вход, выход и редактирование профиля, включая фото пользователя.
- **Вход через Google:** поддерживается при настройке Google Client ID.
- **Адаптивный интерфейс:** мобильная компоновка каталога и баннера, навигации, карточек товаров и страницы сравнения.
- **Обновление каталога:** серверный парсер собирает сведения о смартфонах из настроенного источника. Параметры запуска и расписания задаются через переменные окружения.
- **REST API:** отдельный Django backend с JWT-аутентификацией и интерактивной документацией API.

## Технологии

| Часть | Используемые технологии |
|---|---|
| Frontend | React 18, React Router, Redux Toolkit, Axios |
| UI | CSS, адаптивные стили, Material UI, Notistack |
| Backend | Python, Django 5, Django REST Framework |
| Авторизация | JWT, dj-rest-auth, django-allauth, Google Identity Services |
| База данных | PostgreSQL |
| Фоновые задачи | Celery, Redis |
| Парсер | Python, Requests, Beautiful Soup |
| Запуск сервисов | Docker Compose |

## Структура проекта

```text
TechMatcher/
├── back/                    # Django REST API
│   ├── tech_matcher/        # настройки, URL и конфигурация Celery
│   ├── tech_matcher_app/    # модели, API, сериализаторы, парсер и миграции
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── front/                   # React-приложение
│   ├── src/components/      # компоненты интерфейса
│   ├── src/context/         # контексты корзины и сравнения
│   ├── src/pages/           # страницы приложения
│   └── src/styles/          # CSS, разделённый по областям интерфейса
├── parser/                  # отдельные скрипты парсинга
├── docker-compose.yml       # конфигурация сервисов
├── .env.example             # пример переменных окружения
└── README.md
```

## Быстрый запуск через Docker Compose

### Требования

- Docker Engine или Docker Desktop
- Docker Compose v2

### 1. Склонируйте репозиторий

```bash
git clone https://github.com/Na1x-dev/TechMatcher.git
cd TechMatcher
```

Чтобы получить актуальную версию ветки разработки:

```bash
git switch backend-modernization
git pull
```

### 2. Создайте файл окружения

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Откройте `.env` и при необходимости измените настройки. Для локального запуска задайте собственные значения `SECRET_KEY` и пароля администратора. Не используйте значения для разработки в production. Если Google-вход не нужен, `GOOGLE_CLIENT_ID` можно оставить пустым.

### 3. Запустите приложение

Из корневой папки проекта выполните:

```bash
docker compose up --build
```

Compose запускает frontend, backend, PostgreSQL, Redis, Celery worker и Celery Beat. Backend выполняет миграции базы данных при старте; каталог может заполняться парсером в соответствии с настройками.

После запуска:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Django Admin:** http://localhost:8000/admin/
- **Swagger UI:** http://localhost:8000/api/docs/
- **OpenAPI schema:** http://localhost:8000/api/schema/
- **Дополнительная Swagger-документация:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

Первый запуск может занять некоторое время: Docker должен собрать образы, применить миграции и подготовить сервисы. Доступность отдельных API-страниц зависит от успешного запуска backend.

Остановить сервисы:

```bash
docker compose down
```

Чтобы также удалить данные PostgreSQL, включая сохранённые товары и учётные записи, используйте команду с удалением томов только если действительно хотите сбросить локальную базу:

```bash
docker compose down --volumes
```

## Локальный запуск без Docker

Для ручного запуска потребуются Python, Node.js/npm, PostgreSQL и Redis. Фоновые задачи парсера используют Celery.

### Backend

1. Перейдите в каталог backend и создайте виртуальное окружение:

   ```bash
   cd back
   python -m venv .venv
   ```

2. Активируйте окружение.

   Windows PowerShell:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   Linux/macOS:

   ```bash
   source .venv/bin/activate
   ```

3. Установите зависимости:

   ```bash
   pip install -r requirements.txt
   ```

4. Настройте переменные окружения из корневого файла `.env`. Для локального запуска вне Docker укажите адреса и параметры доступных PostgreSQL и Redis; например, `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/tech_matcher`. Убедитесь, что база данных создана, а пользователь имеет права на неё.

5. Примените миграции и запустите Django:

   ```bash
   python manage.py migrate
   python manage.py runserver 127.0.0.1:8000
   ```

### Frontend

В новом терминале из корня проекта:

```bash
cd front
npm install
npm start
```

React-приложение откроется на http://localhost:3000. По умолчанию оно обращается к API по адресу `http://localhost:8000/api`. Чтобы изменить адрес, задайте переменную `REACT_APP_API_URL`, например:

Linux/macOS:

```bash
REACT_APP_API_URL=http://127.0.0.1:8000/api npm start
```

Windows PowerShell:

```powershell
$env:REACT_APP_API_URL = "http://127.0.0.1:8000/api"
npm start
```

### Фоновые задачи и парсер

Для фонового обновления каталога при локальном запуске также запустите Redis, а затем в отдельных терминалах из каталога `back`:

```bash
celery -A tech_matcher worker --loglevel=info
celery -A tech_matcher beat --loglevel=info
```

Параметры парсера задаются переменными окружения, в том числе:

- `PARSER_ENABLED` — включение или отключение парсера;
- `PARSER_SOURCE_URL` — URL источника каталога;
- `PARSER_MIN_PRODUCTS` — целевой минимальный объём каталога;
- `PARSER_MAX_PAGES` и `PARSER_PAGE_SIZE` — ограничения обхода страниц;
- `PARSER_REQUEST_TIMEOUT` — тайм-аут запроса;
- `PARSER_DELAY_MIN` и `PARSER_DELAY_MAX` — диапазон задержки между запросами;
- `PARSER_SCHEDULE_MINUTES` — интервал периодической задачи в минутах.

Уважайте условия использования сайта-источника и настраивайте частоту запросов разумно.

## API

Основные маршруты backend:

| Метод | Путь | Назначение |
|---|---|---|
| `GET` | `/api/smartphones/` | Каталог смартфонов; поддерживаются параметры поиска и пагинации |
| `GET` | `/api/smartphones/<id>/` | Подробности смартфона |
| `POST` | `/api/token/` | Получение JWT-токенов |
| `POST` | `/api/token/refresh/` | Обновление access-токена |
| `POST` | `/api/register/` | Регистрация пользователя |
| `GET`, `PUT` | `/api/users/<id>/` | Получение и обновление профиля |
| `GET`, `POST` | `/api/basket/` | Просмотр и изменение корзины в зависимости от метода |
| `POST` | `/api/auth/google/` | Вход через Google |
| `GET` | `/api/schema/` | OpenAPI-схема |
| `GET` | `/api/docs/` | Swagger UI |

Для полного списка схем и параметров используйте интерактивную документацию после запуска backend. Защищённые маршруты требуют авторизации; API использует JWT Bearer-токены.

## Настройки Google-входа

Чтобы включить вход через Google:

1. Создайте OAuth/Web Client ID в Google Cloud Console и настройте разрешённые источники для локального frontend.
2. Запишите идентификатор в `GOOGLE_CLIENT_ID` в корневом `.env`.
3. Для Docker Compose тот же параметр передаётся frontend как `REACT_APP_GOOGLE_CLIENT_ID`.
4. Перезапустите сервисы после изменения конфигурации.

Не публикуйте секреты и не коммитьте рабочий `.env` в репозиторий.

## Разработка

Frontend-команды из каталога `front`:

```bash
npm start
npm test
npm run build
```

Backend-команды из каталога `back`:

```bash
python manage.py check
python manage.py test
```

## Примечания

- Корзина гостя хранится в браузере; для авторизованного пользователя данные синхронизируются с backend.
- Возможность оформить реальный заказ зависит от наличия отдельного серверного API заказа; интерфейс корзины сам по себе не означает, что подключён платёжный сервис.
- Парсер зависит от доступности и структуры HTML внешнего источника, поэтому после изменений на стороне источника может потребоваться адаптация.
- Для production необходимо отключить `DEBUG`, задать надёжный `SECRET_KEY`, настроить `ALLOWED_HOSTS`, CORS, HTTPS, секреты и безопасное хранение данных, а также использовать production-сервер вместо Django development server.

## Контакты

Вопросы и предложения по проекту можно направлять на **na1x.1024@gmail.com**.
