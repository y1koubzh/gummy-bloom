import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function Products() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const isArabic = language === 'ar';
  
  const { addToCart } = useCart();
  const utils = trpc.useUtils();

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery({
    limit: 12,
    offset: page * 12,
    categoryId: selectedCategory,
    search: searchQuery || undefined,
  });

  const { data: categories } = trpc.products.categories.useQuery();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-20">
      {/* Full Catalog Section with Filters */}
      <div className="container py-24 bg-neutral-950/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">متجر Gummy Bloom</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">تصفح مجموعتنا الكاملة من المكملات الغذائية المخصصة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/50 rounded-3xl border border-neutral-800 p-8 sticky top-24 backdrop-blur-md">
              <h3 className="font-bold text-xl mb-8 border-b border-neutral-800 pb-4">التصنيفات</h3>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-neutral-500" size={18} />
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-800 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-right px-6 py-3 rounded-xl transition-all font-medium ${
                    selectedCategory === undefined
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'hover:bg-neutral-800 text-gray-400'
                  }`}
                >
                  جميع المنتجات
                </button>

                {categories?.map((category: any) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-right px-6 py-3 rounded-xl transition-all font-medium ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : 'hover:bg-neutral-800 text-gray-400'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-3xl bg-neutral-900 animate-pulse border border-neutral-800" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {products.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-6 pt-12 border-t border-neutral-900">
                  <Button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    variant="outline"
                    className="border-neutral-800 hover:bg-neutral-800 rounded-xl px-8"
                  >
                    السابق
                  </Button>
                  <span className="font-bold text-purple-400">
                    الصفحة {page + 1}
                  </span>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={!products || products.length < 12}
                    variant="outline"
                    className="border-neutral-800 hover:bg-neutral-800 rounded-xl px-8"
                  >
                    التالي
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
                <p className="text-xl text-gray-500">{t('no_products')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
