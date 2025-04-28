-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Создание таблицы магазинов
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  image TEXT,
  work_hours_weekdays TEXT NOT NULL,
  work_hours_weekend TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  category_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  sku TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  specifications JSONB
);

-- Создание таблицы настроек
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  logo TEXT,
  shop_name TEXT NOT NULL,
  google_sheet_url TEXT,
  sync_frequency TEXT DEFAULT 'manual'
);

-- Создание таблицы сессий
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL PRIMARY KEY,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
);

-- Добавление администратора по умолчанию
INSERT INTO users (username, password)
SELECT 'admin', '321'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Добавление настроек по умолчанию
INSERT INTO settings (id, logo, shop_name, google_sheet_url, sync_frequency)
SELECT 1, '/logo.svg', 'Damask Shop', '', 'manual'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- Добавление категорий по умолчанию
INSERT INTO categories (name, icon, slug)
SELECT 'Поды', 'pod', 'pods'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'pods');

INSERT INTO categories (name, icon, slug)
SELECT 'Под-моды', 'pod-mod', 'pod-mods'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'pod-mods');

INSERT INTO categories (name, icon, slug)
SELECT 'Одноразки', 'disposable', 'disposables'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'disposables');

INSERT INTO categories (name, icon, slug)
SELECT 'Жидкости', 'liquid', 'liquids'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'liquids');

INSERT INTO categories (name, icon, slug)
SELECT 'Табак', 'tobacco', 'tobacco'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'tobacco');

INSERT INTO categories (name, icon, slug)
SELECT 'Жевательный табак', 'chewing-tobacco', 'chewing-tobacco'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'chewing-tobacco');

-- Добавление магазинов по умолчанию
INSERT INTO stores (name, address, image, work_hours_weekdays, work_hours_weekend, phone)
SELECT 'Магазин на Гагарина', 'ул. Гагарина 26А', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80', '10:00 - 20:00', '11:00 - 19:00', '+7 (912) 345-67-89'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE address = 'ул. Гагарина 26А');

INSERT INTO stores (name, address, image, work_hours_weekdays, work_hours_weekend, phone)
SELECT 'Магазин на Победе', 'ул. Победы 28Б', 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80', '10:00 - 20:00', '11:00 - 19:00', '+7 (912) 345-67-88'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE address = 'ул. Победы 28Б');