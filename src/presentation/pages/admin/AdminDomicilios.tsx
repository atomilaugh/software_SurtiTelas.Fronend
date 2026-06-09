import React, { useState } from 'react';
import { Search, Eye, Edit, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';
import s from './AdminDomicilios.module.css';
import { Badge } from '../../../shared/ui/Badge';

interface Domiciliario {
  id: string;
  nombre: string;
  email: string;
  tel: string;
  zona: string;
  entregas: number;
  estado: 'Activo' | 'Inactivo';
}

const mockDomiciliarios: Domiciliario[] = [
  { id: 'DM-001', nombre: 'Juan Pérez', email: 'juan.p@surtitelas.com', tel: '310 234 5678', zona: 'Bogotá Centro', entregas: 187, estado: 'Activo' },
  { id: 'DM-002', nombre: 'María Gómez', email: 'maria.g@surtitelas.com', tel: '311 345 6789', zona: 'Nororiente', entregas: 156, estado: 'Activo' },
  { id: 'DM-003', nombre: 'Carlos Ruiz', email: 'carlos.r@surtitelas.com', tel: '312 456 7890', zona: 'Sur', entregas: 98, estado: 'Activo' },
  { id: 'DM-004', nombre: 'Ana López', email: 'ana.l@surtitelas.com', tel: '313 567 8901', zona: 'Noroccidente', entregas: 142, estado: 'Inactivo' },
  { id: 'DM-005', nombre: 'Luis Martínez', email: 'luis.m@surtitelas.com', tel: '314 567 8902', zona: 'Occidente', entregas: 89, estado: 'Activo' },
];

export const AdminDomicilios: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredDomiciliarios = mockDomiciliarios.filter(d =>
    d.nombre.toLowerCase().includes(search.toLowerCase()) ||
    d.zona.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Domiciliarios</h1>
          <p className={s.pageSubtitle}>Gestión del equipo de entregas</p>
        </div>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar domiciliarios..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statIcon}><Package size={20} /></div>
          <div className={s.statValue}>24</div>
          <div className={s.statLabel}>Entregas hoy</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><CheckCircle2 size={20} /></div>
          <div className={s.statValue}>18</div>
          <div className={s.statLabel}>Completadas</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><Clock size={20} /></div>
          <div className={s.statValue}>6</div>
          <div className={s.statLabel}>Pendientes</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><XCircle size={20} /></div>
          <div className={s.statValue}>0</div>
          <div className={s.statLabel}>Fallidas</div>
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Zona</th>
              <th>Entregas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDomiciliarios.map(domiciliario => (
              <tr key={domiciliario.id}>
                <td className={s.tdMono}>{domiciliario.id}</td>
                <td className={s.tdPrimary}>{domiciliario.nombre}</td>
                <td>{domiciliario.email}</td>
                <td>{domiciliario.tel}</td>
                <td>{domiciliario.zona}</td>
                <td>{domiciliario.entregas}</td>
                <td>
                  <Badge variant={domiciliario.estado === 'Activo' ? 'info' : 'default'}>
                    {domiciliario.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} title="Ver">
                      <Eye size={14} />
                    </button>
                    <button className={s.actionBtn} title="Editar">
                      <Edit size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};