import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Download, Bell, Moon, Sun, Menu } from 'lucide-react';
import '../../presentation/styles/AdminHeader.css';

interface AdminHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onMenuToggle: () => void;
  menuItems?: { key: string; label: string }[];
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  darkMode,
  toggleTheme,
  onMenuToggle,
  menuItems = [],
}) => {
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const currentLabel = menuItems.find(i => i.key === currentPath)?.label || 'Dashboard';

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="icon-btn" onClick={onMenuToggle} aria-label="Abrir menú">
          <Menu size={20} />
        </button>
        <nav className="breadcrumb">
          <span className="breadcrumb-current">{currentLabel}</span>
        </nav>
      </div>

      <div className="header-right">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
          />
        </div>

        <button className="header-btn">
          <Download size={16} />
          <span>Exportar</span>
        </button>

        <div className="notification-wrapper">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <span className="notification-badge">4</span>
        </div>

        <button className="icon-btn" onClick={toggleTheme} aria-label="Cambiar tema">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
