import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStores } from "@/hooks/use-stores";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StoreInventoryInputProps {
  productId: number;
  onInventoryChange: (storeId: number, quantity: number) => void;
  className?: string;
}

export function StoreInventoryInput({ 
  productId, 
  onInventoryChange,
  className
}: StoreInventoryInputProps) {
  const { stores, isLoading } = useStores();
  const [inventory, setInventory] = useState<Record<number, number>>({});
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  // Загружаем текущие значения инвентаря для продукта
  useEffect(() => {
    const fetchInventory = async () => {
      if (!productId) return;
      
      try {
        setIsLoadingInventory(true);
        const response = await fetch(`/api/inventory/product/${productId}`);
        const data = await response.json();
        
        // Преобразуем данные в удобный формат - Record<storeId, quantity>
        const inventoryData: Record<number, number> = {};
        data.forEach((item: any) => {
          inventoryData[item.storeId] = item.quantity;
        });
        
        setInventory(inventoryData);
      } catch (error) {
        console.error("Ошибка при загрузке данных о наличии:", error);
      } finally {
        setIsLoadingInventory(false);
      }
    };
    
    fetchInventory();
  }, [productId]);

  const handleQuantityChange = (storeId: number, value: string) => {
    const quantity = value === '' ? 0 : parseInt(value, 10);
    setInventory(prev => ({ ...prev, [storeId]: quantity }));
    onInventoryChange(storeId, quantity);
  };

  // Если данные загружаются, показываем скелетон
  if (isLoading || isLoadingInventory) {
    return (
      <Card className={`border-gray-800 bg-[#1E1E1E] ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Загрузка данных о наличии...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-gray-800 bg-[#1E1E1E] ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Наличие в магазинах</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stores && stores.map(store => (
          <div key={store.id} className="space-y-2">
            <Label htmlFor={`store-${store.id}`}>
              {store.name} ({store.address})
            </Label>
            <Input
              id={`store-${store.id}`}
              type="number"
              min="0"
              step="1"
              value={inventory[store.id] || ''}
              onChange={(e) => handleQuantityChange(store.id, e.target.value)}
              className="bg-secondary border-gray-700 text-white"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}