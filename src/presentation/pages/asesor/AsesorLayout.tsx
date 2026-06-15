import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShoppingBag, BadgeDollarSign, Users, UserCircle, Store } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { Sidebar, SidebarItem } from '@/shared/layouts/Sidebar';
import { useAuth } from '@/app/providers/AppProviders';
import { useDashboardTheme } from '@/core/hooks/useDashboardTheme';
import { TopHeader } from '@/presentation/components/TopHeader';
import { cn } from '@/shared/utils';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const asesorMenu: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard General', key: 'dashboard' },
  { icon: Store, label: 'Catálogo Digital', key: 'catalogo' },
  { icon: MessageSquare, label: 'Servicio al Cliente', key: 'AtencionCliente' },
  { icon: ShoppingBag, label: 'Pedidos', key: 'pedidos' },
  { icon: BadgeDollarSign, label: 'Comisiones', key: 'comisiones' },
  { icon: Users, label: 'Mis Clientes', key: 'clientes' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

export const AsesorLayout: React.FC = () => {
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
        menu={asesorMenu}
        basePath="/asesor"
        logo={logoImg}
        brandName="SURTI CAMISETAS"
        panelLabel="Panel de Asesor"
        user={{ name: 'Camila Torres', role: 'asesor', initials: 'CT' }}
        onLogout={handleLogout}
        showCollapse={true}
        homeHref="/"
        onToggleCollapse={handleSidebarToggle}
      />
      <div className={s.mainContent}>
        <TopHeader
          user={{
            name: 'Camila Torres',
            email: 'asesor@surticamisetas.com',
            role: 'asesor',
            initial: 'CT',
          }}
          notificationCount={2}
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
