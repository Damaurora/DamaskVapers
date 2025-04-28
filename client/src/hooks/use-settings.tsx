import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings, InsertSettings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useSettings() {
  const { data: settings, isLoading, error } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  return { settings, isLoading, error };
}

export function useUpdateSettings() {
  return useMutation({
    mutationFn: async (settings: Partial<InsertSettings>) => {
      const res = await apiRequest("PUT", "/api/settings", settings);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}

export function useSyncGoogleSheets() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sync", {});
      return await res.json();
    },
  });
}
