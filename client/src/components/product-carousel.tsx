import { useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@shared/schema';
import { useFeaturedProducts } from '@/hooks/use-products';

export default function ProductCarousel() {
  const { featuredProducts, isLoading } = useFeaturedProducts();
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const handlePrev = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  
  const handleNext = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        setScrollPosition(carouselRef.current.scrollLeft);
      }
    };
    
    const carousel = carouselRef.current;
    
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className="py-10 bg-[#1E1E1E]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-montserrat font-semibold">Топ товары</h2>
            <div className="flex space-x-2">
              <Button size="icon" variant="secondary" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-secondary rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="py-10 bg-[#1E1E1E]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-montserrat font-semibold">Топ товары</h2>
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={handlePrev}
              className="hover:bg-primary transition-colors duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={handleNext}
              className="hover:bg-primary transition-colors duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 carousel"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
