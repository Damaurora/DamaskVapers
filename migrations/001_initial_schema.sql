
-- Initial database schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  image TEXT,
  work_hours_weekdays TEXT NOT NULL,
  work_hours_weekend TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  category_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  sku TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  specifications JSONB,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create product_inventory table
CREATE TABLE IF NOT EXISTS product_inventory (
  product_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, store_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  logo TEXT,
  shop_name TEXT NOT NULL,
  description TEXT,
  google_sheets_url TEXT,
  google_api_key TEXT,
  sync_frequency TEXT DEFAULT 'manual',
  last_sync_time TEXT
);

-- Create session table
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL PRIMARY KEY,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
);

-- Insert default data
INSERT INTO users (username, password)
SELECT 'admin', '321'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO settings (id, logo, shop_name, google_sheets_url, sync_frequency)
SELECT 1, '/logo.svg', 'Damask Shop', '', 'manual'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- Insert default categories
INSERT INTO categories (name, icon, slug)
VALUES 
  ('Поды', 'pod', 'pods'),
  ('Под-моды', 'pod-mod', 'pod-mods'),
  ('Одноразки', 'disposable', 'disposables'),
  ('Жидкости', 'liquid', 'liquids'),
  ('Табак', 'tobacco', 'tobacco'),
  ('Жевательный табак', 'chewing-tobacco', 'chewing-tobacco')
ON CONFLICT (slug) DO NOTHING;

-- Insert default stores
INSERT INTO stores (name, address, image, work_hours_weekdays, work_hours_weekend, phone)
VALUES 
  ('Магазин на Гагарина', 'ул. Гагарина 26А', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80', '10:00 - 20:00', '11:00 - 19:00', '+7 (912) 345-67-89'),
  ('Магазин на Победе', 'ул. Победы 28Б', 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80', '10:00 - 20:00', '11:00 - 19:00', '+7 (912) 345-67-88')
ON CONFLICT (address) DO NOTHING;
