import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@shared/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from '@shared/constants';

export default function Cart() {
  const { t } = useLanguage();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Fetch cart items
  const { data: cartItems = [], isLoading } = trpc.cart.getItems.useQuery();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const beforeTax = subtotal - appliedDiscount + shippingCost;
  const tax = Math.round(beforeTax * TAX_RATE);
  const total = beforeTax + tax;

  const handleApplyDiscount = () => {
    // TODO: Validate discount code with backend
    setAppliedDiscount(Math.round(subtotal * 0.1)); // 10% discount for demo
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <ShoppingCart size={48} className="text-primary" />
            </div>
            <p className="mt-4 text-lg text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart size={32} />
            <h1 className="text-4xl font-bold">{t('cart')}</h1>
          </div>
          <p className="text-lg opacity-90">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-6">{t('empty_cart')}</p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              {t('continue_shopping')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl border border-border p-6 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Product {item.id}</h3>
                    <p className="text-muted-foreground mb-3">
                      {formatCurrency(item.price)} each
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary mb-3">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-{formatCurrency(appliedDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">{formatCurrency(total)}</span>
                </div>

                {/* Discount Code */}
                <div className="mb-6 space-y-2">
                  <label className="text-sm font-semibold">Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg">
                  Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
