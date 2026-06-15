import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'admin' | 'asesor' | 'domiciliario' | 'cliente';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface LoginResult {
  success: boolean;
  role?: UserRole;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  returnTo: string | null;
  login: (user: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  setReturnTo: (path: string) => void;
  clearReturnTo: () => void;
}

export const TEST_ACCOUNTS: { label: string; email: string; password: string }[] = [
  { label: 'Administrador', email: 'admin@surticamisetas.com', password: 'admin123' },
  { label: 'Asesor', email: 'asesor@surticamisetas.com', password: 'asesor123' },
  { label: 'Domiciliario', email: 'domiciliario@surticamisetas.com', password: 'domi123' },
  { label: 'Cliente', email: 'cliente@email.com', password: 'cliente123' },
];

const AUTH_STORAGE_KEY = 'surtitelas.auth';

const getRoleFromLabel = (label: string): UserRole => {
  if (label === 'Administrador') return 'admin';
  if (label === 'Asesor') return 'asesor';
  if (label === 'Domiciliario') return 'domiciliario';
  return 'cliente';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      returnTo: null,
      login: (user) => set({ user, isAuthenticated: true }),
      loginWithCredentials: async (email, password) => {
        const account = TEST_ACCOUNTS.find((item) => item.email === email && item.password === password);

        if (!account) {
          return { success: false, error: 'Credenciales inválidas' };
        }

        const role = getRoleFromLabel(account.label);
        set({
          user: {
            uid: `local-${role}-${account.email}`,
            email: account.email,
            name: account.label,
            role,
          },
          isAuthenticated: true,
        });

        return { success: true, role };
      },
      logout: () => set({ user: null, isAuthenticated: false, returnTo: null }),
      setReturnTo: (path) => set({ returnTo: path }),
      clearReturnTo: () => set({ returnTo: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuth = useAuthStore;
