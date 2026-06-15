import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth as useAuthStore, TEST_ACCOUNTS } from '@/core/stores/authStore';
import { useCart as useCartStore } from '@/core/stores/cartStore';
import type { CartItem } from '@/core/stores/cartStore';

export { TEST_ACCOUNTS };
export type { CartItem };
export const useAuth = useAuthStore;
export const useCart = useCartStore;

interface CartDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export const useCartDrawer = () => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error('useCartDrawer must be used within CartDrawerProvider');
  return ctx;
};

export const CartDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CartDrawerContext.Provider value={{ isOpen, openDrawer: () => setIsOpen(true), closeDrawer: () => setIsOpen(false) }}>
      {children}
    </CartDrawerContext.Provider>
  );
};

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <CartDrawerProvider>
    {children}
  </CartDrawerProvider>
);
