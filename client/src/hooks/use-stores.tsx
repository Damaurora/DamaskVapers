import { useQuery, useMutation } from "@tanstack/react-query";
import { Store, InsertStore } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useStores() {
  const { data: stores, isLoading, error } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  return { stores, isLoading, error };
}

export function useStore(id: number) {
  const { data: store, isLoading, error } = useQuery<Store>({
    queryKey: [`/api/stores/${id}`],
    enabled: !!id,
  });

  return { store, isLoading, error };
}

export function useCreateStore() {
  return useMutation({
    mutationFn: async (store: InsertStore) => {
      const res = await apiRequest("POST", "/api/stores", store);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
    },
  });
}

export function useUpdateStore() {
  return useMutation({
    mutationFn: async ({ id, store }: { id: number; store: Partial<InsertStore> }) => {
      const res = await apiRequest("PUT", `/api/stores/${id}`, store);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${variables.id}`] });
    },
  });
}

export function useDeleteStore() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/stores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
    },
  });
}
