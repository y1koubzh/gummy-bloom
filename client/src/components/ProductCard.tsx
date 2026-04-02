import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@shared/utils';
import type { Product } from '@/types';
import { Link } from 'wouter';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onFavorite,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      onAddToCart?.(product);
    } finally {
      setIsAdding(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(product);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="card-premium group relative overflow-hidden">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden mb-4 cursor-pointer">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full opacity-50"
                style={{ backgroundColor: product.color || '#8B5CF6' }}
              />
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sale
            </div>
          )}
        </div>
      </Link>

      {/* Favorite Button (Outside Link to avoid nested interactivity) */}
      <button
        onClick={handleFavorite}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-all duration-200 z-10"
      >
        <Heart
          size={18}
          className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
        />
      </button>

      {/* Content */}
      <div className="space-y-3">
        {/* Category */}
        {product.healthBenefit && (
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            {product.healthBenefit}
          </p>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor((product.rating || 0) / 100)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Flavor */}
        {product.flavor && (
          <p className="text-sm text-muted-foreground">{product.flavor}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
