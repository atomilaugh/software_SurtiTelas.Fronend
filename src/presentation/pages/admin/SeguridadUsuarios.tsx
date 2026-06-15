import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, Clock, User, Globe } from 'lucide-react';
import s from './SeguridadUsuarios.module.css';
import { Badge } from '../../../shared/ui/Badge';

interface Auditoria {
  id: string;
  usuario: string;
  accion: string;
  modulo: string;
  ip: string;
  fecha: string;
  hora: string;
  estado: 'Éxito' | 'Fallido' | 'Alerta';
}

const mockAuditorias: Auditoria[] = [
  { id: 'L-001', usuario: 'Carlos Martínez', accion: 'Login exitoso', modulo: 'Autenticación', ip: '192.168.1.10', fecha: '2024-06-10', hora: '08:23:45', estado: 'Éxito' },
  { id: 'L-002', usuario: 'Ana López', accion: 'Login fallido', modulo: 'Autenticación', ip: '192.168.1.15', fecha: '2024-06-10', hora: '09:15:22', estado: 'Fallido' },
  { id: 'L-003', usuario: 'Jorge Ruiz', accion: 'Intento de acceso no autorizado', modulo: 'Configuración', ip: '192.168.1.22', fecha: '2024-06-09', hora: '14:45:33', estado: 'Alerta' },
  { id: 'L-004', usuario: 'Luis Pérez', accion: 'Cambio de contraseña', modulo: 'Perfil', ip: '192.168.1.12', fecha: '2024-06-09', hora: '11:30:12', estado: 'Éxito' },
  { id: 'L-005', usuario: 'María González', accion: 'Login exitoso', modulo: 'Autenticación', ip: '192.168.1.18', fecha: '2024-06-08', hora: '16:22:55', estado: 'Éxito' },
  { id: 'L-006', usuario: 'Ana López', accion: 'Creación de usuario', modulo: 'Usuarios', ip: '192.168.1.15', fecha: '2024-06-08', hora: '10:15:44', estado: 'Éxito' },
  { id: 'L-007', usuario: 'Carlos Martínez', accion: 'Modificación de permiso', modulo: 'Configuración', ip: '192.168.1.10', fecha: '2024-06-07', hora: '14:33:21', estado: 'Éxito' },
];

export const AdminSeguridadUsuarios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'Todos' | 'Éxito' | 'Fallido' | 'Alerta'>('Todos');

  const filteredAuditorias = mockAuditorias.filter(a =>
    (filtro === 'Todos' || a.estado === filtro) &&
    (a.usuario.toLowerCase().includes(search.toLowerCase()) ||
     a.accion.toLowerCase().includes(search.toLowerCase()) ||
     a.modulo.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Seguridad de Usuarios</h1>
          <p className={s.pageSubtitle}>Auditoría y seguridad de usuarios</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <Shield size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{mockAuditorias.filter(a => a.estado === 'Éxito').length}</div>
              <div className={s.statLabel}>Éxitos</div>
            </div>
          </div>
          <div className={s.statCard}>
            <AlertTriangle size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{mockAuditorias.filter(a => a.estado === 'Alerta').length}</div>
              <div className={s.statLabel}>Alertas</div>
            </div>
          </div>
          <div className={s.statCard}>
            <Clock size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>7 días</div>
              <div className={s.statLabel}>Período activo</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Éxito', 'Fallido', 'Alerta'].map(f => (
            <button
              key={f}
              className={`${s.filterBtn} ${filtro === f ? s.filterBtnActive : ''}`}
              onClick={() => setFiltro(f as typeof filtro)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar en auditoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Módulo</th>
              <th>IP</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuditorias.map(auditoria => (
              <tr key={auditoria.id}>
                <td className={s.tdMono}>{auditoria.id}</td>
                <td className={s.tdPrimary}>
                  <div className={s.usuarioCell}>
                    <User size={14} />
                    {auditoria.usuario}
                  </div>
                </td>
                <td>{auditoria.accion}</td>
                <td>{auditoria.modulo}</td>
                <td>
                  <div className={s.ipCell}>
                    <Globe size={14} />
                    {auditoria.ip}
                  </div>
                </td>
                <td>{auditoria.fecha}</td>
                <td>{auditoria.hora}</td>
                <td>
                  <Badge variant={
                    auditoria.estado === 'Éxito' ? 'success' :
                    auditoria.estado === 'Fallido' ? 'default' : 'warning'
                  }>
                    {auditoria.estado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
