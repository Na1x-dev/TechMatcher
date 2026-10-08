# TechMatcher — обновлённый frontend

Полностью обновлённый интерфейс React-приложения с сохранением текущих API-контрактов:

- `POST /api/token/` — вход
- `POST /api/register/` — регистрация
- `GET /api/smartphones/?page=&search=` — каталог
- `GET /api/smartphones/:id/` — карточка товара
- `GET /api/basket/` — серверная корзина
- `POST /api/basket/` — добавление товара
- `DELETE /api/basket/?smartphone_id=` — удаление товара
- `GET/PUT /api/users/:id/` — профиль

## Запуск

```bash
npm install
npm start
```

По умолчанию API: `http://localhost:8000/api`.
Для другого адреса можно задать:

```bash
REACT_APP_API_URL=http://your-host/api npm start
```

## Корзина

Гость: товары сохраняются в `localStorage` под ключом `techmatcher_guest_cart`.
После входа локальные товары отправляются в `POST /basket/`, после чего корзина продолжает работать через сервер.

Оформление заказа намеренно не имитирует успешный заказ: в исходном проекте отдельного API-контракта заказа не было, поэтому кнопка показывает информационное сообщение.
