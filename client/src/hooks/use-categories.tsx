import { useQuery, useMutation } from "@tanstack/react-query";
import { Category, InsertCategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useCategories() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return { categories, isLoading, error };
}

export function useCategory(id: number) {
  const { data: category, isLoading, error } = useQuery<Category>({
    queryKey: [`/api/categories/${id}`],
    enabled: !!id,
  });

  return { category, isLoading, error };
}

export function useCategoryBySlug(slug: string) {
  const { data: category, isLoading, error } = useQuery<Category>({
    queryKey: [`/api/categories/slug/${slug}`],
    enabled: !!slug,
  });

  return { category, isLoading, error };
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (category: InsertCategory) => {
      const res = await apiRequest("POST", "/api/categories", category);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, category }: { id: number; category: Partial<InsertCategory> }) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, category);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${variables.id}`] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}
