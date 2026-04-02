// ============ PRODUCTS ============
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  categoryId: number | null;
  price: number;
  discountPrice: number | null;
  image: string | null;
  color: string | null;
  flavor: string | null;
  healthBenefit: string | null;
  ingredients: string | null;
  rating: number | null;
  reviewCount: number | null;
  stock: number | null;
  featured: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: Date;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// ============ CUSTOM GUMMY BUILDER ============
export interface Ingredient {
  id: number;
  name: string;
  category: string;
  priceModifier: number;
  description?: string;
}

export interface Flavor {
  id: number;
  name: string;
  color: string;
  priceModifier: number;
}

export interface PackagingOption {
  id: number;
  name: string;
  quantity: number;
  priceModifier: number;
  description?: string;
}

export interface CustomFormula {
  id: number;
  userId: number;
  name: string;
  flavorId: number;
  packagingId: number;
  ingredients: string; // JSON
  dosages: string; // JSON
  basePrice: number;
  totalPrice: number;
  isFavorite: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ CART & ORDERS ============
export interface CartItem {
  id: number;
  userId: number;
  productId?: number;
  customFormulaId?: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: string; // JSON
  billingAddress?: string; // JSON
  paymentMethod?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId?: number;
  customFormulaId?: number;
  quantity: number;
  price: number;
  subtotal: number;
}

// ============ USER ============
export interface UserProfile {
  id: number;
  userId: number;
  phone?: string;
  dateOfBirth?: Date;
  healthGoals?: string; // JSON
  dietaryRestrictions?: string; // JSON
  preferences?: string; // JSON
  language: string;
  newsletter: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: number;
  userId: number;
  type: 'shipping' | 'billing' | 'both';
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: number;
  createdAt: Date;
}

export interface Subscription {
  id: number;
  userId: number;
  customFormulaId: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  status: 'active' | 'paused' | 'cancelled';
  nextDeliveryDate?: Date;
  discountPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ AI & RECOMMENDATIONS ============
export interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  sender: 'user' | 'bot';
  createdAt: Date;
}

export interface Recommendation {
  id: number;
  userId: number;
  productId: number;
  reason?: string;
  score?: number;
  createdAt: Date;
}

// ============ DISCOUNT ============
export interface DiscountCode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  expiryDate?: Date;
  minOrderAmount: number;
  active: number;
  createdAt: Date;
}
