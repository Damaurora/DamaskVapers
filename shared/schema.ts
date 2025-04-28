import { pgTable, text, serial, integer, boolean, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true, 
  slug: true
});

// Store schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  image: text("image"),
  workHoursWeekdays: text("work_hours_weekdays").notNull(),
  workHoursWeekend: text("work_hours_weekend").notNull(),
  phone: text("phone").notNull(),
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  address: true,
  image: true,
  workHoursWeekdays: true,
  workHoursWeekend: true,
  phone: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  categoryId: integer("category_id").notNull(),
  status: text("status").notNull(),  // "in_stock", "out_of_stock", "coming_soon"
  quantity: integer("quantity").default(0),  // Точное количество товара в наличии
  sku: text("sku"),
  isFeatured: boolean("is_featured").default(false),
  specifications: jsonb("specifications"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  slug: true,
  image: true,
  categoryId: true,
  status: true,
  quantity: true,
  sku: true,
  isFeatured: true,
  specifications: true,
});

// Inventory schema (для хранения наличия товаров в конкретных магазинах)
export const productInventory = pgTable("product_inventory", {
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  quantity: integer("quantity").default(0),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.productId, table.storeId] }),
  }
});

export const insertProductInventorySchema = createInsertSchema(productInventory).pick({
  productId: true,
  storeId: true,
  quantity: true,
});

// Определяем отношения между продуктами и инвентарём
export const productsRelations = relations(products, ({ many }) => ({
  inventory: many(productInventory),
}));

// Определяем отношения между магазинами и инвентарём
export const storesRelations = relations(stores, ({ many }) => ({
  inventory: many(productInventory),
}));

// Определяем отношения для инвентаря
export const productInventoryRelations = relations(productInventory, ({ one }) => ({
  product: one(products, {
    fields: [productInventory.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [productInventory.storeId],
    references: [stores.id],
  }),
}));

// Site settings schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  logo: text("logo"),
  shopName: text("shop_name").notNull(),
  description: text("description"),
  googleSheetsUrl: text("google_sheets_url"),
  googleApiKey: text("google_api_key"),
  syncFrequency: text("sync_frequency").default("manual"),
  lastSyncTime: text("last_sync_time"),
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  logo: true,
  shopName: true,
  description: true,
  googleSheetsUrl: true,
  googleApiKey: true,
  syncFrequency: true,
  lastSyncTime: true,
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductInventory = z.infer<typeof insertProductInventorySchema>;
export type ProductInventory = typeof productInventory.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// Status enum
export const ProductStatus = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  COMING_SOON: "coming_soon"
} as const;

export type ProductStatusType = typeof ProductStatus[keyof typeof ProductStatus];
