import express, { type Express } from "express";
import path from "path";
import fs from "fs";

/**
 * Настраивает сервирование статических файлов для продакшн сборки
 * Используется только в production режиме
 */
export function setupStaticServing(app: Express) {
  // В production режиме после сборки файлы клиента будут находиться в dist/static
  const clientDistPath = path.resolve(process.cwd(), "client/dist");
  
  // Проверка существования директории
  if (!fs.existsSync(clientDistPath)) {
    console.warn(`Предупреждение: директория ${clientDistPath} не найдена. Статические файлы не будут обслуживаться.`);
    return;
  }

  console.log(`Обслуживание статических файлов из: ${clientDistPath}`);
  
  // Обслуживаем все статические файлы из директории сборки с кэшированием
  app.use(express.static(clientDistPath, { 
    maxAge: '1d',  // Кэширование на 1 день
    etag: true,    // Включаем ETag для условных запросов
    index: false   // Отключаем автоматическую отдачу index.html
  }));
  
  // Отдельно обслуживаем assets с более долгим временем кэширования
  const assetsPath = path.resolve(clientDistPath, "assets");
  if (fs.existsSync(assetsPath)) {
    app.use("/assets", express.static(assetsPath, { maxAge: '7d' }));
  }
  
  // Маршрут для всех остальных GET запросов (для SPA-роутинга)
  app.get('*', (req, res, next) => {
    // Если это запрос к API, пропускаем его
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Иначе отдаем index.html для клиентского роутинга
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
}