import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackageCheck, MapPin, ClipboardList, UserCircle, Moon, Sun, Menu, Home, LogOut, Search, Download, Bell } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { useAuth } from '@/app/providers/AppProviders';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const domiciliarioMenu = [
  { section: 'Principal' },
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { section: 'Mis Entregas' },
  { icon: PackageCheck, label: 'Entregas de Hoy', key: 'entregas', badge: '6' },
  { icon: MapPin, label: 'Ruta del Día', key: 'ruta' },
  { section: 'Registro' },
  { icon: ClipboardList, label: 'Historial', key: 'historial' },
  { section: 'Cuenta' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

export const DomiciliarioLayout: React.FC = () => {
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
            <span className={s.logoSub}>Panel de Domiciliario</span>
          </div>
        </div>

        <div style={{
          margin: '12px 16px',
          padding: '8px 14px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--color-info)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-info)' }} />
          Domiciliario
        </div>

        <nav className={s.nav}>
          {domiciliarioMenu.map((item, i) => {
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
                to={`/domiciliario/${item.key}`}
                className={({ isActive }) =>
                  `${s.navItem} ${isActive ? s.navItemActive : ''}`
                }
              >
                <Icon className={s.navIcon} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`${s.navBadge} ${s.navBadgeWarning}`} style={{ background: 'var(--color-warning)', color: '#000' }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className={s.sidebarFooter}>
          <div className={s.userCard}>
            <div className={s.userAvatar} style={{ background: 'var(--color-info)', color: '#fff' }}>J</div>
            <div>
              <div className={s.userName}>Juan Pérez</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-info)' }}>Domiciliario</div>
            </div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-success)',
              marginLeft: 'auto',
              boxShadow: '0 0 6px var(--color-success)'
            }} />
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
                {domiciliarioMenu.find(i => i.key === currentPath)?.label || 'Dashboard'}
              </span>
            </nav>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '999px',
              fontSize: '0.78rem',
              color: 'var(--color-success)',
              fontWeight: 600
            }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                animation: 'pulse 2s infinite'
              }} />
              Turno activo
            </div>
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