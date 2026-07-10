import React, { useState, useMemo } from 'react';
import { Search, Clock, Factory, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import s from './SeguimientoProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { Modal } from '@/shared/ui/Modal';

const getAvanceColor = (producido: number, total: number): string => {
  const pct = (producido / total) * 100;
  if (pct >= 100) return '#22c55e';
  if (pct >= 75) return '#3b82f6';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
};

const _getEstadoBadge = (estado: string): 'default' | 'primary' | 'warning' | 'success' | 'danger' => {
  if (estado === 'Pendiente') return 'default';
  if (estado === 'Asignada') return 'warning';
  if (estado === 'En produccion') return 'primary';
  if (estado === 'Completada') return 'success';
  return 'default';
};

const _getDiasRestantes = (fecha: string): number => {
  const today = new Date();
  const target = new Date(fecha);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

interface OrdenProduccion {
  id: string;
  numeroOrden: string;
  prenda: string;
  referencia: string;
  cantidad: number;
  cantidadProducida: number;
  fechaInicio: string;
  fechaPrometida: string;
  estado: 'Pendiente' | 'Asignada' | 'En produccion' | 'Completada';
  tallerAsignado?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  cliente: string;
  observaciones: string;
  avance: number;
}

const ordenesIniciales: OrdenProduccion[] = [
  { id: 'OP-001', numeroOrden: 'ORD-2024-001', prenda: 'Camisa manga larga', referencia: 'REF-1001', cantidad: 200, cantidadProducida: 180, fechaInicio: '2024-06-01', fechaPrometida: '2024-06-15', estado: 'En produccion', tallerAsignado: 'Taller Textil El Progreso', prioridad: 'Alta', cliente: 'Cliente A', observaciones: 'Avance normal', avance: 90 },
  { id: 'OP-002', numeroOrden: 'ORD-2024-002', prenda: 'Pantalón jean', referencia: 'REF-1002', cantidad: 150, cantidadProducida: 150, fechaInicio: '2024-05-28', fechaPrometida: '2024-06-18', estado: 'Completada', tallerAsignado: 'Confección Martínez', prioridad: 'Media', cliente: 'Cliente B', observaciones: 'Entregado completo', avance: 100 },
  { id: 'OP-003', numeroOrden: 'ORD-2024-003', prenda: 'Blusa estampada', referencia: 'REF-1003', cantidad: 300, cantidadProducida: 75, fechaInicio: '2024-06-05', fechaPrometida: '2024-06-14', estado: 'En produccion', tallerAsignado: 'Taller Textil El Progreso', prioridad: 'Alta', cliente: 'Cliente C', observaciones: '25% completado', avance: 25 },
  { id: 'OP-004', numeroOrden: 'ORD-2024-004', prenda: 'Vestido casual', referencia: 'REF-1004', cantidad: 100, cantidadProducida: 0, fechaInicio: '2024-06-08', fechaPrometida: '2024-06-20', estado: 'Asignada', tallerAsignado: 'Confección Martínez', prioridad: 'Media', cliente: 'Cliente D', observaciones: 'Esperando inicio', avance: 0 },
  { id: 'OP-005', numeroOrden: 'ORD-2024-005', prenda: 'Short deportivo', referencia: 'REF-1005', cantidad: 250, cantidadProducida: 0, fechaInicio: '-', fechaPrometida: '2024-06-12', estado: 'Pendiente', prioridad: 'Alta', cliente: 'Cliente E', observaciones: 'Sin asignar', avance: 0 },
  { id: 'OP-006', numeroOrden: 'ORD-2024-006', prenda: 'Camiseta básica', referencia: 'REF-1006', cantidad: 500, cantidadProducida: 500, fechaInicio: '2024-05-20', fechaPrometida: '2024-06-22', estado: 'Completada', tallerAsignado: 'Taller San José', prioridad: 'Baja', cliente: 'Cliente F', observaciones: 'Entregado a tiempo', avance: 100 },
  { id: 'OP-007', numeroOrden: 'ORD-2024-007', prenda: 'Uniforme empresarial', referencia: 'REF-1007', cantidad: 120, cantidadProducida: 35, fechaInicio: '2024-06-03', fechaPrometida: '2024-06-13', estado: 'En produccion', tallerAsignado: 'Artesanías del Valle', prioridad: 'Alta', cliente: 'Cliente G', observaciones: 'Retraso por insumos', avance: 29 },
  { id: 'OP-008', numeroOrden: 'ORD-2024-008', prenda: 'Chaqueta impermeable', referencia: 'REF-1008', cantidad: 80, cantidadProducida: 0, fechaInicio: '-', fechaPrometida: '2024-06-25', estado: 'Pendiente', prioridad: 'Media', cliente: 'Cliente H', observaciones: 'Por asignar', avance: 0 },
];

export const AdminSeguimientoProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Asignada' | 'En produccion' | 'Completada'>('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<'Todos' | 'Alta' | 'Media' | 'Baja'>('Todos');
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>(ordenesIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [nuevoAvance, setNuevoAvance] = useState('');

  const filteredOrdenes = useMemo(() => {
    return ordenes.filter(o =>
      (filtroEstado === 'Todos' || o.estado === filtroEstado) &&
      (filtroPrioridad === 'Todos' || o.prioridad === filtroPrioridad) &&
      (o.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
       o.prenda.toLowerCase().includes(search.toLowerCase()) ||
       o.referencia.toLowerCase().includes(search.toLowerCase()) ||
       o.cliente.toLowerCase().includes(search.toLowerCase()))
    );
  }, [ordenes, search, filtroEstado, filtroPrioridad]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'default';
      case 'Asignada': return 'primary';
      case 'En produccion': return 'warning';
      case 'Completada': return 'success';
      default: return 'default';
    }
  };

  const getDiasRestantes = (fechaPrometida: string) => {
    const hoy = new Date('2024-06-10');
    const fecha = new Date(fechaPrometida);
    const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const abrirModal = (orden: OrdenProduccion) => {
    setSelectedOrden(orden);
    setNuevoAvance(String(orden.cantidadProducida));
    setModalOpen(true);
  };

  const handleActualizarAvance = () => {
    if (!selectedOrden || !nuevoAvance) return;
    const producidas = Number(nuevoAvance);
    setOrdenes(prev => prev.map(o => {
      if (o.id !== selectedOrden.id) return o;
      if (producidas >= o.cantidad) {
        return { ...o, cantidadProducida: o.cantidad, avance: 100, estado: 'Completada' as const };
      }
      return { ...o, cantidadProducida: producidas, avance: Math.round((producidas / o.cantidad) * 100), estado: 'En produccion' as const };
    }));
    toast.success(`Avance actualizado para ${selectedOrden.numeroOrden}`);
    setModalOpen(false);
    setSelectedOrden(null);
  };

  const handleCompletarOrden = (orden: OrdenProduccion) => {
    setOrdenes(prev => prev.map(o => o.id === orden.id
      ? { ...o, cantidadProducida: o.cantidad, avance: 100, estado: 'Completada' as const }
      : o
    ));
    toast.success(`Orden ${orden.numeroOrden} marcada como entregada`);
  };

  const stats = {
    pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
    asignadas: ordenes.filter(o => o.estado === 'Asignada').length,
    enProduccion: ordenes.filter(o => o.estado === 'En produccion').length,
    completadas: ordenes.filter(o => o.estado === 'Completada').length,
    retrasadas: ordenes.filter(o => {
      if (o.estado === 'Completada' || o.estado === 'Pendiente') return false;
      return getDiasRestantes(o.fechaPrometida) < 0;
    }).length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Seguimiento de Producción</h1>
          <p className={s.pageSubtitle}>Tracking de producción externa</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <Clock size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{stats.pendientes}</div>
              <div className={s.statLabel}>Pendientes</div>
            </div>
          </div>
          <div className={s.statCard}>
            <Factory size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{stats.asignadas}</div>
              <div className={s.statLabel}>Asignadas</div>
            </div>
          </div>
          <div className={`${s.statCard} ${s.statCardWarning}`}>
            <TrendingUp size={20} className={s.statIconWarning} />
            <div>
              <div className={s.statValue}>{stats.enProduccion}</div>
              <div className={s.statLabel}>En Producción</div>
            </div>
          </div>
          <div className={s.statCard}>
            <div className={s.statIconDone}>✓</div>
            <div>
              <div className={s.statValue}>{stats.completadas}</div>
              <div className={s.statLabel}>Completadas</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Pendiente', 'Asignada', 'En produccion', 'Completada'].map(estado => (
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
            placeholder="Buscar por orden, prenda, referencia o cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<OrdenProduccion>
        data={filteredOrdenes}
        pageSize={10}
        emptyMessage="No se encontraron órdenes de producción"
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="seguimiento_produccion"
        actions={(o) => [
          ...(o.estado === 'En produccion' ? [{ label: 'Actualizar avance', icon: <Clock size={14} />, onClick: () => abrirModal(o) }] : []),
          ...(o.estado === 'Asignada' ? [{ label: 'Iniciar producción', icon: <Factory size={14} />, onClick: () => abrirModal(o) }] : []),
        ]}
        columns={[
          { key: 'orden', header: 'Orden', width: '180px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar orden...', render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{o.numeroOrden}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{o.referencia}</span>
            </div>
          )},
          { key: 'producto', header: 'Producto', width: '220px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar producto...', render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{o.prenda}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{o.cantidadProducida}/{o.cantidad} unds</span>
            </div>
          )},
          { key: 'clienteTaller', header: 'Cliente / Taller', width: '240px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar taller...', render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{o.cliente}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{o.tallerAsignado || 'Sin asignar'}</span>
            </div>
          )},
          { key: 'avance', header: 'Avance', width: '180px', sortable: true, render: (o) => {
            const porcentaje = Math.round((o.cantidadProducida / o.cantidad) * 100);
            return (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">{porcentaje}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-elevated)]">
                  <div className="h-full rounded-full" style={{ width: `${porcentaje}%`, background: getAvanceColor(o.cantidadProducida, o.cantidad) }} />
                </div>
              </div>
            );
          }},
          { key: 'estado', header: 'Estado', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Asignada', label: 'Asignada' },
            { value: 'En produccion', label: 'En producción' },
            { value: 'Completada', label: 'Completada' },
          ], render: (o) => <Badge variant={getEstadoBadge(o.estado)}>{o.estado}</Badge> },
        ]}
        detailPanel={{
          title: (o) => `Seguimiento - ${o.numeroOrden}`,
          render: (o, onClose) => (
            <div className={s.ordenInfo}>
              <div className={s.infoRow}><span className={s.infoLabel}>Orden:</span><span className={s.infoValue}>{o.numeroOrden}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Prenda:</span><span className={s.infoValue}>{o.prenda}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Referencia:</span><span className={s.infoValue}>{o.referencia}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cliente:</span><span className={s.infoValue}>{o.cliente}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Taller:</span><span className={s.infoValue}>{o.tallerAsignado || 'Sin asignar'}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Estado:</span><Badge variant={getEstadoBadge(o.estado)}>{o.estado}</Badge></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Fecha inicio:</span><span className={s.infoValue}>{o.fechaInicio}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Fecha límite:</span><span className={`${s.infoValue} ${getDiasRestantes(o.fechaPrometida) < 0 && (o.estado !== 'Completada' && o.estado !== 'Pendiente') ? s.infoValueWarning : ''}`}>{o.fechaPrometida}{getDiasRestantes(o.fechaPrometida) < 0 && (o.estado !== 'Completada' && o.estado !== 'Pendiente') && <span className={s.retrasoBadge}> Retrasado +{Math.abs(getDiasRestantes(o.fechaPrometida))} días</span>}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Observaciones:</span><span className={s.infoValue}>{o.observaciones}</span></div>
              <div className={s.avanceSection}>
                <label className={s.label}>Unidades Producidas</label>
                <div className={s.avanceInputRow}>
                  <input type="number" className={s.avanceInput} value={nuevoAvance} onChange={e => setNuevoAvance(e.target.value)} min={0} max={o.cantidad} />
                  <span className={s.avanceTotal}>/ {o.cantidad} unidades</span>
                </div>
                <div className={s.avancePreview}>
                  <div className={s.avanceBarLarge}>
                    <div className={s.avanceFillLarge} style={{ width: `${Math.min(((Number(nuevoAvance) || 0) / o.cantidad) * 100, 100)}%`, background: getAvanceColor(Number(nuevoAvance) || 0, o.cantidad) }} />
                  </div>
                  <span className={s.avancePorcentaje}>{Math.round(((Number(nuevoAvance) || 0) / o.cantidad) * 100)}%</span>
                </div>
              </div>
              <div className={s.formActions}>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleActualizarAvance}>Actualizar avance</Button>
                {Number(nuevoAvance) >= o.cantidad && <Button variant="success" onClick={() => o && handleCompletarOrden(o)}>Marcar como entregada</Button>}
              </div>
            </div>
          ),
        }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrden ? `Actualizar Avance - ${selectedOrden.numeroOrden}` : 'Actualizar Avance'}
        size="md"
        variant="form"
      >
        {selectedOrden && (
          <div className={s.detailModalContent}>
            <div className={s.ordenInfo}>
              <div className={s.infoRow}><span className={s.infoLabel}>Prenda:</span><span className={s.infoValue}>{selectedOrden.prenda}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cliente:</span><span className={s.infoValue}>{selectedOrden.cliente}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Taller:</span><span className={s.infoValue}>{selectedOrden.tallerAsignado || 'Sin asignar'}</span></div>
            </div>
            <div className={s.avanceSection}>
              <label className={s.label}>Unidades Producidas</label>
              <div className={s.avanceInputRow}>
                <input type="number" className={s.avanceInput} value={nuevoAvance} onChange={e => setNuevoAvance(e.target.value)} min={0} max={selectedOrden.cantidad} />
                <span className={s.avanceTotal}>/ {selectedOrden.cantidad} unidades</span>
              </div>
              <div className={s.avancePreview}>
                <div className={s.avanceBarLarge}>
                  <div className={s.avanceFillLarge} style={{ width: `${Math.min(((Number(nuevoAvance) || 0) / selectedOrden.cantidad) * 100, 100)}%`, background: getAvanceColor(Number(nuevoAvance) || 0, selectedOrden.cantidad) }} />
                </div>
                <span className={s.avancePorcentaje}>{Math.round(((Number(nuevoAvance) || 0) / selectedOrden.cantidad) * 100)}%</span>
              </div>
            </div>
            <div className={s.formActions}>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleActualizarAvance}>Actualizar avance</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


