import React, { useState } from 'react';
import { Search, AlertTriangle, Bell, Calendar, Factory, X, CheckCircle } from 'lucide-react';
import s from './AlertasRegistroTalleres.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface AlertaTaller {
  id: string;
  tallerNombre: string;
  tipo: 'Capacidad maxima' | 'Inactividad' | 'Sin ordenes' | 'Contacto no disponible';
  descripcion: string;
  fechaAlerta: string;
  estado: 'Pendiente' | 'Vista' | 'Resuelta';
  prioridad: 'Alta' | 'Media' | 'Baja';
}

const mockAlertas: AlertaTaller[] = [
  { id: 'AT-001', tallerNombre: 'Taller Textil El Progreso', tipo: 'Capacidad maxima', descripcion: 'Ocupación al 100% - No puede recibir más órdenes', fechaAlerta: '2024-06-10', estado: 'Pendiente', prioridad: 'Alta' },
  { id: 'AT-002', tallerNombre: 'Confección Martínez', tipo: 'Sin ordenes', descripcion: 'Sin órdenes asignadas en los últimos 15 días', fechaAlerta: '2024-06-10', estado: 'Pendiente', prioridad: 'Media' },
  { id: 'AT-003', tallerNombre: 'Taller San José', tipo: 'Contacto no disponible', descripcion: 'Teléfono no disponible - No se pudo confirmar entrega', fechaAlerta: '2024-06-09', estado: 'Pendiente', prioridad: 'Alta' },
  { id: 'AT-004', tallerNombre: 'Artesanías del Valle', tipo: 'Inactividad', descripcion: 'Taller inactivo por más de 30 días', fechaAlerta: '2024-06-08', estado: 'Resuelta', prioridad: 'Media' },
  { id: 'AT-005', tallerNombre: 'Taller Rápido', tipo: 'Capacidad maxima', descripcion: 'Ocupación al 95% - Próximo a capacidad máxima', fechaAlerta: '2024-06-07', estado: 'Vista', prioridad: 'Media' },
  { id: 'AT-006', tallerNombre: 'Confecciones del Norte', tipo: 'Sin ordenes', descripcion: 'Sin órdenes asignadas en los últimos 30 días', fechaAlerta: '2024-06-06', estado: 'Vista', prioridad: 'Baja' },
];

export const AdminAlertasRegistroTalleres: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Vista' | 'Resuelta'>('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<'Todos' | 'Alta' | 'Media' | 'Baja'>('Todos');
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaTaller | null>(null);

  const filteredAlertas = mockAlertas.filter(a =>
    (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
    (filtroPrioridad === 'Todos' || a.prioridad === filtroPrioridad) &&
    (a.tallerNombre.toLowerCase().includes(search.toLowerCase()) ||
     a.tipo.toLowerCase().includes(search.toLowerCase()) ||
     a.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'warning';
      case 'Resuelta': return 'success';
      default: return 'default';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return s.prioridadAlta;
      case 'Media': return s.prioridadMedia;
      case 'Baja': return s.prioridadBaja;
      default: return '';
    }
  };

  const stats = {
    pendientes: mockAlertas.filter(a => a.estado === 'Pendiente').length,
    criticas: mockAlertas.filter(a => a.prioridad === 'Alta' && a.estado !== 'Resuelta').length,
    resueltas: mockAlertas.filter(a => a.estado === 'Resuelta').length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Alertas de Registro de Talleres</h1>
          <p className={s.pageSubtitle}>Gestión de talleres externos</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <Bell size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{stats.pendientes}</div>
              <div className={s.statLabel}>Pendientes</div>
            </div>
          </div>
          <div className={`${s.statCard} ${s.statCardWarning}`}>
            <AlertTriangle size={20} className={s.statIconWarning} />
            <div>
              <div className={s.statValue}>{stats.criticas}</div>
              <div className={s.statLabel}>Críticas</div>
            </div>
          </div>
          <div className={s.statCard}>
            <div className={s.statIconDone}>✓</div>
            <div>
              <div className={s.statValue}>{stats.resueltas}</div>
              <div className={s.statLabel}>Resueltas</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Pendiente', 'Vista', 'Resuelta'].map(estado => (
            <button
              key={estado}
              className={`${s.filterBtn} ${filtroEstado === estado ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroEstado(estado as typeof filtroEstado)}
            >
              {estado}
            </button>
          ))}
        </div>
        <div className={s.filterGroup}>
          {['Todos', 'Alta', 'Media', 'Baja'].map(prioridad => (
            <button
              key={prioridad}
              className={`${s.filterBtn} ${filtroPrioridad === prioridad ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroPrioridad(prioridad as typeof filtroPrioridad)}
            >
              {prioridad}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar alertas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<AlertaTaller>
        data={filteredAlertas}
        pageSize={10}
        emptyMessage="No se encontraron alertas"
        onRowClick={setSelectedAlerta}
        actions={(a) => [
          ...(a.estado !== 'Resuelta' ? [{ label: 'Marcar resuelta', icon: <CheckCircle size={14} />, onClick: () => setSelectedAlerta(a) }] : []),
        ]}
        columns={[
          { key: 'id', header: 'ID', width: '80px', render: (a) => <span className={s.tdMono}>{a.id}</span> },
          { key: 'tallerNombre', header: 'Taller', width: '180px', render: (a) => (
            <div className={s.tallerCell}>
              <Factory size={14} />
              {a.tallerNombre}
            </div>
          )},
          { key: 'tipo', header: 'Tipo', render: (a) => a.tipo },
          { key: 'descripcion', header: 'Descripción', width: '200px', render: (a) => (
            <div className={s.descripcionCell} title={a.descripcion}>{a.descripcion}</div>
          )},
          { key: 'prioridad', header: 'Prioridad', width: '100px', render: (a) => (
            <span className={`${s.prioridadBadge} ${getPrioridadColor(a.prioridad)}`}>{a.prioridad}</span>
          )},
          { key: 'fechaAlerta', header: 'Fecha', width: '110px', render: (a) => (
            <div className={s.fechaCell}>
              <Calendar size={14} />
              {a.fechaAlerta}
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Vista', label: 'Vista' },
            { value: 'Resuelta', label: 'Resuelta' },
          ], render: (a) => (
            <Badge variant={getBadgeVariant(a.estado)}>{a.estado}</Badge>
          )},
        ]}
      />

      {selectedAlerta && (
        <div className={s.modalOverlay} onClick={() => setSelectedAlerta(null)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                Detalle de Alerta - {selectedAlerta.id}
              </h2>
              <button className={s.closeBtn} onClick={() => setSelectedAlerta(null)}>
                <X size={16} />
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.detailGrid}>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Taller</span>
                  <span className={s.detailValue}>{selectedAlerta.tallerNombre}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Tipo</span>
                  <span className={s.detailValue}>{selectedAlerta.tipo}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Prioridad</span>
                  <span className={`${s.detailValue} ${getPrioridadColor(selectedAlerta.prioridad)}`}>
                    {selectedAlerta.prioridad}
                  </span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Fecha</span>
                  <span className={s.detailValue}>{selectedAlerta.fechaAlerta}</span>
                </div>
                <div className={s.detailItemFull}>
                  <span className={s.detailLabel}>Descripción</span>
                  <span className={s.detailValue}>{selectedAlerta.descripcion}</span>
                </div>
              </div>
              <div className={s.formActions}>
                <Button variant="secondary" onClick={() => setSelectedAlerta(null)}>
                  Cerrar
                </Button>
                {selectedAlerta.estado !== 'Resuelta' && (
                  <Button onClick={() => setSelectedAlerta(null)}>
                    Marcar como resuelta
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

