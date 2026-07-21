import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Package, CheckCircle2, Clock, XCircle, User, MapPin } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './AdminDomicilios.module.css';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '../../../shared/ui/DataTable';
import { deliveriesApi, aggregateDomiciliarios, type Domiciliario } from '../../../infrastructure/api/deliveriesApi';

interface DomiciliarioUI extends Domiciliario {
  email: string;
  tel: string;
}

export const AdminDomicilios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [domiciliarios, setDomiciliarios] = useState<DomiciliarioUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDomiciliarios() {
      try {
        setLoading(true);
        setError(null);
        const data = await deliveriesApi.list();
        if (!cancelled) {
          const aggregated = aggregateDomiciliarios(data);
          setDomiciliarios(aggregated as DomiciliarioUI[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar domiciliarios');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDomiciliarios();
    return () => { cancelled = true; };
  }, []);

  const filteredDomiciliarios = domiciliarios.filter(d =>
    d.nombre.toLowerCase().includes(search.toLowerCase()) ||
    d.zona.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalEntregas: domiciliarios.reduce((acc, d) => acc + d.entregas, 0),
    completadas: domiciliarios.filter(d => d.estado === 'Activo').length,
    pendientes: domiciliarios.filter(d => d.estado === 'Inactivo').length,
    fallidas: domiciliarios.filter(d => d.entregas === 0).length,
  };

  const columns: DataTableColumn<DomiciliarioUI>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'zona', header: 'Zona', sortable: true },
    { key: 'entregas', header: 'Entregas', sortable: true, align: 'right' },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<DomiciliarioUI> = {
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
      { label: 'Entregas', value: item.entregas, icon: <Package size={16} />, tone: 'primary' as const },
      { label: 'Zona', value: item.zona, icon: <MapPin size={16} />, tone: 'info' as const },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Email:</span> {item.email || '—'}</div>
        <div className={s.detailRow}><span>Teléfono:</span> {item.tel || '—'}</div>
        <div className={s.detailRow}><span>Zona:</span> {item.zona || '—'}</div>
        <div className={s.detailRow}><span>Entregas:</span> {item.entregas}</div>
      </div>
    ),
  };

  const actions: DataTableAction<DomiciliarioUI>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => {
      setDomiciliarios(prev => prev.map(d => d.id === item.id ? { ...d, estado: d.estado === 'Activo' ? 'Inactivo' : 'Activo' } : d));
      toast.info(`Domiciliario "${item.nombre}" ${item.estado === 'Activo' ? 'desactivado' : 'activado'}`);
    } },
  ];

  if (loading) {
    return (
      <div>
        <div className={s.header}>
          <div>
            <h1 className={s.pageTitle}>Domiciliarios</h1>
            <p className={s.pageSubtitle}>Gestión del equipo de entregas</p>
          </div>
        </div>
        <div className={s.statsGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={s.statCard}>
              <div className={s.statIcon} style={{ opacity: 0.3 }}><Package size={20} /></div>
              <div className={s.statValue} style={{ opacity: 0.3 }}>—</div>
              <div className={s.statLabel} style={{ opacity: 0.3 }}>Cargando...</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className={s.header}>
          <div>
            <h1 className={s.pageTitle}>Domiciliarios</h1>
            <p className={s.pageSubtitle}>Gestión del equipo de entregas</p>
          </div>
        </div>
        <div className={s.statCard} style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
          <p>{error}</p>
          <button
            className={s.actionBtn}
            style={{ marginTop: 12 }}
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          <div className={s.statValue}>{stats.totalEntregas}</div>
          <div className={s.statLabel}>Entregas hoy</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><CheckCircle2 size={20} /></div>
          <div className={s.statValue}>{stats.completadas}</div>
          <div className={s.statLabel}>Completadas</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><Clock size={20} /></div>
          <div className={s.statValue}>{stats.pendientes}</div>
          <div className={s.statLabel}>Pendientes</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon}><XCircle size={20} /></div>
          <div className={s.statValue}>{stats.fallidas}</div>
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
