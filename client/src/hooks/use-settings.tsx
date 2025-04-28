import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Settings, InsertSettings } from '@shared/schema';

export function useSettings() {
  const { data, isLoading, error } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  return { data, isLoading, error };
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<InsertSettings>) => {
      const res = await apiRequest('PATCH', '/api/settings', settings);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
  });
}

export function useSyncGoogleSheets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/settings/sync-google-sheets');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}