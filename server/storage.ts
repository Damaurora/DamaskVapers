import { 
  users, 
  categories, 
  products, 
  stores, 
  settings,
  productInventory,
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type ProductInventory,
  type Product, 
  type InsertProduct,
  type Store, 
  type InsertStore,
  type Settings,
  type InsertSettings
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;
  
  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings | undefined>;
  
  // Inventory
  getProductInventory(productId: number, storeId: number): Promise<ProductInventory | undefined>;
  getProductInventoryByProduct(productId: number): Promise<ProductInventory[]>;
  getProductInventoryByStore(storeId: number): Promise<ProductInventory[]>;
  updateProductInventory(productId: number, storeId: number, quantity: number): Promise<ProductInventory | undefined>;
  
  // Session store
  sessionStore: any; // Type для session.SessionStore
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private stores: Map<number, Store>;
  private settings: Settings | undefined;
  sessionStore: session.SessionStore;
  
  private userCounter: number;
  private categoryCounter: number;
  private productCounter: number;
  private storeCounter: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.stores = new Map();
    
    this.userCounter = 1;
    this.categoryCounter = 1;
    this.productCounter = 1;
    this.storeCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "321" // Note: In a real application, this would be hashed
    });
    
    // Initialize with default settings
    this.settings = {
      id: 1,
      logo: "/logo.svg",
      shopName: "Damask Shop",
      description: "Магазин электронных сигарет и вейп-устройств",
      googleSheetsUrl: null,
      googleApiKey: null,
      syncFrequency: "manual"
    };
    
    // Initialize default stores
    this.createStore({
      name: "Магазин на Гагарина",
      address: "ул. Гагарина 26А",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      workHoursWeekdays: "10:00 - 20:00",
      workHoursWeekend: "11:00 - 19:00",
      phone: "+7 (912) 345-67-89"
    });
    
    this.createStore({
      name: "Магазин на Победе",
      address: "ул. Победы 28Б",
      image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      workHoursWeekdays: "10:00 - 20:00",
      workHoursWeekend: "11:00 - 19:00",
      phone: "+7 (912) 345-67-88"
    });
    
    // Initialize default categories
    const categoriesData = [
      { name: "Поды", icon: "pod", slug: "pods" },
      { name: "Под-моды", icon: "pod-mod", slug: "pod-mods" },
      { name: "Одноразки", icon: "disposable", slug: "disposables" },
      { name: "Жидкости", icon: "liquid", slug: "liquids" },
      { name: "Табак", icon: "tobacco", slug: "tobacco" },
      { name: "Жевательный табак", icon: "chewing-tobacco", slug: "chewing-tobacco" }
    ];
    
    categoriesData.forEach(category => {
      this.createCategory(category);
    });
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Stores
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }
  
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.storeCounter++;
    const store: Store = { ...insertStore, id };
    this.stores.set(id, store);
    return store;
  }
  
  async updateStore(id: number, storeUpdate: Partial<InsertStore>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;
    
    const updatedStore = { ...store, ...storeUpdate };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }
  
  async deleteStore(id: number): Promise<boolean> {
    return this.stores.delete(id);
  }
  
  // Settings
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }
  
  async updateSettings(settingsUpdate: Partial<InsertSettings>): Promise<Settings | undefined> {
    if (!this.settings) return undefined;
    
    this.settings = { ...this.settings, ...settingsUpdate };
    return this.settings;
  }

  // Inventory
  async getProductInventory(productId: number, storeId: number): Promise<ProductInventory | undefined> {
    // MemStorage не имеет реализации инвентаря, при необходимости можно добавить
    return undefined;
  }

  async getProductInventoryByProduct(productId: number): Promise<ProductInventory[]> {
    // MemStorage не имеет реализации инвентаря, возвращаем пустой массив
    return [];
  }

  async getProductInventoryByStore(storeId: number): Promise<ProductInventory[]> {
    // MemStorage не имеет реализации инвентаря, возвращаем пустой массив
    return [];
  }

  async updateProductInventory(productId: number, storeId: number, quantity: number): Promise<ProductInventory | undefined> {
    // MemStorage не имеет реализации инвентаря, при необходимости можно добавить
    return undefined;
  }
}

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Initialize database with default data if needed
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      await pool.connect(); // Проверяем подключение к БД
      
      // Проверяем необходимость инициализации данных
      const userCount = await db.select({ count: users }).from(users);
      
      if (!userCount || userCount.length === 0 || userCount[0].count === 0) {
        // Create default admin user
        await this.createUser({
          username: "admin",
          password: "321" // In real app this would be hashed
        });
        
        // Create default settings
        await db.insert(settings).values({
          shopName: "Damask Shop",
          description: "Магазин электронных сигарет и вейп-устройств",
          logo: "/logo.svg",
          googleSheetsUrl: null,
          googleApiKey: null,
          syncFrequency: "manual"
        });
        
        // Create default stores
        await this.createStore({
          name: "Магазин на Гагарина",
          address: "ул. Гагарина 26А",
          image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
          workHoursWeekdays: "10:00 - 20:00",
          workHoursWeekend: "11:00 - 19:00",
          phone: "+7 (912) 345-67-89"
        });
        
        await this.createStore({
          name: "Магазин на Победе",
          address: "ул. Победы 28Б",
          image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
          workHoursWeekdays: "10:00 - 20:00",
          workHoursWeekend: "11:00 - 19:00",
          phone: "+7 (912) 345-67-88"
        });
        
        // Create default categories
        const categoriesData = [
          { name: "Поды", icon: "pod", slug: "pods" },
          { name: "Под-моды", icon: "pod-mod", slug: "pod-mods" },
          { name: "Одноразки", icon: "disposable", slug: "disposables" },
          { name: "Жидкости", icon: "liquid", slug: "liquids" },
          { name: "Табак", icon: "tobacco", slug: "tobacco" },
          { name: "Жевательный табак", icon: "chewing-tobacco", slug: "chewing-tobacco" }
        ];
        
        for (const category of categoriesData) {
          await this.createCategory(category);
        }
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryUpdate)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return true; // PostgreSQL doesn't return deleted count by default
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isFeatured, true));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }

  async updateStore(id: number, storeUpdate: Partial<InsertStore>): Promise<Store | undefined> {
    const [updatedStore] = await db
      .update(stores)
      .set(storeUpdate)
      .where(eq(stores.id, id))
      .returning();
    return updatedStore;
  }

  async deleteStore(id: number): Promise<boolean> {
    await db.delete(stores).where(eq(stores.id, id));
    return true;
  }

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    const result = await db.select().from(settings).where(eq(settings.id, 1));
    return result[0];
  }

  async updateSettings(settingsUpdate: Partial<InsertSettings>): Promise<Settings | undefined> {
    const [updatedSettings] = await db
      .update(settings)
      .set(settingsUpdate)
      .where(eq(settings.id, 1))
      .returning();
    return updatedSettings;
  }

  // Inventory
  async getProductInventory(productId: number, storeId: number): Promise<ProductInventory | undefined> {
    const result = await db
      .select()
      .from(productInventory)
      .where(
        and(
          eq(productInventory.productId, productId),
          eq(productInventory.storeId, storeId)
        )
      );
    
    return result[0];
  }

  async getProductInventoryByProduct(productId: number): Promise<ProductInventory[]> {
    return await db
      .select()
      .from(productInventory)
      .where(eq(productInventory.productId, productId));
  }

  async getProductInventoryByStore(storeId: number): Promise<ProductInventory[]> {
    return await db
      .select()
      .from(productInventory)
      .where(eq(productInventory.storeId, storeId));
  }

  async updateProductInventory(productId: number, storeId: number, quantity: number): Promise<ProductInventory | undefined> {
    try {
      // Проверяем существует ли запись
      const existingInventory = await this.getProductInventory(productId, storeId);
      
      if (existingInventory) {
        // Обновляем существующую запись
        const [updated] = await db
          .update(productInventory)
          .set({ quantity })
          .where(
            and(
              eq(productInventory.productId, productId),
              eq(productInventory.storeId, storeId)
            )
          )
          .returning();
        
        return updated;
      } else {
        // Создаем новую запись
        const [created] = await db
          .insert(productInventory)
          .values({
            productId,
            storeId,
            quantity
          })
          .returning();
        
        return created;
      }
    } catch (error) {
      console.error('Ошибка при обновлении инвентаря:', error);
      return undefined;
    }
  }
}

// Use database storage
export const storage = new DatabaseStorage();
