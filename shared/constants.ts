// ============ PRODUCT CATEGORIES ============
export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Vitamins', slug: 'vitamins', icon: '💊' },
  { id: 2, name: 'Minerals', slug: 'minerals', icon: '⛏️' },
  { id: 3, name: 'Wellness', slug: 'wellness', icon: '🌿' },
  { id: 4, name: 'Immunity', slug: 'immunity', icon: '🛡️' },
  { id: 5, name: 'Energy', slug: 'energy', icon: '⚡' },
  { id: 6, name: 'Sleep Support', slug: 'sleep-support', icon: '😴' },
] as const;

// ============ GUMMY BUILDER DEFAULTS ============
export const DEFAULT_FLAVORS = [
  { id: 1, name: 'Strawberry', color: '#E91E63' },
  { id: 2, name: 'Lemon', color: '#FFC107' },
  { id: 3, name: 'Orange', color: '#FF9800' },
  { id: 4, name: 'Grape', color: '#9C27B0' },
  { id: 5, name: 'Watermelon', color: '#4CAF50' },
  { id: 6, name: 'Cherry', color: '#F44336' },
] as const;

export const DEFAULT_PACKAGING = [
  { id: 1, name: 'Small (30 gummies)', quantity: 30, priceModifier: 0 },
  { id: 2, name: 'Medium (60 gummies)', quantity: 60, priceModifier: 50000 },
  { id: 3, name: 'Large (120 gummies)', quantity: 120, priceModifier: 120000 },
  { id: 4, name: 'Family Pack (180 gummies)', quantity: 180, priceModifier: 180000 },
] as const;

export const INGREDIENT_CATEGORIES = [
  'vitamin',
  'mineral',
  'herbal',
  'amino-acid',
  'probiotic',
  'enzyme',
] as const;

// ============ PRICING ============
export const BASE_GUMMY_PRICE = 150000; // 1500 دج
export const TAX_RATE = 0; // إيقاف الضريبة مؤقتاً أو حسب السوق المحلي
export const SHIPPING_COST = 40000; // 400 دج للتوصيل
export const FREE_SHIPPING_THRESHOLD = 500000; // شحن مجاني فوق 5000 دج

// ============ SUBSCRIPTION FREQUENCIES ============
export const SUBSCRIPTION_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly', discount: 5 },
  { value: 'biweekly', label: 'Every 2 Weeks', discount: 7 },
  { value: 'monthly', label: 'Monthly', discount: 10 },
  { value: 'quarterly', label: 'Every 3 Months', discount: 15 },
] as const;

// ============ ORDER STATUSES ============
export const ORDER_STATUSES = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

export const PAYMENT_STATUSES = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
} as const;

// ============ HEALTH GOALS ============
export const HEALTH_GOALS = [
  { id: 'immune', label: 'Boost Immunity', icon: '🛡️' },
  { id: 'energy', label: 'Increase Energy', icon: '⚡' },
  { id: 'sleep', label: 'Better Sleep', icon: '😴' },
  { id: 'digestion', label: 'Improve Digestion', icon: '🫗' },
  { id: 'skin', label: 'Skin Health', icon: '✨' },
  { id: 'joints', label: 'Joint Support', icon: '🦴' },
  { id: 'stress', label: 'Reduce Stress', icon: '🧘' },
  { id: 'focus', label: 'Mental Focus', icon: '🧠' },
] as const;

// ============ DIETARY RESTRICTIONS ============
export const DIETARY_RESTRICTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'sugar-free', label: 'Sugar-Free' },
  { id: 'nut-free', label: 'Nut-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'organic', label: 'Organic' },
] as const;

// ============ ROUTES ============
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  BUILDER: '/builder',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: (id: string) => `/orders/${id}/confirmation`,
  ACCOUNT: '/account',
  ORDERS: '/account/orders',
  FORMULAS: '/account/formulas',
  SUBSCRIPTIONS: '/account/subscriptions',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
} as const;

// ============ BRANDING ============
/** اسم الموقع (نص بديل للصور ووصف الشعار) */
export const SITE_NAME = 'Gummy Bloom';
/**
 * مسار الشعار داخل `client/public/` (مثل `/logo.svg` أو `/logo.png`).
 * ضع ملف شعارك هناك أو غيّر القيمة إذا استخدمت اسم ملف آخر.
 */
export const SITE_LOGO_PATH = '/logo.png';
/** إذا كان شعارك يتضمّن الاسم بالكامل، اجعلها `false` لإخفاء النص بجانب الصورة */
export const SHOW_SITE_NAME_NEXT_TO_LOGO = true;

// ============ CONTACT ============
export const CONTACT_WHATSAPP = '+213771214259'; // رقم الواتساب الخاص بك

// ============ VALIDATION ============
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  POSTAL_CODE_REGEX: /^[0-9]{5}(?:-[0-9]{4})?$/,
  MIN_PASSWORD_LENGTH: 8,
} as const;

// ============ PAGINATION ============
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  REVIEWS_PER_PAGE: 5,
} as const;

// ============ ANIMATION DURATIONS (ms) ============
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// ============ BREAKPOINTS ============
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const;
