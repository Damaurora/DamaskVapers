import { Link } from 'wouter';
import { StatusBadge } from '@/components/ui/status-badge';
import { Product, ProductStatus } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { id, name, description, image, status, quantity } = product;
  
  const placeholderImage = "https://images.unsplash.com/photo-1560373719-cc5a72e018d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80";
  
  const getStatusText = (status: string) => {
    switch(status) {
      case ProductStatus.IN_STOCK:
        return quantity && quantity > 0 ? `В наличии (${quantity} шт.)` : 'В наличии';
      case ProductStatus.OUT_OF_STOCK:
        return 'Не в наличии';
      case ProductStatus.COMING_SOON:
        return 'Ждём завоз';
      default:
        return 'Неизвестный статус';
    }
  };
  
  return (
    <div className={`product-card bg-[#1E1E1E] rounded-lg overflow-hidden relative ${featured ? 'flex-shrink-0 w-64' : ''}`}>
      <StatusBadge status={status} className="status-badge z-10">
        {getStatusText(status)}
      </StatusBadge>
      
      <img 
        src={image || placeholderImage} 
        alt={name} 
        className={`w-full ${featured ? 'h-48' : 'h-56'} object-cover`}
      />
      
      <div className="p-4">
        <h3 className="font-montserrat font-medium text-white text-lg mb-2">{name}</h3>
        <p className={`text-gray-400 text-sm ${featured ? 'line-clamp-2 mb-0' : 'mb-4'}`}>{description}</p>
        
        {!featured && (
          <Link href={`/product/${id}`}>
            <Button variant="link" className="text-primary font-medium p-0 h-auto">
              Подробнее
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
