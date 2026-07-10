import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Truck, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import s from './ControlPrendas.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface PrendaControl {
  id: string;
  numeroOrden: string;
  prenda: string;
  referencia: string;
  tipo: 'Entrega a taller' | 'Recepcion de taller';
  tallerNombre: string;
  cantidad: number;
  cantidadRecibida?: number;
  fechaSalida: string;
  fechaRetorno?: string;
  estado: 'En camino' | 'En taller' | 'Entregado' | 'Recibido' | 'Con novedad';
  conductor?: string;
  vehiculo?: string;
  observaciones: string;
}

const mockRegistros: PrendaControl[] = [
  { id: 'CP-001', numeroOrden: 'ORD-2024-001', prenda: 'Camisa manga larga', referencia: 'REF-1001', tipo: 'Entrega a taller', tallerNombre: 'Taller Textil El Progreso', cantidad: 200, fechaSalida: '2024-06-08', estado: 'Entregado', conductor: 'Carlos Ruiz', vehiculo: 'ABC-123', observaciones: 'Entregado en perfecto estado' },
  { id: 'CP-002', numeroOrden: 'ORD-2024-003', prenda: 'Blusa estampada', referencia: 'REF-1003', tipo: 'Entrega a taller', tallerNombre: 'Taller Textil El Progreso', cantidad: 300, fechaSalida: '2024-06-09', estado: 'En taller', conductor: 'María López', vehiculo: 'XYZ-789', observaciones: 'En proceso de confección' },
  { id: 'CP-003', numeroOrden: 'ORD-2024-002', prenda: 'Pantalón jean', referencia: 'REF-1002', tipo: 'Recepcion de taller', tallerNombre: 'Confección Martínez', cantidad: 150, cantidadRecibida: 148, fechaSalida: '2024-05-28', fechaRetorno: '2024-06-10', estado: 'Recibido', observaciones: '2 prendas con defecto menor' },
  { id: 'CP-004', numeroOrden: 'ORD-2024-006', prenda: 'Camiseta básica', referencia: 'REF-1006', tipo: 'Recepcion de taller', tallerNombre: 'Taller San José', cantidad: 500, cantidadRecibida: 500, fechaSalida: '2024-05-20', fechaRetorno: '2024-06-09', estado: 'Recibido', observaciones: 'Entrega completa y a tiempo' },
  { id: 'CP-005', numeroOrden: 'ORD-2024-007', prenda: 'Uniforme empresarial', referencia: 'REF-1007', tipo: 'Entrega a taller', tallerNombre: 'Artesanías del Valle', cantidad: 120, fechaSalida: '2024-06-03', estado: 'Con novedad', conductor: 'Juan Pérez', vehiculo: 'DEF-456', observaciones: 'Retraso en entrega por daño en vehículo' },
  { id: 'CP-006', numeroOrden: 'ORD-2024-004', prenda: 'Vestido casual', referencia: 'REF-1004', tipo: 'Recepcion de taller', tallerNombre: 'Confección Martínez', cantidad: 100, fechaSalida: '2024-06-01', estado: 'En taller', observaciones: 'Esperando finalización' },
  { id: 'CP-007', numeroOrden: 'ORD-2024-008', prenda: 'Chaqueta impermeable', referencia: 'REF-1008', tipo: 'Entrega a taller', tallerNombre: 'Taller Rápido', cantidad: 80, fechaSalida: '2024-06-05', estado: 'En camino', conductor: 'Ana Gómez', vehiculo: 'GHI-012', observaciones: 'En tránsito hacia el taller' },
  { id: 'CP-008', numeroOrden: 'ORD-2024-009', prenda: 'Short deportivo', referencia: 'REF-1009', tipo: 'Recepcion de taller', tallerNombre: 'Taller San José', cantidad: 250, cantidadRecibida: 250, fechaSalida: '2024-05-25', fechaRetorno: '2024-06-11', estado: 'Recibido', observaciones: 'Revisión de calidad aprobada' },
];

export const AdminControlPrendas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [registros, setRegistros] = useState<PrendaControl[]>(mockRegistros);
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Entrega a taller' | 'Recepcion de taller'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'En camino' | 'En taller' | 'Entregado' | 'Recibido' | 'Con novedad'>('Todos');

  const filteredRegistros = useMemo(() => {
    return registros.filter(r =>
      (filtroTipo === 'Todos' || r.tipo === filtroTipo) &&
      (filtroEstado === 'Todos' || r.estado === filtroEstado) &&
      (r.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
       r.prenda.toLowerCase().includes(search.toLowerCase()) ||
       r.referencia.toLowerCase().includes(search.toLowerCase()) ||
       r.tallerNombre.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, filtroTipo, filtroEstado, registros]);

  const getTipoIcon = (tipo: string) => {
    return tipo === 'Entrega a taller' ? <Truck size={14} /> : <Package size={14} />;
  };

const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'En camino': return 'info';
      case 'En taller': return 'warning';
      case 'Entregado': return 'success';
      case 'Recibido': return 'purple';
      case 'Con novedad': return 'danger';
      default: return 'default';
    }
  };

  const stats = {
    entregasPendientes:     registros.filter(r => r.tipo === 'Entrega a taller' && (r.estado === 'En camino' || r.estado === 'En taller')).length,
    recepcionesPendientes: registros.filter(r => r.tipo === 'Recepcion de taller' && (r.estado === 'En taller' || r.estado === 'Entregado')).length,
    conNovedad: registros.filter(r => r.estado === 'Con novedad').length,
    completadas: registros.filter(r => r.estado === 'Recibido' || r.estado === 'Entregado').length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Control de Prendas</h1>
          <p className={s.pageSubtitle}>Entregas y recepciones</p>
        </div>
        <div className={s.metricsRow}>
          <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
            <span className={`${s.metricIcon} ${s.metricIconPending}`}>
              <Truck size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.entregasPendientes}</span>
              <span className={s.metricLabel}>Entregas Pendientes</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
            <span className={`${s.metricIcon} ${s.metricIconReceived}`}>
              <Package size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.recepcionesPendientes}</span>
              <span className={s.metricLabel}>Recepciones Pendientes</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardWarning}`}>
            <span className={`${s.metricIcon} ${s.metricIconWarning}`}>
              <AlertTriangle size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.conNovedad}</span>
              <span className={s.metricLabel}>Con Novedad</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
            <span className={`${s.metricIcon} ${s.metricIconDone}`}>
              <CheckCircle size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.completadas}</span>
              <span className={s.metricLabel}>Completadas</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Entrega a taller', 'Recepcion de taller'].map(tipo => (
            <button
              key={tipo}
              className={`${s.filterBtn} ${filtroTipo === tipo ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroTipo(tipo as typeof filtroTipo)}
            >
              {getTipoIcon(tipo)}
              <span className={s.filterBtnText}>{tipo}</span>
            </button>
          ))}
        </div>
        <div className={s.filterGroup}>
          {['Todos', 'En camino', 'En taller', 'Entregado', 'Recibido', 'Con novedad'].map(estado => (
            <button
              key={estado}
              className={`${s.filterBtn} ${filtroEstado === estado ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroEstado(estado as typeof filtroEstado)}
            >
              {estado}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por orden, prenda, referencia o taller..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<PrendaControl>
        data={filteredRegistros}
        pageSize={10}
        emptyMessage="No se encontraron registros de control de prendas"
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="control_prendas"
        actions={(r) => [
          ...(r.tipo === 'Recepcion de taller' && !r.fechaRetorno ? [{ label: 'Recepcionar', icon: <CheckCircle size={14} />, onClick: () => { setRegistros(prev => prev.map(reg => reg.id === r.id ? { ...reg, estado: 'Recibido', cantidadRecibida: reg.cantidad, fechaRetorno: new Date().toISOString().slice(0, 10) } : reg)); toast.success('Prenda recepcionada'); } }] : []),
          ...(r.estado === 'Con novedad' ? [{ label: 'Resolver', icon: <CheckCircle size={14} />, onClick: () => { setRegistros(prev => prev.map(reg => reg.id === r.id ? { ...reg, estado: 'Entregado' } : reg)); toast.success('Novedad resuelta'); } }] : []),
        ]}
        toolbarLeft={
          <div className={s.quickStats}>
            <div className={s.quickStatCard}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconPending}`}>
                <Truck size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.entregasPendientes}</span>
              <span className={s.quickStatLabel}>Pendientes</span>
            </div>
            <div className={s.quickStatCard}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconReceived}`}>
                <Package size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.recepcionesPendientes}</span>
              <span className={s.quickStatLabel}>Recepciones</span>
            </div>
            <div className={`${s.quickStatCard} ${s.quickStatWarning}`}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconAlert}`}>
                <AlertTriangle size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.conNovedad}</span>
              <span className={s.quickStatLabel}>Novedades</span>
            </div>
          </div>
        }
        columns={[
          { key: 'orden', header: 'Orden', width: '180px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar orden...', render: (r) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{r.numeroOrden}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{r.referencia}</span>
            </div>
          )},
          { key: 'prenda', header: 'Prenda / Tipo', width: '220px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar prenda...', render: (r) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{r.prenda}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{r.tipo === 'Entrega a taller' ? 'Entrega' : 'Recepción'} · {r.cantidad} unidades</span>
            </div>
          )},
          { key: 'taller', header: 'Taller / Movimiento', width: '220px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar taller...', render: (r) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{r.tallerNombre}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {r.tipo === 'Entrega a taller' ? 'Hacia taller' : 'Desde taller'}
                {r.fechaRetorno ? ` · ${r.fechaRetorno}` : ''}
              </span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'En camino', label: 'En camino' },
            { value: 'En taller', label: 'En taller' },
            { value: 'Entregado', label: 'Entregado' },
            { value: 'Recibido', label: 'Recibido' },
            { value: 'Con novedad', label: 'Con novedad' },
          ], render: (r) => <Badge variant={getEstadoBadge(r.estado)}>{r.estado}</Badge> },
        ]}
        detailPanel={{
          title: (r) => `${r.tipo === 'Entrega a taller' ? 'Detalle de Entrega' : 'Detalle de Recepción'} - ${r.id}`,
          render: (r, onClose) => (
            <div className={s.registroInfo}>
              <div className={s.infoRow}><span className={s.infoLabel}>N° Orden:</span><span className={s.infoValue}>{r.numeroOrden}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Tipo:</span><Badge variant={r.tipo === 'Entrega a taller' ? 'primary' : 'default'}>{r.tipo}</Badge></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Prenda:</span><span className={s.infoValue}>{r.prenda}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Referencia:</span><span className={s.infoValue}>{r.referencia}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Taller:</span><span className={s.infoValue}>{r.tallerNombre}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cantidad:</span><span className={s.infoValue}>{r.cantidad} unidades{r.cantidadRecibida !== undefined && <span className={s.cantidadRecibidaModal}> ({r.cantidadRecibida} recibidas)</span>}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Fecha salida:</span><span className={s.infoValue}>{r.fechaSalida}</span></div>
              {r.fechaRetorno && <div className={s.infoRow}><span className={s.infoLabel}>Fecha retorno:</span><span className={s.infoValue}>{r.fechaRetorno}</span></div>}
              {r.conductor && <div className={s.infoRow}><span className={s.infoLabel}>Conductor:</span><span className={s.infoValue}>{r.conductor}</span></div>}
              {r.vehiculo && <div className={s.infoRow}><span className={s.infoLabel}>Vehículo:</span><span className={s.infoValue}>{r.vehiculo}</span></div>}
              <div className={s.infoRowFull}><span className={s.infoLabel}>Observaciones:</span><span className={s.infoValue}>{r.observaciones}</span></div>
              <div className={s.formActions}><Button variant="secondary" onClick={onClose}>Cerrar</Button></div>
            </div>
          ),
        }}
      />
    </div>
  );
};

