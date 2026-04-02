import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home',
    'products': 'Products',
    'builder': 'Custom Builder',
    'cart': 'Cart',
    'account': 'Account',
    'admin': 'Admin',
    'logout': 'Logout',
    'login': 'Login',
    'search': 'Search',
    'add_to_cart': 'Add to Cart',
    'price': 'Price',
    'rating': 'Rating',
    'reviews': 'Reviews',
    'description': 'Description',
    'ingredients': 'Ingredients',
    'flavor': 'Flavor',
    'quantity': 'Quantity',
    'total': 'Total',
    'checkout': 'Checkout',
    'shipping': 'Shipping',
    'payment': 'Payment',
    'order_confirmation': 'Order Confirmation',
    'thank_you': 'Thank you for your order!',
    'order_number': 'Order Number',
    'estimated_delivery': 'Estimated Delivery',
    'track_order': 'Track Order',
    'continue_shopping': 'Continue Shopping',
    'empty_cart': 'Your cart is empty',
    'no_products': 'No products found',
    'loading': 'Loading...',
    'error': 'An error occurred',
    'success': 'Success',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'not_found': 'Product not found',
    'go_back': 'Go Back',
    'out_of_stock': 'Out of Stock',
    'custom_formula': 'Custom Formula',
  },
  ar: {
    'home': 'الرئيسية',
    'products': 'المنتجات',
    'builder': 'منشئ مخصص',
    'cart': 'السلة',
    'account': 'الحساب',
    'admin': 'الإدارة',
    'logout': 'تسجيل الخروج',
    'login': 'تسجيل الدخول',
    'search': 'بحث',
    'add_to_cart': 'أضف إلى السلة',
    'price': 'السعر',
    'rating': 'التقييم',
    'reviews': 'التقييمات',
    'description': 'الوصف',
    'ingredients': 'المكونات',
    'flavor': 'النكهة',
    'quantity': 'الكمية',
    'total': 'الإجمالي',
    'checkout': 'الدفع',
    'shipping': 'الشحن',
    'payment': 'الدفع',
    'order_confirmation': 'تأكيد الطلب',
    'thank_you': 'شكراً لطلبك!',
    'order_number': 'رقم الطلب',
    'estimated_delivery': 'موعد التسليم المتوقع',
    'track_order': 'تتبع الطلب',
    'continue_shopping': 'متابعة التسوق',
    'empty_cart': 'سلتك فارغة',
    'no_products': 'لم يتم العثور على منتجات',
    'loading': 'جاري التحميل...',
    'error': 'حدث خطأ',
    'success': 'نجح',
    'cancel': 'إلغاء',
    'save': 'حفظ',
    'delete': 'حذف',
    'edit': 'تعديل',
    'not_found': 'المنتج غير موجود',
    'go_back': 'العودة للخلف',
    'out_of_stock': 'نفذت الكمية',
    'custom_formula': 'تركيبة مخصصة',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: language === 'ar',
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
