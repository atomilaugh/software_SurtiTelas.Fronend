import React, { useState } from 'react';
import { Search, AlertTriangle, Bell, Clock, Calendar, Factory, Package, X, CheckCircle } from 'lucide-react';
import s from './AlertasAsignacionProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface AlertaAsignacion {
  id: string;
  numeroOrden: string;
  prenda: string;
  tallerNombre: string;
  tipo: 'Orden sin asignar' | 'Taller sin capacidad' | 'Fecha comprometida' | 'Retraso en asignacion' | 'Cambio de taller';
  descripcion: string;
  fechaAlerta: string;
  estado: 'Pendiente' | 'Vista' | 'Resuelta';
  prioridad: 'Alta' | 'Media' | 'Baja';
}

const mockAlertas: AlertaAsignacion[] = [
  { id: 'AA-001', numeroOrden: 'ORD-2024-007', prenda: 'Camisa ejecutiva', tallerNombre: '-', tipo: 'Orden sin asignar', descripcion: 'Orden pendiente sin taller asignado. Fecha límite: 2024-06-14', fechaAlerta: '2024-06-10', estado: 'Pendiente', prioridad: 'Alta' },
  { id: 'AA-002', numeroOrden: 'ORD-2024-008', prenda: 'Conjunto deportivo', tallerNombre: 'Taller San José', tipo: 'Taller sin capacidad', descripcion: 'Taller al 95% de capacidad. No puede recibir más órdenes', fechaAlerta: '2024-06-10', estado: 'Pendiente', prioridad: 'Alta' },
  { id: 'AA-003', numeroOrden: 'ORD-2024-009', prenda: 'Vestido gala', tallerNombre: 'Confección Martínez', tipo: 'Fecha comprometida', descripcion: 'Orden con fecha de entrega próxima en 2 días', fechaAlerta: '2024-06-09', estado: 'Vista', prioridad: 'Media' },
  { id: 'AA-004', numeroOrden: 'ORD-2024-010', prenda: 'Uniforme empresarial', tallerNombre: '-', tipo: 'Retraso en asignacion', descripcion: 'Orden pendiente por más de 5 días sin asignación', fechaAlerta: '2024-06-08', estado: 'Pendiente', prioridad: 'Media' },
  { id: 'AA-005', numeroOrden: 'ORD-2024-011', prenda: 'Pantalón escolar', tallerNombre: 'Taller Textil El Progreso', tipo: 'Cambio de taller', descripcion: 'Taller original canceló. Requiere reasignación', fechaAlerta: '2024-06-07', estado: 'Resuelta', prioridad: 'Alta' },
  { id: 'AA-006', numeroOrden: 'ORD-2024-012', prenda: 'Chaqueta impermeable', tallerNombre: 'Artesanías del Valle', tipo: 'Fecha comprometida', descripcion: 'Fecha de entrega en 1 día', fechaAlerta: '2024-06-10', estado: 'Pendiente', prioridad: 'Alta' },
];

export const AdminAlertasAsignacionProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Vista' | 'Resuelta'>('Todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaAsignacion | null>(null);

  const filteredAlertas = mockAlertas.filter(a =>
    (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
    (filtroTipo === 'Todos' || a.tipo === filtroTipo) &&
    (a.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
     a.prenda.toLowerCase().includes(search.toLowerCase()) ||
     a.tallerNombre.toLowerCase().includes(search.toLowerCase()) ||
     a.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const tiposUnicos = Array.from(new Set(mockAlertas.map(a => a.tipo)));

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'warning';
      case 'Resuelta': return 'success';
      default: return 'default';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Orden sin asignar': return <Package size={14} />;
      case 'Taller sin capacidad': return <Factory size={14} />;
      case 'Fecha comprometida': return <Calendar size={14} />;
      case 'Retraso en asignacion': return <Clock size={14} />;
      case 'Cambio de taller': return <AlertTriangle size={14} />;
      default: return <AlertTriangle size={14} />;
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
          <h1 className={s.pageTitle}>Alertas de Asignación de Producción</h1>
          <p className={s.pageSubtitle}>Asignar órdenes a talleres</p>
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
          {tiposUnicos.map(tipo => (
            <button
              key={tipo}
              className={`${s.filterBtn} ${filtroTipo === tipo ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {getTipoIcon(tipo)}
              <span className={s.filterBtnText}>{tipo}</span>
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

      <DataTable<AlertaAsignacion>
        data={filteredAlertas}
        pageSize={10}
        emptyMessage="No se encontraron alertas"
        onRowClick={setSelectedAlerta}
        actions={(a) => [
          ...(a.estado !== 'Resuelta' ? [{ label: 'Marcar resuelta', icon: <CheckCircle size={14} />, onClick: () => setSelectedAlerta(a) }] : []),
        ]}
        columns={[
          { key: 'id', header: 'ID', width: '80px', render: (a) => <span className={s.tdMono}>{a.id}</span> },
          { key: 'numeroOrden', header: 'Orden', width: '120px', render: (a) => <span className={s.tdMono}>{a.numeroOrden}</span> },
          { key: 'prenda', header: 'Prenda', render: (a) => a.prenda },
          { key: 'tallerNombre', header: 'Taller', width: '160px', render: (a) => (
            a.tallerNombre !== '-' ? (
              <div className={s.tallerCell}>
                <Factory size={14} />
                {a.tallerNombre}
              </div>
            ) : <span className={s.sinAsignar}>Sin asignar</span>
          )},
          { key: 'tipo', header: 'Tipo', width: '150px', render: (a) => (
            <div className={s.tipoCell}>
              {getTipoIcon(a.tipo)}
              <span>{a.tipo}</span>
            </div>
          )},
          { key: 'descripcion', header: 'Descripción', width: '180px', render: (a) => (
            <div className={s.descripcionCell} title={a.descripcion}>{a.descripcion}</div>
          )},
          { key: 'prioridad', header: 'Prioridad', width: '100px', render: (a) => (
            <Badge variant={a.prioridad === 'Alta' ? 'danger' : a.prioridad === 'Media' ? 'warning' : 'success'}>{a.prioridad}</Badge>
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
                  <span className={s.detailLabel}>Orden</span>
                  <span className={s.detailValue}>{selectedAlerta.numeroOrden}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Prenda</span>
                  <span className={s.detailValue}>{selectedAlerta.prenda}</span>
                </div>
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
