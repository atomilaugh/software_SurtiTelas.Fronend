import React, { useState, useMemo } from 'react';
import { Search, Plus, Factory, Clock, AlertTriangle } from 'lucide-react';
import s from './AsignacionProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface OrdenProduccion {
  id: string;
  numeroOrden: string;
  prenda: string;
  referencia: string;
  cantidad: number;
  fechaPrometida: string;
  estado: 'Pendiente' | 'Asignada' | 'En produccion' | 'Completada';
  tallerAsignado?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  cliente: string;
}

interface Taller {
  id: string;
  nombre: string;
  capacidadDisponible: number;
  especialidad: string;
}

const mockOrdenes: OrdenProduccion[] = [
  { id: 'OP-001', numeroOrden: 'ORD-2024-001', prenda: 'Camisa manga larga', referencia: 'REF-1001', cantidad: 200, fechaPrometida: '2024-06-15', estado: 'Pendiente', prioridad: 'Alta', cliente: 'Cliente A' },
  { id: 'OP-002', numeroOrden: 'ORD-2024-002', prenda: 'Pantalón jean', referencia: 'REF-1002', cantidad: 150, fechaPrometida: '2024-06-18', estado: 'Pendiente', prioridad: 'Media', cliente: 'Cliente B' },
  { id: 'OP-003', numeroOrden: 'ORD-2024-003', prenda: 'Blusa estampada', referencia: 'REF-1003', cantidad: 300, fechaPrometida: '2024-06-14', estado: 'Asignada', tallerAsignado: 'Taller Textil El Progreso', prioridad: 'Alta', cliente: 'Cliente C' },
  { id: 'OP-004', numeroOrden: 'ORD-2024-004', prenda: 'Vestido casual', referencia: 'REF-1004', cantidad: 100, fechaPrometida: '2024-06-20', estado: 'En produccion', tallerAsignado: 'Confección Martínez', prioridad: 'Media', cliente: 'Cliente D' },
  { id: 'OP-005', numeroOrden: 'ORD-2024-005', prenda: 'Short deportivo', referencia: 'REF-1005', cantidad: 250, fechaPrometida: '2024-06-12', estado: 'Pendiente', prioridad: 'Alta', cliente: 'Cliente E' },
  { id: 'OP-006', numeroOrden: 'ORD-2024-006', prenda: 'Camiseta básica', referencia: 'REF-1006', cantidad: 500, fechaPrometida: '2024-06-22', estado: 'Completada', tallerAsignado: 'Taller San José', prioridad: 'Baja', cliente: 'Cliente F' },
];

const mockTalleres: Taller[] = [
  { id: 'T-001', nombre: 'Taller Textil El Progreso', capacidadDisponible: 25, especialidad: 'Camisas y blusas' },
  { id: 'T-002', nombre: 'Confección Martínez', capacidadDisponible: 40, especialidad: 'Pantalones y vestidos' },
  { id: 'T-003', nombre: 'Taller San José', capacidadDisponible: 10, especialidad: 'Prendas deportivas' },
  { id: 'T-004', nombre: 'Artesanías del Valle', capacidadDisponible: 60, especialidad: 'Prendas artesanales' },
];

export const AdminAsignacionProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Asignada' | 'En produccion' | 'Completada'>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [tallerSeleccionado, setTallerSeleccionado] = useState('');

  const filteredOrdenes = useMemo(() => {
    return mockOrdenes.filter(o =>
      (filtroEstado === 'Todos' || o.estado === filtroEstado) &&
      (o.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
       o.prenda.toLowerCase().includes(search.toLowerCase()) ||
       o.referencia.toLowerCase().includes(search.toLowerCase()) ||
       o.cliente.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, filtroEstado]);

  const handleOpenModal = (orden: OrdenProduccion) => {
    setSelectedOrden(orden);
    setTallerSeleccionado('');
    setModalOpen(true);
  };

  const handleAsignarTaller = () => {
    if (selectedOrden && tallerSeleccionado) {
      alert(`Orden ${selectedOrden.numeroOrden} asignada al taller ${tallerSeleccionado}`);
      setModalOpen(false);
      setSelectedOrden(null);
      setTallerSeleccionado('');
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'warning';
      case 'Asignada': return 'default';
      case 'En produccion': return 'primary';
      case 'Completada': return 'success';
      default: return 'default';
    }
  };

  const stats = {
    pendientes: mockOrdenes.filter(o => o.estado === 'Pendiente').length,
    asignadas: mockOrdenes.filter(o => o.estado === 'Asignada').length,
    enProduccion: mockOrdenes.filter(o => o.estado === 'En produccion').length,
    completadas: mockOrdenes.filter(o => o.estado === 'Completada').length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Asignación de Producción</h1>
          <p className={s.pageSubtitle}>Asignar órdenes a talleres</p>
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
          <div className={s.statCard}>
            <AlertTriangle size={20} className={s.statIconWarning} />
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
        exportFileName="asignacion_produccion"
        actions={(o) => [
          ...(o.estado === 'Pendiente' ? [{ label: 'Asignar', icon: <Plus size={14} />, onClick: () => handleOpenModal(o) }] : []),
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
              <span className="text-xs text-[var(--color-text-secondary)]">{o.cantidad} unidades</span>
            </div>
          )},
          { key: 'clienteTaller', header: 'Cliente / Taller', width: '240px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar cliente...', render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{o.cliente}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{o.tallerAsignado || 'Sin asignar'}</span>
            </div>
          )},
          { key: 'entrega', header: 'Entrega', width: '160px', sortable: true, render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{o.fechaPrometida}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">Prioridad {o.prioridad}</span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Asignada', label: 'Asignada' },
            { value: 'En produccion', label: 'En producción' },
            { value: 'Completada', label: 'Completada' },
          ], render: (o) => <Badge variant={getEstadoBadge(o.estado)}>{o.estado}</Badge> },
        ]}
        detailPanel={{
          title: (o) => `${o.estado === 'Pendiente' ? 'Asignar Taller' : 'Cambiar Taller Asignado'} - ${o.numeroOrden}`,
          render: (o, onClose) => (
            <div>
              <div className={s.ordenInfo}>
                <div className={s.infoRow}><span className={s.infoLabel}>Orden:</span><span className={s.infoValue}>{o.numeroOrden}</span></div>
                <div className={s.infoRow}><span className={s.infoLabel}>Prenda:</span><span className={s.infoValue}>{o.prenda}</span></div>
                <div className={s.infoRow}><span className={s.infoLabel}>Cantidad:</span><span className={s.infoValue}>{o.cantidad} unidades</span></div>
                <div className={s.infoRow}><span className={s.infoLabel}>Fecha prometida:</span><span className={s.infoValue}>{o.fechaPrometida}</span></div>
                <div className={s.infoRow}><span className={s.infoLabel}>Cliente:</span><span className={s.infoValue}>{o.cliente}</span></div>
              </div>
              <div className={s.field}>
                <label className={s.label}>Seleccionar Taller</label>
                <div className={s.selectWrapper}>
                  <select className={s.select} value={tallerSeleccionado} onChange={e => setTallerSeleccionado(e.target.value)}>
                    <option value="">-- Seleccione un taller --</option>
                    {mockTalleres.map(t => (<option key={t.id} value={t.nombre}>{t.nombre} (Disponible: {t.capacidadDisponible})</option>))}
                  </select>
                </div>
              </div>
              <div className={s.formActions}>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleAsignarTaller} disabled={!tallerSeleccionado}>Asignar taller</Button>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

