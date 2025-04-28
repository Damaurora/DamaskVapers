import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertStoreSchema, 
  insertSettingsSchema,
  ProductStatus
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категорий" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категории" });
    }
  });
  
  app.get("/api/categories/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категории" });
    }
  });
  
  app.post("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании категории" });
    }
  });
  
  app.put("/api/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении категории" });
    }
  });
  
  app.delete("/api/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении категории" });
    }
  });
  
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товаров" });
    }
  });
  
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении популярных товаров" });
    }
  });
  
  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "ID категории должен быть числом" });
      }
      
      const products = await storage.getProductsByCategoryId(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товаров по категории" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товара" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Validate status value
      if (![ProductStatus.IN_STOCK, ProductStatus.OUT_OF_STOCK, ProductStatus.COMING_SOON].includes(validatedData.status)) {
        return res.status(400).json({ 
          message: "Неверный статус товара", 
          allowedValues: Object.values(ProductStatus) 
        });
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании товара" });
    }
  });
  
  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      // Validate status value if provided
      if (validatedData.status && ![ProductStatus.IN_STOCK, ProductStatus.OUT_OF_STOCK, ProductStatus.COMING_SOON].includes(validatedData.status)) {
        return res.status(400).json({ 
          message: "Неверный статус товара", 
          allowedValues: Object.values(ProductStatus) 
        });
      }
      
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении товара" });
    }
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении товара" });
    }
  });
  
  // Stores API
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении магазинов" });
    }
  });
  
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const store = await storage.getStore(id);
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении магазина" });
    }
  });
  
  app.post("/api/stores", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const validatedData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(validatedData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании магазина" });
    }
  });
  
  app.put("/api/stores/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const validatedData = insertStoreSchema.partial().parse(req.body);
      const store = await storage.updateStore(id, validatedData);
      
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      res.json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении магазина" });
    }
  });
  
  app.delete("/api/stores/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID должен быть числом" });
      }
      
      const success = await storage.deleteStore(id);
      
      if (!success) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении магазина" });
    }
  });
  
  // Settings API
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        return res.status(404).json({ message: "Настройки не найдены" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении настроек" });
    }
  });
  
  app.patch("/api/settings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      const validatedData = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      
      if (!settings) {
        return res.status(404).json({ message: "Настройки не найдены" });
      }
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении настроек" });
    }
  });
  
  // Sync with Google Sheets
  app.post("/api/settings/sync-google-sheets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    
    try {
      // Импортируем функцию синхронизации
      const { syncProductsWithGoogleSheets } = await import('./google-sheets');
      
      // Синхронизируем данные с Google Sheets
      await syncProductsWithGoogleSheets();
      
      res.json({ 
        message: "Синхронизация с Google Sheets успешно выполнена",
        success: true
      });
    } catch (error: any) {
      console.error('Ошибка синхронизации с Google Sheets:', error);
      res.status(500).json({ 
        message: error.message || "Ошибка при синхронизации с Google Sheets",
        success: false
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
