import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Factory, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import s from './AsignacionProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { Modal } from '@/shared/ui/Modal';
import { productionApi } from '@/infrastructure/api/productionApi';
import { workshopsApi } from '@/infrastructure/api/workshopsApi';
import { ESTADOS_PRODUCCION } from '@/shared/constants/options';

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

export const AdminAsignacionProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | (typeof ESTADOS_PRODUCCION)[number]>('Todos');
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);
  const [tallerSeleccionado, setTallerSeleccionado] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orders, workshops] = await Promise.all([
          productionApi.list(),
          workshopsApi.list(),
        ]);
        const mappedOrders: OrdenProduccion[] = orders.map((o) => ({
          id: o.id,
          numeroOrden: o.pedidoNumero || o.referencia,
          prenda: o.pedidoItemNombre || o.referencia,
          referencia: o.referencia,
          cantidad: o.cantidad,
          fechaPrometida: o.fechaEstimada,
          estado: o.estado === 'En proceso' ? 'En produccion' : o.estado === 'Terminado' ? 'Completada' : o.estado === 'Pendiente' ? 'Pendiente' : 'Asignada',
          tallerAsignado: o.taller?.nombre,
          prioridad: (o.pedidoPrioridad === 'ALTA' ? 'Alta' : o.pedidoPrioridad === 'MEDIA' ? 'Media' : o.pedidoPrioridad === 'BAJA' ? 'Baja' : 'Media') as OrdenProduccion['prioridad'],
          cliente: o.pedidoCliente ?? '',
        }));
        const mappedWorkshops: Taller[] = workshops.map((w) => ({
          id: w.id,
          nombre: w.nombre,
          capacidadDisponible: w.capacidad || 0,
          especialidad: w.ciudad || 'General',
        }));
        setOrdenes(mappedOrders);
        setTalleres(mappedWorkshops);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
        toast.error('Error cargando datos de producción');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredOrdenes = useMemo(() => {
    return ordenes.filter(o =>
      (filtroEstado === 'Todos' || o.estado === filtroEstado) &&
      (o.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
       o.prenda.toLowerCase().includes(search.toLowerCase()) ||
       o.referencia.toLowerCase().includes(search.toLowerCase()) ||
       o.cliente.toLowerCase().includes(search.toLowerCase()))
    );
  }, [ordenes, search, filtroEstado]);

  const handleOpenModal = (orden: OrdenProduccion) => {
    setSelectedOrden(orden);
    setTallerSeleccionado(orden.tallerAsignado || '');
    setModalOpen(true);
  };

  const handleAsignarTaller = async () => {
    if (!selectedOrden || !tallerSeleccionado) return;
    try {
      setSaving(true);
      const taller = talleres.find(t => t.nombre === tallerSeleccionado);
      if (!taller) return;
      const updated = await productionApi.assignToWorkshop(selectedOrden.id, taller.id);
      setOrdenes(prev => prev.map(o => o.id === selectedOrden.id
        ? {
            ...o,
            estado: 'Asignada',
            tallerAsignado: updated.taller?.nombre || tallerSeleccionado,
          }
        : o
      ));
      toast.success(`Orden ${selectedOrden.numeroOrden} asignada a ${tallerSeleccionado}`);
      setModalOpen(false);
      setSelectedOrden(null);
      setTallerSeleccionado('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error asignando taller');
    } finally {
      setSaving(false);
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
    pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
    asignadas: ordenes.filter(o => o.estado === 'Asignada').length,
    enProduccion: ordenes.filter(o => o.estado === 'En produccion').length,
    completadas: ordenes.filter(o => o.estado === 'Completada').length,
  };

  if (loading) {
    return <div className={s.header}><p>Cargando órdenes de producción...</p></div>;
  }

  if (error) {
    return <div className={s.header}><p className="text-red-500">{error}</p></div>;
  }

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
          {['Todos', ...ESTADOS_PRODUCCION].map(estado => (
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
        emptyMessage="Sin resultados"
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
              <span className="text-xs text-[var(--color-text-secondary)]">{o.tallerAsignado || '—'}</span>
            </div>
          )},
          { key: 'entrega', header: 'Entrega', width: '160px', sortable: true, render: (o) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{o.fechaPrometida}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">Prioridad {o.prioridad}</span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: ESTADOS_PRODUCCION.map(e => ({ value: e, label: e === 'En produccion' ? 'En producción' : e })), render: (o) => <Badge variant={getEstadoBadge(o.estado)}>{o.estado}</Badge> },
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
                    {talleres.map(t => (<option key={t.id} value={t.nombre}>{t.nombre} (Disponible: {t.capacidadDisponible})</option>))}
                  </select>
                </div>
              </div>
              <div className={s.formActions}>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleAsignarTaller} disabled={!tallerSeleccionado || saving}>{saving ? 'Guardando...' : 'Asignar taller'}</Button>
              </div>
            </div>
          ),
        }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrden ? `Asignar Taller - ${selectedOrden.numeroOrden}` : 'Asignar Taller'}
        size="md"
        variant="form"
      >
        {selectedOrden && (
          <div className={s.detailModalContent}>
            <div className={s.ordenInfo}>
              <div className={s.infoRow}><span className={s.infoLabel}>Prenda:</span><span className={s.infoValue}>{selectedOrden.prenda}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cantidad:</span><span className={s.infoValue}>{selectedOrden.cantidad} unidades</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Fecha prometida:</span><span className={s.infoValue}>{selectedOrden.fechaPrometida}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cliente:</span><span className={s.infoValue}>{selectedOrden.cliente}</span></div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Seleccionar Taller</label>
              <div className={s.selectWrapper}>
                <select className={s.select} value={tallerSeleccionado} onChange={e => setTallerSeleccionado(e.target.value)}>
                  <option value="">-- Seleccione un taller --</option>
                  {talleres.map(t => (<option key={t.id} value={t.nombre}>{t.nombre} (Disponible: {t.capacidadDisponible})</option>))}
                </select>
              </div>
            </div>
            <div className={s.formActions}>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAsignarTaller} disabled={!tallerSeleccionado || saving}>{saving ? 'Guardando...' : 'Asignar taller'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
