import React, { useState } from 'react';
import { toast } from 'sonner';
import { Edit, Package, CheckCircle2, Clock, XCircle, User, MapPin } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './AdminDomicilios.module.css';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '../../../shared/ui/DataTable';

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

  const columns: DataTableColumn<Domiciliario>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'zona', header: 'Zona', sortable: true },
    { key: 'entregas', header: 'Entregas', sortable: true, align: 'right' },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Domiciliario> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'lg',
    header: item => ({
      icon: <User size={18} />,
      title: 'Domiciliario',
      code: item.id,
      subtitle: item.email,
      meta: item.zona,
      status: item.estado,
      badgeVariant: item.estado === 'Activo' ? 'success' : 'default',
    }),
    kpis: item => [
      { label: 'Entregas', value: item.entregas, icon: <Package size={16} />, tone: 'primary' },
      { label: 'Zona', value: item.zona, icon: <MapPin size={16} />, tone: 'info' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Email:</span> {item.email}</div>
        <div className={s.detailRow}><span>Teléfono:</span> {item.tel}</div>
        <div className={s.detailRow}><span>Zona:</span> {item.zona}</div>
        <div className={s.detailRow}><span>Entregas:</span> {item.entregas}</div>
      </div>
    ),
  };

  const actions: DataTableAction<Domiciliario>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: () => toast.info('Editar domiciliario') },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Domiciliarios</h1>
          <p className={s.pageSubtitle}>Gestión del equipo de entregas</p>
        </div>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar domiciliarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
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
        <DataTable
          data={filteredDomiciliarios}
          columns={columns}
          detailPanel={detailPanel}
          actions={actions}
          enableColumnFilters={false}
          enableExport={false}
          enableRowSelection={false}
          enableSorting={true}
          toolbarLeft={null}
          maxVisibleColumns={5}
        />
      </div>
    </div>
  );
};

