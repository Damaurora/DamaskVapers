import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CategoryCard from '@/components/category-card';
import ProductCard from '@/components/product-card';
import ProductCarousel from '@/components/product-carousel';
import StoreLocationCard from '@/components/store-location-card';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';
import { useProducts } from '@/hooks/use-products';
import { useStores } from '@/hooks/use-stores';
import { Product, Category } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const categoryParam = params.get('category');

  const [activeFilter, setActiveFilter] = useState<string | null>(categoryParam);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { stores, isLoading: isStoresLoading } = useStores();

  // Filter products based on active category and search query
  useEffect(() => {
    if (products) {
      let filtered = [...products];

      // Apply category filter
      if (activeFilter) {
        const category = categories?.find(c => c.slug === activeFilter);
        if (category) {
          filtered = filtered.filter(product => product.categoryId === category.id);
        }
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, categories, activeFilter, searchQuery]);

  // Update active filter when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam);
    }
  }, [categoryParam]);

  const handleFilterChange = (categorySlug: string | null) => {
    setActiveFilter(categorySlug);
    setVisibleCount(8); // Reset visible count when changing filters
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(8); // Reset visible count when searching
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const isLoading = isCategoriesLoading || isProductsLoading || isStoresLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />


      {/* Top Products Carousel */}
      <ProductCarousel />

      {/* Product Catalog */}
      <div className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-montserrat font-semibold mb-8">Каталог</h2>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="text-gray-300">Фильтры:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!activeFilter ? "default" : "secondary"}
                className={!activeFilter ? "bg-primary" : "bg-[#1E1E1E] hover:bg-gray-700"}
                onClick={() => handleFilterChange(null)}
              >
                Все товары
              </Button>

              {categories?.map(category => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.slug ? "default" : "secondary"}
                  className={activeFilter === category.slug ? "bg-primary" : "bg-[#1E1E1E] hover:bg-gray-700"}
                  onClick={() => handleFilterChange(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleLoadMore}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Загрузить еще
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery 
                  ? `По запросу "${searchQuery}" ничего не найдено` 
                  : "В данной категории пока нет товаров"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Store Locations */}
      <div className="py-10 bg-[#1E1E1E]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-montserrat font-semibold mb-8">Наши магазины</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores?.map(store => (
              <StoreLocationCard 
                key={store.id} 
                store={store}
                onEdit={() => handleEditStore(store)}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}