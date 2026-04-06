import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@shared/utils';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:slug');
  const slug = params?.slug;
  const { t, isRTL } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug: slug || '' }, {
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('not_found')}</h2>
        <Button onClick={() => window.history.back()}>{t('go_back')}</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product as any, quantity);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border border-border shadow-xl">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="w-48 h-48 rounded-full blur-3xl opacity-30 animate-pulse"
                    style={{ backgroundColor: product.color || '#8B5CF6' }}
                  />
                  <div
                    className="absolute w-32 h-32 rounded-full shadow-2xl"
                    style={{ backgroundColor: product.color || '#8B5CF6' }}
                  />
                </div>
              )}
              
              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  SALE
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails (Placeholder) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted border border-border cursor-pointer hover:border-primary transition-colors overflow-hidden">
                   <div 
                    className="w-full h-full opacity-20"
                    style={{ backgroundColor: product.color || '#8B5CF6' }}
                   />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              {product.healthBenefit && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                  {product.healthBenefit}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < (product.rating || 0) / 100 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {product.reviewCount || 0} reviews
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">
                {formatCurrency(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description || "Our premium gummy supplements are formulated with high-quality ingredients to help you achieve your health goals effectively and deliciously."}
            </p>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Flavor</p>
                <p className="font-bold flex items-center gap-2 text-lg">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color || '#8B5CF6' }} />
                  {product.flavor || 'Original'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Main Ingredient</p>
                <p className="font-bold text-lg">{product.ingredients?.split(',')[0] || 'Multi-vitamin Base'}</p>
              </div>
            </div>

            {/* Quantity and Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-border rounded-xl p-1 bg-card shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  {product.stock === 0 ? t('out_of_stock') : t('add_to_cart')}
                </Button>
                
                <button className="w-14 h-14 flex items-center justify-center border border-border rounded-xl hover:bg-muted transition-all duration-200 group">
                  <Heart size={24} className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              {product.stock && product.stock < 10 && product.stock > 0 && (
                <p className="text-red-500 font-bold text-sm flex items-center gap-2">
                   Only {product.stock} left in stock - order soon!
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <ShieldCheck className="text-green-500" size={24} />
                <span className="text-sm font-medium">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <Truck className="text-blue-500" size={24} />
                <span className="text-sm font-medium">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <RotateCcw className="text-purple-500" size={24} />
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Placeholder) */}
        <div className="mt-24 border-t border-border pt-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Product Information</h3>
            <div className="prose prose-purple max-w-none text-muted-foreground">
              <p className="mb-4">
                Our Gummy Bloom supplements are crafted with a unique blend of vitamins and minerals designed specifically for your wellness journey. Each gummy is packed with goodness and flavored naturally to make your daily routine something to look forward to.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Gluten-free and Vegan friendly</li>
                <li>No artificial colors or flavors</li>
                <li>Sustainably sourced ingredients</li>
                <li>Third-party lab tested for purity</li>
              </ul>
              <h4 className="text-lg font-bold text-foreground mb-3">Ingredients:</h4>
              <p>
                {product.ingredients || "Glucose Syrup, Sugar, Water, Pectin, Citric Acid, Natural Flavors, Natural Colors (from fruit and vegetable juices), Sodium Citrate."}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
              Customer Reviews
              <span className="text-lg font-medium text-muted-foreground">
                ({product.reviews.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
