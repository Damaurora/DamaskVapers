-- Добавляем новое поле в таблицу settings
ALTER TABLE settings ADD COLUMN last_sync_time TEXT;

-- Создаем таблицу product_inventory, если она еще не существует
CREATE TABLE IF NOT EXISTS product_inventory (
  product_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, store_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);