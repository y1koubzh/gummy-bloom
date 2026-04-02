import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============ PRODUCTS & CATALOG ============
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  categoryId: int("categoryId").references(() => categories.id),
  price: int("price").notNull(), // in cents
  discountPrice: int("discountPrice"),
  image: varchar("image", { length: 500 }),
  color: varchar("color", { length: 50 }), // hex color for gummy
  flavor: varchar("flavor", { length: 100 }),
  healthBenefit: varchar("healthBenefit", { length: 255 }),
  ingredients: text("ingredients"), // JSON array
  rating: int("rating").default(0), // 0-5 scale * 100 for decimals
  reviewCount: int("reviewCount").default(0),
  stock: int("stock").default(0),
  featured: int("featured").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id),
  userId: int("userId").notNull().references(() => users.id),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============ CUSTOM GUMMY BUILDER ============
export const ingredients = mysqlTable("ingredients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // vitamin, mineral, herbal, etc
  priceModifier: int("priceModifier").default(0), // in cents
  description: text("description"),
});

export const flavors = mysqlTable("flavors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(), // hex color
  priceModifier: int("priceModifier").default(0),
});

export const packagingOptions = mysqlTable("packagingOptions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  quantity: int("quantity").notNull(), // number of gummies
  priceModifier: int("priceModifier").default(0),
  description: text("description"),
});

export const customFormulas = mysqlTable("customFormulas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  flavorId: int("flavorId").notNull().references(() => flavors.id),
  packagingId: int("packagingId").notNull().references(() => packagingOptions.id),
  ingredients: text("ingredients").notNull(), // JSON array of ingredient IDs
  dosages: text("dosages").notNull(), // JSON object with ingredient dosages
  basePrice: int("basePrice").notNull(),
  totalPrice: int("totalPrice").notNull(),
  isFavorite: int("isFavorite").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============ SHOPPING CART & ORDERS ============
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productId: int("productId").references(() => products.id),
  customFormulaId: int("customFormulaId").references(() => customFormulas.id),
  quantity: int("quantity").notNull().default(1),
  price: int("price").notNull(), // price at time of adding
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(), // percentage (0-100) or cents
  maxUses: int("maxUses"),
  currentUses: int("currentUses").default(0),
  expiryDate: timestamp("expiryDate"),
  minOrderAmount: int("minOrderAmount").default(0),
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  subtotal: int("subtotal").notNull(),
  discountAmount: int("discountAmount").default(0),
  shippingCost: int("shippingCost").default(0),
  tax: int("tax").default(0),
  total: int("total").notNull(),
  shippingAddress: text("shippingAddress").notNull(), // JSON
  billingAddress: text("billingAddress"), // JSON
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  productId: int("productId").references(() => products.id),
  customFormulaId: int("customFormulaId").references(() => customFormulas.id),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // price per unit at time of order
  subtotal: int("subtotal").notNull(),
});

// ============ USER MANAGEMENT ============
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("dateOfBirth"),
  healthGoals: text("healthGoals"), // JSON array
  dietaryRestrictions: text("dietaryRestrictions"), // JSON array
  preferences: text("preferences"), // JSON
  language: varchar("language", { length: 10 }).default("en"),
  newsletter: int("newsletter").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  type: mysqlEnum("type", ["shipping", "billing", "both"]).default("both"),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: int("isDefault").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  customFormulaId: int("customFormulaId").notNull().references(() => customFormulas.id),
  frequency: mysqlEnum("frequency", ["weekly", "biweekly", "monthly", "quarterly"]).notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active"),
  nextDeliveryDate: timestamp("nextDeliveryDate"),
  discountPercentage: int("discountPercentage").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============ AI & RECOMMENDATIONS ============
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  message: text("message").notNull(),
  sender: mysqlEnum("sender", ["user", "bot"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productId: int("productId").notNull().references(() => products.id),
  reason: varchar("reason", { length: 255 }),
  score: int("score"), // 0-100 relevance score
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============ ANALYTICS & ADMIN ============
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").defaultNow(),
  totalOrders: int("totalOrders").default(0),
  totalRevenue: int("totalRevenue").default(0),
  totalUsers: int("totalUsers").default(0),
  averageOrderValue: int("averageOrderValue").default(0),
});

export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().unique().references(() => products.id),
  quantity: int("quantity").notNull().default(0),
  reorderLevel: int("reorderLevel").default(10),
  lastRestocked: timestamp("lastRestocked"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============ TYPE EXPORTS ============
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type Flavor = typeof flavors.$inferSelect;
export type PackagingOption = typeof packagingOptions.$inferSelect;
export type CustomFormula = typeof customFormulas.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;