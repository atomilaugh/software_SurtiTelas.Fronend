import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LayoutGrid, ShoppingBag, UserCircle, Moon, Sun, Menu, Home, LogOut, Search, Download, Bell, MessageSquare } from 'lucide-react';
import s from '../../../styles/admin/AdminLayout.module.css';
import { useAuth } from '@/app/providers/AppProviders';
import logoImg from '@/assets/images/logos/partner-logo-2-Photoroom.png';

const clienteMenu = [
  { section: 'Principal' },
  { icon: LayoutDashboard, label: 'Inicio', key: 'inicio' },
  { section: 'Compras' },
  { icon: MessageSquare, label: 'Servicio al Cliente', key: 'catalogo' },
  { icon: ShoppingBag, label: 'Mis Pedidos', key: 'pedidos', badge: '2' },
  { section: 'Cuenta' },
  { icon: UserCircle, label: 'Mi Perfil', key: 'perfil' },
];

const asesorAsignado = {
  nombre: 'Camila Torres',
  iniciales: 'CT',
};

export const ClienteLayout: React.FC = () => {
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

  const currentPath = location.pathname.split('/').pop() || 'inicio';

  return (
    <div className={s.layout}>
      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.logo}>
          <img src={logoImg} alt="Surtitelas" className={s.logoImg} />
          <div>
            <span className={s.logoText}>Surtitelas</span>
            <span className={s.logoSub}>Portal Cliente</span>
          </div>
        </div>

        <div className={s.roleBadge}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
          Cliente
        </div>

        <nav className={s.nav}>
          {clienteMenu.map((item, i) => {
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
                to={`/cliente/${item.key}`}
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
            <div className={s.userAvatar} style={{ background: 'var(--color-success)' }}>J</div>
            <div>
              <div className={s.userName}>Juan Martínez</div>
              <div className={s.userRole}>Cliente</div>
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
                {clienteMenu.find(i => i.key === currentPath)?.label || 'Inicio'}
              </span>
            </nav>
            <div className={s.asesorChip}>
              <div className={s.asesorAvatar}>{asesorAsignado.iniciales}</div>
              <span className={s.asesorLabel}>Asesor:</span>
              <span className={s.asesorNombre}>{asesorAsignado.nombre}</span>
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