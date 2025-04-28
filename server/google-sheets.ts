import { google } from 'googleapis';
import { storage } from './storage';
import { ProductStatus } from '@shared/schema';
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import { productInventory, products } from '@shared/schema';

interface SheetProduct {
  sku: string;
  quantity: number;
  gagarinStore: number;
  pobedaStore: number;
}

/**
 * Сервис для работы с Google Sheets API
 */
export async function syncProductsWithGoogleSheets(): Promise<void> {
  const settings = await storage.getSettings();
  
  if (!settings) {
    throw new Error('Настройки не найдены');
  }
  
  if (!settings.googleSheetsUrl || !settings.googleApiKey) {
    throw new Error('URL таблицы или API ключ Google не указаны в настройках');
  }
  
  // Извлекаем ID таблицы из URL
  const spreadsheetId = extractSpreadsheetId(settings.googleSheetsUrl);
  if (!spreadsheetId) {
    throw new Error('Некорректный URL Google таблицы');
  }
  
  // Инициализируем Google Sheets API
  const sheets = initializeGoogleSheetsApi(settings.googleApiKey);
  
  // Получаем данные из таблицы
  const sheetProducts = await getProductsFromSheet(sheets, spreadsheetId);
  
  // Получаем все существующие товары из базы
  const existingProducts = await storage.getProducts();
  
  // Получаем магазины
  const stores = await storage.getStores();
  const gagarinStore = stores.find(store => store.name.includes('Гагарина'));
  const pobedaStore = stores.find(store => store.name.includes('Победа'));
  
  if (!gagarinStore || !pobedaStore) {
    throw new Error('Не найдены магазины Гагарина и/или Победа');
  }
  
  // Обновляем товары
  for (const sheetProduct of sheetProducts) {
    // Ищем товар по артикулу
    const product = existingProducts.find(p => p.sku === sheetProduct.sku);
    
    if (product) {
      // Общее количество товара
      const totalQuantity = sheetProduct.gagarinStore + sheetProduct.pobedaStore;
      
      // Определяем статус на основе общего количества
      const status = totalQuantity > 0 
        ? ProductStatus.IN_STOCK 
        : ProductStatus.OUT_OF_STOCK;
      
      // Обновляем общее количество и статус товара
      await storage.updateProduct(product.id, {
        quantity: totalQuantity,
        status
      });
      
      // Обновляем количество в магазине на Гагарина
      await updateStoreInventory(product.id, gagarinStore.id, sheetProduct.gagarinStore);
      
      // Обновляем количество в магазине на Победа
      await updateStoreInventory(product.id, pobedaStore.id, sheetProduct.pobedaStore);
    }
  }
  
  // Обновляем время последней синхронизации
  await storage.updateSettings({
    lastSyncTime: new Date().toISOString()
  });
}

/**
 * Извлекает ID Google таблицы из URL
 */
function extractSpreadsheetId(url: string): string | null {
  // Формат URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Инициализирует Google Sheets API
 */
function initializeGoogleSheetsApi(apiKey: string) {
  return google.sheets({ version: 'v4', auth: apiKey });
}

/**
 * Получает данные товаров из Google таблицы
 */
async function getProductsFromSheet(
  sheets: any, 
  spreadsheetId: string
): Promise<SheetProduct[]> {
  try {
    // Получаем данные из первого листа таблицы
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:D', // С ячейки A2 (пропускаем заголовки)
    });
    
    const rows = response.data.values || [];
    
    // Преобразуем строки в объекты SheetProduct
    return rows.map(row => {
      const [sku, quantity, gagarinStore, pobedaStore] = row;
      
      return {
        sku: sku || '',
        quantity: parseInt(quantity) || 0,
        gagarinStore: parseInt(gagarinStore) || 0,
        pobedaStore: parseInt(pobedaStore) || 0
      };
    }).filter(product => product.sku); // Фильтруем записи без артикула
    
  } catch (error) {
    console.error('Ошибка при получении данных из Google Sheets:', error);
    throw new Error('Не удалось получить данные из Google Sheets');
  }
}

/**
 * Обновляет инвентарь товара в конкретном магазине
 */
async function updateStoreInventory(
  productId: number,
  storeId: number,
  quantity: number
): Promise<void> {
  try {
    // Проверяем существует ли уже запись
    const existingInventory = await db.select()
      .from(productInventory)
      .where(
        and(
          eq(productInventory.productId, productId),
          eq(productInventory.storeId, storeId)
        )
      );
    
    if (existingInventory.length > 0) {
      // Обновляем существующую запись
      await db.update(productInventory)
        .set({ quantity })
        .where(
          and(
            eq(productInventory.productId, productId),
            eq(productInventory.storeId, storeId)
          )
        );
    } else {
      // Создаем новую запись
      await db.insert(productInventory)
        .values({
          productId,
          storeId,
          quantity
        });
    }
  } catch (error) {
    console.error(`Ошибка при обновлении инвентаря для товара ${productId} в магазине ${storeId}:`, error);
    throw new Error('Не удалось обновить инвентарь товара');
  }
}