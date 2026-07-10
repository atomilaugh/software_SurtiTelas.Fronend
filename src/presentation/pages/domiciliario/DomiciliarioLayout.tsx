import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackageCheck, MapPin, ClipboardList, UserCircle } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { Sidebar, SidebarItem } from '@/shared/layouts/Sidebar';
import { useAuth } from '@/app/providers/AppProviders';
import { useDashboardTheme } from '@/core/hooks/useDashboardTheme';
import { TopHeader } from '@/presentation/components/TopHeader';
import { cn } from '@/shared/utils';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const domiciliarioMenu: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard General', key: 'dashboard' },
  { icon: PackageCheck, label: 'Entregas de Hoy', key: 'entregas' },
  { icon: MapPin, label: 'Ruta del Día', key: 'ruta' },
  { icon: ClipboardList, label: 'Historial', key: 'historial' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

export const DomiciliarioLayout: React.FC = () => {
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
    try {
      window.localStorage.removeItem('dashboard-theme');
      document.querySelectorAll<HTMLElement>('[data-dashboard-theme]').forEach(el => el.removeAttribute('data-theme'));
      document.documentElement.removeAttribute('data-theme');
      document.body?.removeAttribute('data-theme');
    } catch (e) {
      // ignore
    }

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
    <div data-dashboard-theme className={cn(s.appLayout, isCollapsed && s.collapsed)}>
      <Sidebar
        menu={domiciliarioMenu}
        basePath="/domiciliario"
        logo={logoImg}
        brandName="SURTI CAMISETAS"
        panelLabel="Panel de Domiciliario"
        user={{ name: 'Juan Pérez', role: 'domiciliario', initials: 'JP' }}
        onLogout={handleLogout}
        showCollapse={true}
        homeHref="/"
        onToggleCollapse={handleSidebarToggle}
      />
      <div className={s.mainContent}>
        <TopHeader
          user={{
            name: 'Juan Pérez',
            email: 'domiciliario@surticamisetas.com',
            role: 'domiciliario',
            initial: 'JP',
          }}
          notificationCount={1}
          onSearch={() => {}}
          onToggleTheme={toggleTheme}
          onNotificationClick={handleNotificationClick}
          notifications={[
            { id: '1', title: 'Nueva entrega', message: 'Tienes una nueva entrega asignada', time: 'Hace 5 min', type: 'order', read: false, path: '/domiciliario/entregas' },
            { id: '2', title: 'Entrega retrasada', message: 'Una entrega presenta retraso', time: 'Hace 1 hora', type: 'stock', read: false, path: '/domiciliario/ruta' },
            { id: '3', title: 'Mensaje', message: 'Tienes un nuevo mensaje de soporte', time: 'Hace 2 horas', type: 'message', read: true, path: '/domiciliario/dashboard' },
          ]}
          darkMode={darkMode}
        />
        <main className={s.pageContent}><Outlet /></main>
      </div>
    </div>
  );
};
