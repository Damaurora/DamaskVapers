# Damask Shop - Каталог вейп-шопа

Минималистичный каталог вейп-шопа с информацией о наличии товаров в двух физических магазинах.

## Технологии

- **Frontend**: React, TailwindCSS, Shadcn/UI, React Query
- **Backend**: Express, PostgreSQL, Drizzle ORM
- **Интеграции**: Google Sheets API для синхронизации инвентаря

## Инструкции по развертыванию на Render

### Предварительные требования

1. Аккаунт на [Render](https://render.com/)
2. Аккаунт на [GitHub](https://github.com/) для размещения репозитория

### Шаги для деплоя

1. **Подготовка репозитория**:
   - Загрузить код на GitHub

2. **Создание базы данных**:
   - В панели Render выбрать "New" → "PostgreSQL"
   - Дать имя базе данных (например, "damask-shop-db")
   - Выбрать подходящий тарифный план
   - Нажать "Create Database"
   - Сохранить строку подключения (Internal Connection String) для следующего шага

3. **Настройка веб-сервиса**:
   - В панели Render выбрать "New" → "Web Service"
   - Подключить репозиторий с GitHub
   - Указать имя (например, "damask-shop")
   - Настроить следующие параметры:
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - В разделе "Environment Variables" добавить:
     - `NODE_ENV` = `production`
     - `DATABASE_URL` = (строка подключения к базе данных, полученная ранее)
     - `SESSION_SECRET` = (любая длинная случайная строка для защиты сессий)
   - Нажать "Create Web Service"

4. **Настройка Google Sheets API для синхронизации инвентаря** (опционально):
   - Создать проект в [Google Cloud Platform](https://console.cloud.google.com/)
   - Включить Google Sheets API
   - Создать API ключ
   - Добавить ключ в настройки магазина через панель администратора

### Доступ к панели администратора

- URL: https://yourdomain.onrender.com/auth
- Логин: admin
- Пароль: 321

## Рекомендации по безопасности

1. После деплоя обязательно сменить пароль администратора
2. Установить надежный SESSION_SECRET
3. Ограничить доступ к API ключу Google в консоли Google Cloud

## Техническое обслуживание

Для обновления базы данных после изменения схемы:
```bash
npm run db:push
```

Для ручной синхронизации с Google Sheets используйте кнопку "Синхронизировать сейчас" в панели администратора.