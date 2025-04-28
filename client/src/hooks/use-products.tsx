import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, InsertProduct } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return { products, isLoading, error };
}

export function useProduct(id: number) {
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  return { product, isLoading, error };
}

export function useFeaturedProducts() {
  const { data: featuredProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return { featuredProducts, isLoading, error };
}

export function useProductsByCategory(categoryId: number) {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${categoryId}`],
    enabled: !!categoryId,
  });

  return { products, isLoading, error };
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (product: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", product);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, product }: { id: number; product: Partial<InsertProduct> }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, product);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/category/${variables.product.categoryId}`] });
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
    },
  });
}
