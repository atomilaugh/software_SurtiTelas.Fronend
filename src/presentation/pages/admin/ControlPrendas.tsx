import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, ClipboardCheck, CheckCircle, XCircle, Layers } from 'lucide-react';
import s from './ControlPrendas.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { controlPrendaApi, type ControlPrenda } from '@/infrastructure/api/controlPrendaApi';
import { ETAPAS_CONTROL, ESTADOS_CONTROL } from '@/shared/constants/options';

type Etapa = ControlPrenda['etapa'];
type Estado = ControlPrenda['estado'];

const ETAPAS = ETAPAS_CONTROL as unknown as Etapa[];
const ESTADOS = ESTADOS_CONTROL as unknown as Estado[];

export const AdminControlPrendas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [registros, setRegistros] = useState<ControlPrenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEtapa, setFiltroEtapa] = useState<'Todos' | Etapa>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | Estado>('Todos');

  const fetchRegistros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await controlPrendaApi.list();
      setRegistros(data);
    } catch {
      setError('No se pudieron cargar los registros de control de prendas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRegistros();
  }, [fetchRegistros]);

  const filteredRegistros = useMemo(() => {
    const q = search.toLowerCase();
    return registros.filter(r =>
      (filtroEtapa === 'Todos' || r.etapa === filtroEtapa) &&
      (filtroEstado === 'Todos' || r.estado === filtroEstado) &&
      (r.id.toLowerCase().includes(q) ||
       (r.produccionNumero ?? '').toLowerCase().includes(q) ||
       (r.produccionCliente ?? '').toLowerCase().includes(q) ||
       r.etapa.toLowerCase().includes(q))
    );
  }, [search, filtroEtapa, filtroEstado, registros]);

  const getEtapaIcon = (etapa: string) => {
    return etapa === 'Control de Calidad' ? <ClipboardCheck size={14} /> : <Layers size={14} />;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Proceso': return 'warning';
      case 'Aprobado': return 'success';
      case 'Rechazado': return 'danger';
      default: return 'default';
    }
  };

  const stats = {
    enProceso: registros.filter(r => r.estado === 'Proceso').length,
    aprobados: registros.filter(r => r.estado === 'Aprobado').length,
    rechazados: registros.filter(r => r.estado === 'Rechazado').length,
    total: registros.length,
  };

  const handleReview = async (r: ControlPrenda, estado: 'Aprobado' | 'Rechazado') => {
    try {
      const actualizado = await controlPrendaApi.review(
        r.id,
        estado,
        estado === 'Aprobado' ? r.cantidadTotal : 0,
        estado === 'Rechazado' ? r.cantidadTotal : 0,
      );
      setRegistros(prev => prev.map(reg => reg.id === r.id ? actualizado : reg));
      toast.success(estado === 'Aprobado' ? 'Control aprobado' : 'Control rechazado');
    } catch {
      toast.error('No fue posible actualizar el control');
    }
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Control de Prendas</h1>
          <p className={s.pageSubtitle}>Control de calidad de producción</p>
        </div>
        <div className={s.metricsRow}>
          <div className={`${s.metricCard} ${s.metricCardWarning}`}>
            <span className={`${s.metricIcon} ${s.metricIconPending}`}>
              <Layers size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.enProceso}</span>
              <span className={s.metricLabel}>En Proceso</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
            <span className={`${s.metricIcon} ${s.metricIconDone}`}>
              <CheckCircle size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.aprobados}</span>
              <span className={s.metricLabel}>Aprobados</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
            <span className={`${s.metricIcon} ${s.metricIconWarning}`}>
              <XCircle size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.rechazados}</span>
              <span className={s.metricLabel}>Rechazados</span>
            </div>
          </div>
          <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
            <span className={`${s.metricIcon} ${s.metricIconReceived}`}>
              <ClipboardCheck size={22} />
            </span>
            <div className={s.metricBody}>
              <span className={s.metricValue}>{stats.total}</span>
              <span className={s.metricLabel}>Total</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={s.errorBox}>
          <span>{error}</span>
          <button className={s.retryBtn} onClick={() => void fetchRegistros()}>Reintentar</button>
        </div>
      )}

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {(['Todos', ...ETAPAS] as const).map(etapa => (
            <button
              key={etapa}
              className={`${s.filterBtn} ${filtroEtapa === etapa ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroEtapa(etapa as typeof filtroEtapa)}
            >
              {etapa !== 'Todos' && getEtapaIcon(etapa)}
              <span className={s.filterBtnText}>{etapa}</span>
            </button>
          ))}
        </div>
        <div className={s.filterGroup}>
          {(['Todos', ...ESTADOS] as const).map(estado => (
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
            placeholder="Buscar por ID, orden, cliente o etapa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<ControlPrenda>
        data={filteredRegistros}
        pageSize={10}
        emptyMessage={loading ? 'Cargando registros...' : error ? error : 'No se encontraron registros de control de prendas'}
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="control_prendas"
        actions={(r) => [
          ...(r.estado === 'Proceso' ? [
            { label: 'Aprobar', icon: <CheckCircle size={14} />, onClick: () => void handleReview(r, 'Aprobado') },
            { label: 'Rechazar', icon: <XCircle size={14} />, onClick: () => void handleReview(r, 'Rechazado') },
          ] : []),
        ]}
        toolbarLeft={
          <div className={s.quickStats}>
            <div className={s.quickStatCard}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconPending}`}>
                <Layers size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.enProceso}</span>
              <span className={s.quickStatLabel}>En proceso</span>
            </div>
            <div className={s.quickStatCard}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconReceived}`}>
                <CheckCircle size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.aprobados}</span>
              <span className={s.quickStatLabel}>Aprobados</span>
            </div>
            <div className={`${s.quickStatCard} ${s.quickStatWarning}`}>
              <span className={`${s.quickStatIcon} ${s.quickStatIconAlert}`}>
                <XCircle size={14} />
              </span>
              <span className={s.quickStatNumber}>{stats.rechazados}</span>
              <span className={s.quickStatLabel}>Rechazados</span>
            </div>
          </div>
        }
        columns={[
          { key: 'orden', header: 'Producción', width: '200px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar orden...', render: (r) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{r.produccionNumero ?? r.produccionId}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{r.produccionCliente ?? '—'}</span>
            </div>
          )},
          { key: 'etapa', header: 'Etapa', width: '200px', sortable: true, filterable: true, filterType: 'select', filterOptions: ETAPAS.map(e => ({ value: e, label: e })), render: (r) => (
            <div className="flex items-center gap-1.5">
              {getEtapaIcon(r.etapa)}
              <span className="text-[var(--color-text-primary)]">{r.etapa}</span>
            </div>
          )},
          { key: 'cantidades', header: 'Cantidades', width: '240px', sortable: false, render: (r) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">Total: {r.cantidadTotal} · Revisadas: {r.cantidadRevisada}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">Aprobadas: {r.cantidadAprobada} · Rechazadas: {r.cantidadRechazada}</span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: ESTADOS.map(e => ({ value: e, label: e })), render: (r) => <Badge variant={getEstadoBadge(r.estado)}>{r.estado}</Badge> },
        ]}
        detailPanel={{
          title: (r) => `Detalle de Control - ${r.id}`,
          render: (r, onClose) => (
            <div className={s.registroInfo}>
              <div className={s.infoRow}><span className={s.infoLabel}>ID:</span><span className={s.infoValue}>{r.id}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Producción:</span><span className={s.infoValue}>{r.produccionNumero ?? r.produccionId}</span></div>
              {r.produccionCliente && <div className={s.infoRow}><span className={s.infoLabel}>Cliente:</span><span className={s.infoValue}>{r.produccionCliente}</span></div>}
              <div className={s.infoRow}><span className={s.infoLabel}>Etapa:</span><Badge variant="primary">{r.etapa}</Badge></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Estado:</span><Badge variant={getEstadoBadge(r.estado)}>{r.estado}</Badge></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Cantidad total:</span><span className={s.infoValue}>{r.cantidadTotal} unidades</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Revisadas:</span><span className={s.infoValue}>{r.cantidadRevisada}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Aprobadas:</span><span className={s.infoValue}>{r.cantidadAprobada}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Rechazadas:</span><span className={s.infoValue}>{r.cantidadRechazada}</span></div>
              {r.revisadoPor && <div className={s.infoRow}><span className={s.infoLabel}>Revisado por:</span><span className={s.infoValue}>{r.revisadoPor.nombre}</span></div>}
              <div className={s.infoRow}><span className={s.infoLabel}>Creado por:</span><span className={s.infoValue}>{r.creadoPor.nombre}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Creado:</span><span className={s.infoValue}>{new Date(r.createdAt).toLocaleString()}</span></div>
              <div className={s.infoRow}><span className={s.infoLabel}>Actualizado:</span><span className={s.infoValue}>{new Date(r.updatedAt).toLocaleString()}</span></div>
              {r.observaciones && <div className={s.infoRowFull}><span className={s.infoLabel}>Observaciones:</span><span className={s.infoValue}>{r.observaciones}</span></div>}
              <div className={s.formActions}>
                {r.estado === 'Proceso' && (
                  <>
                    <Button variant="primary" onClick={() => { void handleReview(r, 'Aprobado'); onClose(); }}>Aprobar</Button>
                    <Button variant="secondary" onClick={() => { void handleReview(r, 'Rechazado'); onClose(); }}>Rechazar</Button>
                  </>
                )}
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};
