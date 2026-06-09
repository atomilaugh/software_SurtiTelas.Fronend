import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate,  } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, LayoutGrid, BadgeDollarSign, UserCircle, Moon, Sun, Menu, Home, LogOut, Search, Download, Bell, MessageSquare } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { useAuth } from '@/app/providers/AppProviders';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const asesorMenu = [
  { section: 'Principal' },
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { section: 'Mis Ventas' },
  { icon: Users, label: 'Mis Clientes', key: 'clientes', badge: '43' },
  { icon: ShoppingBag, label: 'Pedidos', key: 'pedidos', badge: '7' },
  { icon: MessageSquare, label: 'Atención al cliente', key: 'AtencionCliente' },
  { icon: LayoutGrid, label: 'Catálogo', key: 'catalogo' },
  { section: 'Finanzas' },
  { icon: BadgeDollarSign, label: 'Mis Comisiones', key: 'comisiones' },
  { section: 'Cuenta' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

export const AsesorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleGoHome = () => navigate('/');
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className={s.layout}>
      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.logo}>
          <img src={logoImg} alt="Surtitelas" className={s.logoImg} />
          <div>
            <span className={s.logoText}>Surtitelas</span>
            <span className={s.logoSub}>Panel de Asesor</span>
          </div>
        </div>

        <div style={{
          margin: '12px 16px',
          padding: '8px 14px',
          background: 'rgba(244,162,97,0.08)',
          border: '1px solid rgba(244,162,97,0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--color-accent)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }} />
          Asesor de Ventas
        </div>

        <nav className={s.nav}>
          {asesorMenu.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className={s.navSection}>
                  {item.section}
                </div>
              );
            }
            const Icon = item.icon!;
            return (
              <NavLink
                key={i}
                to={`/asesor/${item.key}`}
                className={({ isActive }) =>
                  `${s.navItem} ${isActive ? s.navItemActive : ''}`
                }
              >
                <Icon className={s.navIcon} />
                <span>{item.label}</span>
                {item.badge && <span className={s.navBadge}>{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className={s.sidebarFooter}>
          <div className={s.userCard}>
            <div className={s.userAvatar}>C</div>
            <div>
              <div className={s.userName}>Camila Torres</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>Asesor</div>
            </div>
          </div>
        </div>

        <div className={s.sidebarFooterActions}>
          <button className={s.footerBtn} onClick={handleGoHome}>
            <Home size={18} className={s.footerIcon} />
            Ir al inicio
          </button>
          <button className={s.footerBtn} onClick={handleLogout}>
            <LogOut size={18} className={s.footerIcon} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={s.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

      <div className={s.main}>
        <header className={s.header}>
          <div className={s.headerLeft}>
            <button
              className={s.menuBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <nav className={s.breadcrumb}>
              <span className={s.breadcrumbCurrent}>
                {asesorMenu.find(i => i.key === currentPath)?.label || 'Dashboard'}
              </span>
            </nav>
          </div>

<div className={s.headerRight}>
             <div className={s.searchWrapper}>
               <Search size={16} className={s.searchIcon} />
               <input 
                 type="text" 
                 placeholder="Buscar..." 
                 className={s.searchInput}
               />
             </div>

             <button className={s.exportBtn}>
               <Download size={16} />
               Exportar
             </button>

             <div className={s.notificationWrapper}>
               <button className={s.iconBtn}>
                 <Bell size={20} />
               </button>
               <span className={s.badge}>4</span>
             </div>

             <button className={s.iconBtn} onClick={toggleTheme}>
               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
           </div>
        </header>

        <main className={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};