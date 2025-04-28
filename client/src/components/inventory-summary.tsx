import { useState, useEffect } from 'react';
import { useStores } from '@/hooks/use-stores';
import { useProducts } from '@/hooks/use-products';
import { useSettings } from '@/hooks/use-settings';
import { useProductInventory } from '@/hooks/use-inventory';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export function InventorySummary() {
  const { stores, isLoading: isStoresLoading } = useStores();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { data: settings } = useSettings();
  const [productWithInventory, setProductWithInventory] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные инвентаря для каждого товара
  useEffect(() => {
    const fetchAllInventory = async () => {
      if (!products || !stores || products.length === 0 || stores.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Для каждого товара получаем данные о наличии
        const productsWithInventory = await Promise.all(
          products.map(async (product) => {
            // Используем хук для получения инвентаря (напрямую вызывать API здесь нельзя)
            const response = await fetch(`/api/inventory/product/${product.id}`);
            const inventoryData = await response.json();
            
            return {
              ...product,
              inventory: inventoryData
            };
          })
        );
        
        setProductWithInventory(productsWithInventory);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInventory();
  }, [products, stores]);

  // Форматирование даты последней синхронизации
  const formatLastSyncTime = () => {
    if (!settings?.lastSyncTime) return 'Никогда';
    
    const lastSync = new Date(settings.lastSyncTime);
    return lastSync.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Индикатор состояния по количеству
  const getStockStatusIndicator = (quantity: number) => {
    if (quantity <= 0) return <Badge variant="destructive">Нет</Badge>;
    if (quantity <= 3) return <Badge variant="outline" className="bg-yellow-500 text-white">Мало</Badge>;
    if (quantity > 10) return <Badge variant="outline" className="bg-green-500 text-white">Много</Badge>;
    return <Badge variant="outline" className="bg-blue-500 text-white">Есть</Badge>;
  };

  if (isStoresLoading || isProductsLoading || isLoading) {
    return (
      <Card className="bg-[#1E1E1E] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Состояние товаров</CardTitle>
          <CardDescription className="text-gray-400">
            Загрузка данных о наличии товаров...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="bg-[#1E1E1E] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Состояние товаров</CardTitle>
          <CardDescription className="text-gray-400">
            Данные о наличии товаров
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-10 text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
          <p className="text-gray-400">
            Нет данных о товарах. Добавьте товары в каталог, чтобы видеть информацию о наличии.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1E1E1E] border-gray-800 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Состояние товаров</CardTitle>
            <CardDescription className="text-gray-400">
              Данные о наличии товаров в магазинах
            </CardDescription>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <RefreshCw className="h-3 w-3 mr-1" />
            Синхронизировано: {formatLastSyncTime()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-gray-400 font-medium">Товар</TableHead>
                <TableHead className="text-gray-400 font-medium">Артикул</TableHead>
                {stores && stores.map(store => (
                  <TableHead key={store.id} className="text-gray-400 font-medium text-center">
                    {store.name.replace('Магазин на ', '')}
                  </TableHead>
                ))}
                <TableHead className="text-gray-400 font-medium text-center">Всего</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productWithInventory.map(product => {
                // Получаем общее количество
                const totalQuantity = product.quantity || 0;
                
                return (
                  <TableRow key={product.id} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-400">{product.sku || '-'}</TableCell>
                    
                    {stores && stores.map(store => {
                      const inventoryItem = product.inventory?.find((i: any) => i.storeId === store.id);
                      const quantity = inventoryItem ? inventoryItem.quantity : 0;
                      
                      return (
                        <TableCell key={store.id} className="text-center">
                          <div className="flex flex-col items-center">
                            {getStockStatusIndicator(quantity)}
                            <span className="text-xs mt-1">{quantity > 0 ? quantity : '-'}</span>
                          </div>
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        {getStockStatusIndicator(totalQuantity)}
                        <span className="text-xs mt-1">{totalQuantity > 0 ? totalQuantity : '-'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}