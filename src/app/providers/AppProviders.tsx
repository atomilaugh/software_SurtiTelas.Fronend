import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  uid: string;
  email: string | null;
  role: 'admin' | 'asesor' | 'domiciliario' | 'cliente';
}

export interface CartItem {
  cartId: string;
  nombre: string;
  precio: number;
  quantity: number;
  stock: number;
  imagen?: string;
  categoria?: string;
  talla?: string;
  color?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logout: () => Promise<void>;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  removeFromCart: (cartId: string) => void;
  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;
  clearCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity' | 'cartId'> & { cartId?: string; quantity?: number }) => void;
}

interface CartDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CartContext = createContext<CartContextType | undefined>(undefined);
const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

const TEST_ACCOUNTS: { label: string; email: string; password: string }[] = [
  { label: 'Administrador', email: 'admin@surticamisetas.com', password: 'admin123' },
  { label: 'Asesor', email: 'asesor@surticamisetas.com', password: 'asesor123' },
  { label: 'Domiciliario', email: 'domiciliario@surticamisetas.com', password: 'domi123' },
  { label: 'Cliente', email: 'cliente@email.com', password: 'cliente123' },
];

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const useCartDrawer = () => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error('useCartDrawer must be used within CartDrawerProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const loginWithCredentials = async (email: string, password: string) => {
    const account = TEST_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      const role = account.label === 'Administrador' ? 'admin' : 
                 account.label === 'Asesor' ? 'asesor' :
                 account.label === 'Domiciliario' ? 'domiciliario' : 'cliente';
      setUser({ uid: 'test', email, role });
      return { success: true, role };
    }
    return { success: false, error: 'Credenciales inválidas' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: async () => {}, loginWithCredentials, logout: async () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  const tax = Math.round(subtotal * 0.19);
  const discount = 0;
  const shipping = subtotal >= 150 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  const removeFromCart = (cartId: string) => setItems(prev => prev.filter(item => item.cartId !== cartId));
  const increaseQuantity = (cartId: string) => setItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (cartId: string) => setItems(prev => prev.map(item => item.cartId === cartId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  const clearCart = () => setItems([]);
  const addToCart = (item: Omit<CartItem, 'quantity' | 'cartId'> & { cartId?: string; quantity?: number }) => {
    const id = item.cartId || `cart-${Date.now()}`;
    setItems(prev => [...prev, { ...item, cartId: id, quantity: item.quantity || 1 } as CartItem]);
  };

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, discount, shipping, tax, total, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
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
  <AuthProvider>
    <CartDrawerProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </CartDrawerProvider>
  </AuthProvider>
);