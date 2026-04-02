import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  categories,
  ingredients,
  flavors,
  packagingOptions,
  customFormulas,
  cartItems,
  orders,
  orderItems,
  reviews,
  discountCodes,
  userProfiles,
  addresses,
  subscriptions,
  chatMessages,
  recommendations,
  analytics,
  inventory,
} from "../drizzle/schema";
import { ENV } from './_core/env';

// --- MOCK DATA ---
const MOCK_CATEGORIES = [
  { id: 1, name: "Energizing", slug: "energizing", icon: "⚡", createdAt: new Date() },
  { id: 2, name: "Relaxing", slug: "relaxing", icon: "🌙", createdAt: new Date() },
  { id: 3, name: "Immunity", slug: "immunity", icon: "🛡️", createdAt: new Date() },
  { id: 4, name: "Beauty", slug: "beauty", icon: "✨", createdAt: new Date() },
];

const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: "Focus Spark", 
    slug: "focus-spark", 
    description: "Our Focus Spark gummies are carefully formulated with nootropics and vitamins to help you stay sharp and productive throughout the day. Perfect for long work sessions or intense study periods.",
    categoryId: 1, 
    price: 2999, 
    discountPrice: 2499,
    image: null, 
    color: "#fbbf24", 
    flavor: "Zesty Lemon",
    healthBenefit: "Cognitive Support",
    ingredients: "Lion's Mane, Caffeine, B12, L-Theanine",
    rating: 480, 
    reviewCount: 124, 
    stock: 50, 
    featured: 1, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 2, 
    name: "Deep Sleep Melts", 
    slug: "deep-sleep-melts", 
    description: "Enjoy a restful night's sleep with our natural berry-flavored melts. Formulated with melatonin and chamomile to help you drift off effortlessly.",
    categoryId: 2, 
    price: 3499, 
    discountPrice: null,
    image: null, 
    color: "#6366f1", 
    flavor: "Midnight Berry",
    healthBenefit: "Sleep Aid",
    ingredients: "Melatonin, Valerian Root, Magnesium",
    rating: 490, 
    reviewCount: 89, 
    stock: 12, 
    featured: 1, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 3, 
    name: "Glow Bloom", 
    slug: "glow-bloom", 
    description: "Target your skin from within. Our Glow Bloom gummies contain premium collagen and biotin for vibrant skin and healthy hair.",
    categoryId: 4, 
    price: 3999, 
    discountPrice: 3499,
    image: null, 
    color: "#ec4899", 
    flavor: "Sweet Strawberry",
    healthBenefit: "Beauty & Skin",
    ingredients: "Collagen, Biotin, Vitamin E, Vitamin C",
    rating: 470, 
    reviewCount: 256, 
    stock: 0, 
    featured: 1, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  }
];

const MOCK_REVIEWS = [
  { id: 1, productId: 1, userId: 1, rating: 5, comment: "Incredible focus booster! No jitters at all.", createdAt: new Date() },
  { id: 2, productId: 1, userId: 2, rating: 4, comment: "I love the lemon taste, really wakes me up.", createdAt: new Date() },
];

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect, falling back to mock data.");
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCTS ============
export async function getProducts(limit = 20, offset = 0, categoryId?: number) {
  const db = await getDb();
  if (!db) {
    let filtered = MOCK_PRODUCTS;
    if (categoryId) {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }
    return filtered.slice(offset, offset + limit) as any;
  }
  
  if (categoryId) {
    return db.select().from(products).where(eq(products.categoryId, categoryId)).limit(limit).offset(offset);
  }
  return db.select().from(products).limit(limit).offset(offset);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return MOCK_PRODUCTS.find(p => p.slug === slug) as any;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getCategories() {
  const db = await getDb();
  if (!db) return MOCK_CATEGORIES as any;
  
  return db.select().from(categories);
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return MOCK_REVIEWS.filter(r => r.productId === productId) as any;
  
  return db.select().from(reviews).where(eq(reviews.productId, productId));
}

// ============ CUSTOM GUMMY BUILDER ============
export async function getIngredients() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(ingredients);
}

export async function getFlavors() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(flavors);
}

export async function getPackagingOptions() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(packagingOptions);
}

export async function createCustomFormula(data: typeof customFormulas.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customFormulas).values(data);
  return result;
}

export async function getUserCustomFormulas(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(customFormulas).where(eq(customFormulas.userId, userId));
}

// ============ CART ============
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(data: typeof cartItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(cartItems).values(data);
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function deleteCartItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(cartItems).where(eq(cartItems.id, id));
}

// ============ ORDERS ============
export async function createOrder(data: typeof orders.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orders).values(data);
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

// ============ USER PROFILE ============
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function createOrUpdateUserProfile(data: typeof userProfiles.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(userProfiles).values(data).onDuplicateKeyUpdate({
    set: {
      phone: data.phone,
      healthGoals: data.healthGoals,
      dietaryRestrictions: data.dietaryRestrictions,
      preferences: data.preferences,
      language: data.language,
    },
  });
}

// ============ DISCOUNT CODES ============
export async function validateDiscountCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(discountCodes).where(eq(discountCodes.code, code.toUpperCase())).limit(1);
  return result[0];
}

// ============ REVIEWS ============

export async function createReview(data: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(reviews).values(data);
}

// ============ RECOMMENDATIONS ============
export async function getUserRecommendations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(recommendations).where(eq(recommendations.userId, userId));
}

export async function createRecommendation(data: typeof recommendations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(recommendations).values(data);
}

// ============ CHAT MESSAGES ============
export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.createdAt);
}

export async function saveChatMessage(data: typeof chatMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(chatMessages).values(data);
}

// ============ SUBSCRIPTIONS ============
export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function createSubscription(data: typeof subscriptions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(subscriptions).values(data);
}

// ============ ADDRESSES ============
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function createAddress(data: typeof addresses.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(addresses).values(data);
}

// ============ ADMIN FUNCTIONS ============
export async function getAllOrders(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders).limit(limit).offset(offset).orderBy(desc(orders.createdAt));
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).limit(limit).offset(offset);
}

export async function getAnalytics() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(analytics).orderBy(desc(analytics.date)).limit(30);
}


