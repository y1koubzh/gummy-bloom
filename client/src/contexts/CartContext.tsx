import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';
import type { Product } from '@/types';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  color?: string | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  // Load from local storage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('gummy_bloom_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('gummy_bloom_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        toast.info(isArabic ? 'تم زيادة كمية المنتج في السلة' : 'Increased product quantity in cart');
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      toast.success(isArabic ? 'تمت إضافة المنتج إلى السلة!' : 'Product added to cart!');
      return [
        ...prev,
        {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: 1,
          image: product.image,
          color: product.color,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.error(isArabic ? 'تم حذف المنتج من السلة' : 'Removed from cart');
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('gummy_bloom_cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
