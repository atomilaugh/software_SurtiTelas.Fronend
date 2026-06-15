import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShoppingBag, UserCircle, Route, ReceiptText, Heart } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { Sidebar, SidebarItem } from '@/shared/layouts/Sidebar';
import { useAuth } from '@/app/providers/AppProviders';
import { useDashboardTheme } from '@/core/hooks/useDashboardTheme';
import { TopHeader } from '@/presentation/components/TopHeader';
import { cn } from '@/shared/utils';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const clienteMenu: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Inicio', key: 'inicio' },
  { icon: MessageSquare, label: 'Servicio al Cliente', key: 'catalogo' },
  { icon: ShoppingBag, label: 'Mis Pedidos', key: 'pedidos' },
  { icon: ReceiptText, label: 'Mis Recibos', key: 'recibos' },
  { icon: Heart, label: 'Mis Favoritos', key: 'favoritos' },
  { icon: Route, label: 'Seguimiento', key: 'seguimiento' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

export const ClienteLayout: React.FC = () => {
  const [darkMode, toggleTheme] = useDashboardTheme();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('surtitelas.sidebarCollapsed') === 'true';
  });
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    window.localStorage.setItem('surtitelas.sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleNotificationClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(s.appLayout, isCollapsed && s.collapsed)}>
      <Sidebar
        menu={clienteMenu}
        basePath="/cliente"
        logo={logoImg}
        brandName="SURTI CAMISETAS"
        panelLabel="Portal Cliente"
        user={{ name: 'Juan Martínez', role: 'cliente', initials: 'JM' }}
        onLogout={handleLogout}
        showCollapse={true}
        homeHref="/"
        onToggleCollapse={handleSidebarToggle}
      />
      <div className={s.mainContent}>
        <TopHeader
          user={{
            name: 'Juan Martínez',
            email: 'cliente@surticamisetas.com',
            role: 'cliente',
            initial: 'JM',
          }}
          notificationCount={0}
          onSearch={() => {}}
          onToggleTheme={toggleTheme}
          onNotificationClick={handleNotificationClick}
          darkMode={darkMode}
        />
        <main className={s.pageContent}><Outlet /></main>
      </div>
    </div>
  );
};
