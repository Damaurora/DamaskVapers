-- Добавляем поле quantity в таблицу products
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;

-- Обновляем таблицу settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS google_sheets_url TEXT,
ADD COLUMN IF NOT EXISTS google_api_key TEXT;

-- Переименовываем поле google_sheet_url если оно существует
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'settings' AND column_name = 'google_sheet_url') THEN
        ALTER TABLE settings RENAME COLUMN google_sheet_url TO google_sheets_url;
    END IF;
END
$$;