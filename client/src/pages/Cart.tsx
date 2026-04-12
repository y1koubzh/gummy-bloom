import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@shared/utils';
import { CONTACT_WHATSAPP, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from '@shared/constants';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function Cart() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const isArabic = language === 'ar';

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shippingCost + tax;

  const handleCheckout = () => {
    if (items.length === 0) return;

    const message = isArabic 
      ? `طلب جديد من Gummy Bloom 🌸\n\n` +
        `قائمة المنتجات:\n` +
        items.map(item => `- ${item.name} (الكمية: ${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join('\n') +
        `\n\n------------------\n` +
        `المجموع الفرعي: ${formatCurrency(subtotal)}\n` +
        `الشحن: ${shippingCost === 0 ? 'مجاني' : formatCurrency(shippingCost)}\n` +
        `الإجمالي: ${formatCurrency(total)}\n` +
        `------------------\n\n` +
        `أريد إتمام هذا الطلب من فضلك.`
      : `New Order from Gummy Bloom 🌸\n\n` +
        `Product List:\n` +
        items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join('\n') +
        `\n\n------------------\n` +
        `Subtotal: ${formatCurrency(subtotal)}\n` +
        `Shipping: ${shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}\n` +
        `Total: ${formatCurrency(total)}\n` +
        `------------------\n\n` +
        `I would like to complete this order please.`;

    const whatsappUrl = `https://wa.me/${CONTACT_WHATSAPP.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    toast.success(isArabic ? 'جاري تحويلك إلى واتساب...' : 'Redirecting to WhatsApp...');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      {/* Header */}
      <div className="relative py-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-blue-900/40 blur-3xl opacity-50" />
        <div className="container relative z-10 px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <ShoppingCart size={32} className="text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {isArabic ? 'سلة المشتريات' : 'Your Shopping Cart'}
            </h1>
          </div>
          <p className="text-xl text-gray-400 font-light">
            {items.length} {isArabic ? 'منتجات في سلتك' : (items.length === 1 ? 'item' : 'items') + ' in your cart'}
          </p>
        </div>
      </div>

      <div className="container px-6">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-neutral-900/30 rounded-[3rem] border border-white/5 backdrop-blur-sm">
            <ShoppingBag size={80} className="mx-auto text-neutral-800 mb-8" />
            <h2 className="text-3xl font-bold mb-4">{isArabic ? 'سلتك فارغة حالياً' : 'Your cart is empty'}</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto">
              {isArabic ? 'يبدو أنك لم تضف أي منتجات بعد. ابدأ بالتسوق الآن واكتشف منتجاتنا الرائعة.' : 'Looks like you haven\'t added anything yet. Start exploring our premium gummies.'}
            </p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-white text-black hover:bg-neutral-200 px-10 py-7 rounded-2xl text-lg font-black transition-all active:scale-95"
            >
              {isArabic ? 'ابدأ التسوق' : 'Start Shopping'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-neutral-900/40 rounded-[2.5rem] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl hover:bg-neutral-900/60 transition-all duration-300"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-32 h-32 rounded-3xl bg-neutral-800 flex items-center justify-center border border-white/5 overflow-hidden">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-full" style={{ backgroundColor: item.color || '#8B5CF6' }} />
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left" dir={isArabic ? 'rtl' : 'ltr'}>
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-purple-400 font-bold mb-6">
                      {formatCurrency(item.price)} {isArabic ? '' : 'each'}
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center text-xl font-bold">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center md:text-right flex flex-col items-center md:items-end justify-between self-stretch">
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-red-500/50 hover:text-red-500 transition-colors group-hover:scale-110"
                    >
                      <Trash2 size={24} />
                    </button>
                    <p className="text-3xl font-black text-white mt-4">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center py-6">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/products')}
                    className="text-gray-400 hover:text-white"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {isArabic ? 'متابعة التسوق' : 'Continue Shopping'}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="text-red-500/50 hover:text-red-500"
                >
                    {isArabic ? 'تفريغ السلة' : 'Clear Cart'}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900/60 rounded-[3rem] border border-white/10 p-10 sticky top-32 backdrop-blur-2xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-8">{isArabic ? 'ملخص الطلب' : 'Order Summary'}</h3>

                <div className="space-y-6 mb-8 pb-8 border-b border-white/5">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                  </div>



                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">{isArabic ? 'الشحن' : 'Shipping'}</span>
                    <span className="font-bold">
                      {shippingCost === 0 ? (isArabic ? 'مجاني' : 'FREE') : formatCurrency(shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">{isArabic ? 'الضريبة' : 'Tax'}</span>
                    <span className="font-bold">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-xl font-bold">{isArabic ? 'الإجمالي القابل للدفع' : 'Total Payable'}</span>
                  <div className="text-right">
                    <span className="block text-4xl font-black text-purple-400">{formatCurrency(total)}</span>
                    <span className="text-xs text-gray-500">DZD (incl. all taxes)</span>
                  </div>
                </div>



                {/* Checkout Button */}
                <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-95 text-white font-black py-8 rounded-2xl text-xl shadow-[0_20px_40px_-10px_rgba(147,51,234,0.3)] transition-all"
                >
                  {isArabic ? 'إتمام الشراء' : 'Proceed to Checkout'}
                  <ArrowRight className={`ml-2 h-5 w-5 ${isArabic ? 'rotate-180 mr-2 ml-0' : ''}`} />
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-6 px-4">
                    {isArabic ? 'بالنقر على إتمام الشراء، فإنك توافق على شروط الخدمة الخاصة بنا.' : 'By proceeding to checkout, you agree to our Terms of Service.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
