import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/auth/AuthContext';
import { eventsApi } from '@/lib/api';
import type { User } from '@/lib/types';

export function useSavedEvents() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['saved'],
    queryFn: () => eventsApi.listSaved(),
    enabled: isAuthenticated,
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved }: { id: string; saved: boolean }) =>
      saved ? eventsApi.unsave(id) : eventsApi.save(id),
    onSuccess: (_data, { id, saved }) => {
      // Patch the cached user so the button flips instantly.
      qc.setQueryData<User | null>(['me'], (prev) => {
        if (!prev) return prev;
        const current = prev.savedEvents ?? [];
        return {
          ...prev,
          savedEvents: saved ? current.filter((e) => e !== id) : [...current, id],
        };
      });
      qc.invalidateQueries({ queryKey: ['saved'] });
    },
  });
}
