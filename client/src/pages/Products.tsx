import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Product } from '@/types';

export default function Products() {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery({
    limit: 12,
    offset: page * 12,
    categoryId: selectedCategory,
    search: searchQuery || undefined,
  });

  const { data: categories } = trpc.products.categories.useQuery();

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
    // TODO: Implement cart functionality
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products')}</h1>
          <p className="text-lg opacity-90">
            Discover our premium collection of personalized gummy supplements
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-md sticky top-24">
              <h3 className="font-bold text-lg mb-6">Categories</h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === undefined
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Products
                </button>

                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-3">
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-premium h-96 animate-pulse" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page + 1}
                  </span>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={!products || products.length < 12}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">{t('no_products')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
