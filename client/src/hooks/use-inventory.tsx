import { useQuery } from '@tanstack/react-query';
import { ProductInventory } from '@shared/schema';

/**
 * Хук для получения данных о наличии товара во всех магазинах
 */
export function useProductInventory(productId: number) {
  const { data, isLoading, error } = useQuery<ProductInventory[]>({
    queryKey: ['/api/inventory/product', productId],
    // Не отправляем запрос, если id товара не задан
    enabled: !!productId,
  });

  return { data, isLoading, error };
}

/**
 * Хук для получения данных о наличии всех товаров в конкретном магазине
 */
export function useStoreInventory(storeId: number) {
  const { data, isLoading, error } = useQuery<ProductInventory[]>({
    queryKey: ['/api/inventory/store', storeId],
    // Не отправляем запрос, если id магазина не задан
    enabled: !!storeId,
  });

  return { data, isLoading, error };
}