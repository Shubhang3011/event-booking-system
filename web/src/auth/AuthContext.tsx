import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { authApi, type Credentials, type RegisterPayload } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  // Source of truth for "who am I": a single /auth/me query. Returns null when
  // signed out (not an error), so the UI can render immediately.
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    staleTime: Infinity,
    retry: false,
  });

  const value = useMemo<AuthContextValue>(() => {
    const user = data ?? null;
    return {
      user,
      isLoading,
      isAuthenticated: !!user,
      login: async (credentials) => {
        const u = await authApi.login(credentials);
        qc.setQueryData(['me'], u);
        return u;
      },
      register: async (payload) => {
        const u = await authApi.register(payload);
        qc.setQueryData(['me'], u);
        return u;
      },
      logout: async () => {
        await authApi.logout();
        qc.setQueryData(['me'], null);
        // Drop any user-scoped data from the cache.
        qc.removeQueries({ queryKey: ['bookings'] });
      },
    };
  }, [data, isLoading, qc]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
