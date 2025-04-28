import { useStores } from "@/hooks/use-stores";
import { useProductInventory } from "@/hooks/use-inventory";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface InventoryDisplayProps {
  productId: number;
  totalQuantity?: number | null;
  showTitle?: boolean;
}

export function InventoryDisplay({ 
  productId, 
  totalQuantity, 
  showTitle = true 
}: InventoryDisplayProps) {
  const { stores } = useStores();
  const { data: inventory, isLoading } = useProductInventory(productId);

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    );
  }

  // Если нет данных о наличии, показываем соответствующее сообщение
  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-gray-400 text-sm mt-2">
        Нет данных о наличии
      </div>
    );
  }

  // Если есть магазины, но нет данных о наличии для некоторых из них,
  // добавляем пустые записи для этих магазинов
  const displayInventory = stores?.map((store) => {
    const storeInventory = inventory.find((item) => item.storeId === store.id);
    return {
      storeId: store.id,
      storeName: store.name,
      quantity: storeInventory?.quantity || 0
    };
  }) || [];

  // Определяем цвет индикатора наличия в зависимости от количества
  const getQuantityColor = (quantity: number) => {
    if (quantity <= 0) return "bg-red-500";
    if (quantity <= 3) return "bg-red-500 animate-pulse";
    if (quantity <= 10) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Отображаем название и адрес магазина более коротко
  const getShortStoreName = (name: string) => {
    return name.replace("Магазин на ", "");
  };

  return (
    <div className="mt-2">
      {showTitle && (
        <div className="text-sm font-medium mb-2">
          Наличие в магазинах:
        </div>
      )}
      <div className="flex flex-col space-y-2">
        {displayInventory.map((item) => (
          <div 
            key={item.storeId} 
            className="flex items-center justify-between rounded bg-secondary/50 px-3 py-2"
          >
            <div className="text-sm">
              {getShortStoreName(item.storeName)}
            </div>
            
            <div className="flex items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full mr-2 ${getQuantityColor(item.quantity)}`}
              ></div>
              <span className="text-sm font-medium">
                {item.quantity > 0 ? item.quantity : "Нет в наличии"}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {totalQuantity !== undefined && totalQuantity !== null && (
        <div className="mt-3 text-sm flex justify-between items-center">
          <span className="text-gray-400">Всего:</span>
          <Badge 
            variant={totalQuantity > 0 ? "outline" : "destructive"} 
            className="ml-2"
          >
            {totalQuantity > 0 ? totalQuantity : "Нет в наличии"}
          </Badge>
        </div>
      )}
    </div>
  );
}