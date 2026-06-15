import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings2, Users, UserCog, Shield, Package, PackageOpen, Boxes, AlertTriangle, Archive, Factory, Workflow, ClipboardList, ShoppingCart, Receipt, UserSearch, BarChart3, TrendingUp, Users2, LineChart, Store } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { Sidebar, SidebarItem } from '@/shared/layouts/Sidebar';
import { useAuth } from '@/app/providers/AppProviders';
import { useDashboardTheme } from '@/core/hooks/useDashboardTheme';
import { TopHeader } from '@/presentation/components/TopHeader';
import { cn } from '@/shared/utils';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const adminMenu: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard General', key: 'dashboard' },
  {
    icon: Settings2,
    label: 'Configuración',
    key: 'configuracion',
    subItems: [
      { icon: Shield, label: 'Roles', key: 'roles' },
      { icon: UserCog, label: 'Permisos', key: 'permisos' },
    ],
  },
  {
    icon: Users,
    label: 'Usuarios',
    key: 'usuarios',
    subItems: [
      { icon: UserSearch, label: 'Gestión de Usuarios', key: 'gestion-usuarios' },
      { icon: Shield, label: 'Seguridad', key: 'seguridad' },
    ],
  },
  {
    icon: Package,
    label: 'Existencias',
    key: 'inventario',
    subItems: [
      { icon: PackageOpen, label: 'Productos Terminados', key: 'productos' },
      { icon: Boxes, label: 'Insumos', key: 'insumos' },
      { icon: AlertTriangle, label: 'Alertas de Stock', key: 'alertas-stock' },
      { icon: Archive, label: 'Stock Devuelto', key: 'stock-devuelto' },
    ],
  },
  {
    icon: Factory,
    label: 'Producción en Talleres Externos',
    key: 'produccion',
    subItems: [
      { icon: ClipboardList, label: 'Registro de Talleres', key: 'talleres' },
      { icon: Workflow, label: 'Control de Prendas', key: 'prendas' },
      { icon: ClipboardList, label: 'Asignación de Producción', key: 'asignacion' },
      { icon: LineChart, label: 'Seguimiento', key: 'seguimiento' },
    ],
  },
  {
    icon: ShoppingCart,
    label: 'Ventas y Pedidos',
    key: 'ventas-pedidos',
    subItems: [
      { icon: ShoppingCart, label: 'Pedidos', key: 'pedidos' },
      { icon: Receipt, label: 'Recibos', key: 'facturacion' },
      { icon: Users2, label: 'Clientes', key: 'clientes' },
    ],
  },
  {
    icon: TrendingUp,
    label: 'Dashboard de Reportes (Analítica)',
    key: 'reportes',
    subItems: [
      { icon: BarChart3, label: 'Reportes de Ventas', key: 'reportes-ventas' },
      { icon: Users2, label: 'Reportes de Usuarios', key: 'reportes-usuarios' },
      { icon: Factory, label: 'Reportes de Producción', key: 'reportes-produccion' },
      { icon: Package, label: 'Reportes de Inventario', key: 'reportes-inventario' },
    ],
  },
  { icon: Store, label: 'Catálogo Digital', key: 'catalogo' },
];

export const AdminLayout: React.FC = () => {
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

  const handleSearch = (value: string) => {
    console.log('Buscar:', value);
  };

  const handleNotificationClick = (path: string) => {
    navigate(path);
  };

  const handleExport = () => {
    const csvContent = [
      ['Producto', 'Cantidad', 'Precio', 'Total'],
      ['Camiseta Negra', '10', '$25.000', '$250.000'],
      ['Pantalón Jeans', '5', '$45.000', '$225.000'],
    ].map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reporte-surtitelas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className={cn(s.appLayout, isCollapsed && s.collapsed)}>
      <Sidebar
        menu={adminMenu}
        basePath="/admin"
        logo={logoImg}
        brandName="SURTI CAMISETAS"
        panelLabel="Admin Panel"
        user={{ name: 'Admin User', role: 'Administrador', initials: 'AU' }}
        onLogout={handleLogout}
        showCollapse={true}
        homeHref="/"
        onToggleCollapse={handleSidebarToggle}
      />

      <div className={s.mainContent}>
        <TopHeader
          user={{
            name: 'Admin User',
            email: 'admin@surticamisetas.com',
            role: 'admin',
            initial: 'AU',
          }}
          notificationCount={4}
          onSearch={handleSearch}
          onToggleTheme={toggleTheme}
          onExport={handleExport}
          onNotificationClick={handleNotificationClick}
          darkMode={darkMode}
        />

        <main className={s.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
