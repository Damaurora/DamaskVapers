import { cn } from "@/lib/utils";
import { ProductStatus } from "@shared/schema";

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
  quantity?: number | null;
}

export function StatusBadge({ status, children, className, quantity }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case ProductStatus.IN_STOCK:
        return 'bg-[#22C55E]'; // Success
      case ProductStatus.OUT_OF_STOCK:
        return 'bg-[#EF4444]'; // Danger
      case ProductStatus.COMING_SOON:
        return 'bg-[#F59E0B]'; // Warning
      default:
        return 'bg-gray-500';
    }
  };
  
  // Получаем класс индикатора в зависимости от статуса и количества
  const getStatusIndicatorClass = (status: string, quantity?: number | null) => {
    if (status === ProductStatus.IN_STOCK) {
      if (quantity !== undefined && quantity !== null) {
        if (quantity <= 3) return 'status-indicator bg-white pulse';
        if (quantity > 10) return 'status-indicator bg-white';
      }
      return 'status-indicator bg-white pulse';
    }
    
    if (status === ProductStatus.COMING_SOON) {
      return 'status-indicator bg-white';
    }
    
    return 'status-indicator bg-white opacity-50';
  };
  
  // Определяем дополнительный класс для бейджа в зависимости от количества
  const getQuantityClass = (status: string, quantity?: number | null) => {
    if (status === ProductStatus.IN_STOCK && quantity !== undefined && quantity !== null) {
      if (quantity <= 3) return 'low-stock';
      if (quantity > 10) return 'high-stock';
    }
    return '';
  };
  
  return (
    <span className={cn(
      "flex items-center justify-center text-xs font-medium px-2.5 py-1 rounded-full", 
      getStatusColor(status),
      getQuantityClass(status, quantity),
      className
    )}>
      <span className={getStatusIndicatorClass(status, quantity)}></span>
      {children}
    </span>
  );
}
