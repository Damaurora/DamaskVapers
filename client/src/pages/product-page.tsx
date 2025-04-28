import { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/hooks/use-products';
import { useCategory } from '@/hooks/use-categories';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ProductStatus } from '@shared/schema';

export default function ProductPage() {
  const [match, params] = useRoute('/product/:id');
  const { product, isLoading: isProductLoading, error } = useProduct(params?.id ? parseInt(params.id) : 0);
  const { category, isLoading: isCategoryLoading } = useCategory(product?.categoryId || 0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);
  
  if (isProductLoading || isCategoryLoading) {
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
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-10">
          <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-semibold font-montserrat mb-4">Товар не найден</h1>
            <p className="text-gray-400 mb-6">
              Извините, запрашиваемый товар не существует или был удален.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const placeholderImage = "https://images.unsplash.com/photo-1560373719-cc5a72e018d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80";
  
  const getStatusText = (status: string) => {
    switch(status) {
      case ProductStatus.IN_STOCK:
        return product.quantity && product.quantity > 0 ? `В наличии (${product.quantity} шт.)` : 'В наличии';
      case ProductStatus.OUT_OF_STOCK:
        return 'Не в наличии';
      case ProductStatus.COMING_SOON:
        return 'Ждём завоз';
      default:
        return 'Неизвестный статус';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white px-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к каталогу
            </Button>
          </Link>
        </div>
        
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="relative">
              <StatusBadge status={product.status} className="status-badge z-10">
                {getStatusText(product.status)}
              </StatusBadge>
              <img 
                src={product.image || placeholderImage} 
                alt={product.name} 
                className="w-full rounded-lg object-cover max-h-[500px]"
              />
            </div>
            
            <div>
              <div className="flex flex-col h-full">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-primary">
                      {category?.name || 'Категория'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold font-montserrat mb-4">{product.name}</h1>
                  
                  <div className="prose prose-invert max-w-none mb-6">
                    <p className="text-gray-300">{product.description}</p>
                  </div>
                </div>
                
                {product.specifications && (
                  <div className="mt-auto">
                    <Separator className="mb-4" />
                    
                    <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
                    
                    <div className="space-y-2">
                      {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4">
                          <span className="text-gray-400">{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.sku && (
                  <div className="mt-4 text-sm text-gray-400">
                    Артикул: {product.sku}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
