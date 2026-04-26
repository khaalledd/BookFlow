import { create } from 'zustand';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (user, token, refreshToken) => {
    if (typeof window !== 'undefined' && user && token) {
      localStorage.setItem('access_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({
      user,
      token,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }

    set((state) => ({
      ...state,
      user,
      isAuthenticated: !!state.token && !!user,
    }));
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userStr = localStorage.getItem('user');

      // Handle invalid stored values (e.g., "undefined" string)
      let user: User | null = null;
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          user = JSON.parse(userStr);
        } catch {
          // Invalid JSON, clear it
          localStorage.removeItem('user');
        }
      }

      set({
        token,
        refreshToken,
        user,
        isAuthenticated: !!token && !!user,
        isHydrated: true,
      });
    }
  },
}));

// Custom hook that handles hydration safely
export function useAuth() {
  const store = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // Return default values during SSR/initial render to prevent hydration mismatch
  if (!mounted) {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      login: store.login,
      setUser: store.setUser,
      logout: store.logout,
      hydrate: store.hydrate,
    };
  }

  return store;
}
