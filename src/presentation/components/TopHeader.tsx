import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Download, Sun, Package, ShoppingCart, AlertTriangle, MessageSquare } from 'lucide-react';
import s from './TopHeader.module.css';
import { cn } from '@/shared/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'stock' | 'message' | 'info';
  read: boolean;
  path: string;
}

interface TopHeaderProps {
  user: {
    name: string;
    email: string;
    role: 'admin' | 'asesor' | 'domiciliario' | 'cliente';
    initial: string;
  };
  notificationCount: number;
  onSearch: (value: string) => void;
  onToggleTheme: () => void;
  onExport?: () => void;
  onNotificationClick?: (path: string) => void;
  darkMode?: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Nuevo pedido', message: 'Pedido #12345 ha sido creado', time: 'Hace 5 min', type: 'order', read: false, path: '/admin/pedidos' },
  { id: '2', title: 'Stock bajo', message: 'Producto "Camiseta Negra" tiene stock bajo', time: 'Hace 1 hora', type: 'stock', read: false, path: '/admin/alertas-stock' },
  { id: '3', title: 'Mensaje', message: 'Tienes un nuevo mensaje de soporte', time: 'Hace 2 horas', type: 'message', read: true, path: '/admin/alertas-stock' },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order': return <ShoppingCart size={16} />;
    case 'stock': return <AlertTriangle size={16} />;
    case 'message': return <MessageSquare size={16} />;
    default: return <Package size={16} />;
  }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  notificationCount,
  onSearch,
  onToggleTheme,
  onExport,
  onNotificationClick,
  darkMode = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const showExport = user.role === 'admin' || typeof onExport === 'function';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={s.header}>
      <div className={s.headerLeft}>
        <div className={s.searchWrapper}>
          <Search size={18} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={s.searchInput}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={s.headerRight}>
        <div className={s.notificationWrapper} ref={dropdownRef}>
          <button
            className={s.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones"
          >
            <Bell size={20} />
          </button>
          {notificationCount > 0 && (
            <span className={s.badge}>{notificationCount}</span>
          )}
          {showNotifications && (
            <div className={s.notificationsDropdown}>
              <div className={s.notificationsHeader}>
                <h3>Notificaciones</h3>
                <span className={s.notificationsCount}>{notificationCount} nuevas</span>
              </div>
              <div className={s.notificationsList}>
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(s.notificationItem, !notification.read && s.unread)}
                    onClick={() => {
                      setShowNotifications(false);
                      onNotificationClick?.(notification.path);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={s.notificationIcon}>{getNotificationIcon(notification.type)}</div>
                    <div className={s.notificationContent}>
                      <h4 className={s.notificationTitle}>{notification.title}</h4>
                      <p className={s.notificationMessage}>{notification.message}</p>
                      <span className={s.notificationTime}>{notification.time}</span>
                    </div>
                    {!notification.read && <div className={s.unreadDot} />}
                  </div>
                ))}
                {mockNotifications.length === 0 && (
                  <div className={s.emptyNotifications}>
                    <Bell size={32} className={s.emptyIcon} />
                    <p>No hay notificaciones nuevas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          className={s.iconBtn}
          onClick={onToggleTheme}
          aria-label="Cambiar tema"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {showExport && (
          <button className={s.exportBtn} onClick={onExport}>
            <Download size={16} />
            <span>Exportar</span>
          </button>
        )}

        <div className={s.userProfile}>
          <div className={s.avatar}>{user.initial}</div>
          <div className={s.userInfo}>
            <span className={s.userName}>{user.name}</span>
            <span className={s.userEmail}>{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
