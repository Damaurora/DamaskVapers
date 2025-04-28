import { cn } from "@/lib/utils";
import { ProductStatus } from "@shared/schema";

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
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
  
  return (
    <span className={cn(getStatusColor(status), className)}>
      {children}
    </span>
  );
}
