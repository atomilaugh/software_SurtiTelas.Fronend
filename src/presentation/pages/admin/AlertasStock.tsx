import React, { useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash2, AlertTriangle, Package, Calendar, Bell, CheckCircle, BarChart3, FileText } from 'lucide-react';
import s from './AlertasStock.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';

const mockAlertas = [
  { id: 'AL-001', insumo: 'Poliéster', codigo: 'INS-002', stockActual: 80, stockMinimo: 100, diferencia: -20, fechaAlerta: '2024-06-09', estado: 'Pendiente', categoria: 'Fibra', responsable: 'Juan Pérez', observaciones: 'Stock bajo. Solicitar reposición urgente.' },
  { id: 'AL-002', insumo: 'Hilo polyester', codigo: 'INS-004', stockActual: 25, stockMinimo: 30, diferencia: -5, fechaAlerta: '2024-06-10', estado: 'Critico', categoria: 'Hilos', responsable: 'María López', observaciones: 'Stock crítico. Requiere atención inmediata.' },
  { id: 'AL-003', insumo: 'Botones de náilon', codigo: 'INS-003', stockActual: 500, stockMinimo: 200, diferencia: 300, fechaAlerta: '2024-06-05', estado: 'Resuelta', categoria: 'Accesorios', responsable: 'Carlos Ruiz', observaciones: 'Alerta resuelta. Reposición completada.' },
  { id: 'AL-004', insumo: 'Algodón Pima', codigo: 'INS-001', stockActual: 150, stockMinimo: 50, diferencia: 100, fechaAlerta: '2024-06-08', estado: 'Resuelta', categoria: 'Fibra', responsable: 'Ana Gómez', observaciones: 'Nivel de stock normalizado.' },
];

type AlertaStock = typeof mockAlertas[number];

export const AdminAlertasStock: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'Todos' | 'Pendiente' | 'Resuelta' | 'Critico'>('Todos');
  const [alertas, setAlertas] = useState<AlertaStock[]>(mockAlertas);

  const filteredAlertas = alertas.filter(a =>
    (filtro === 'Todos' || a.estado === filtro) &&
    (a.insumo.toLowerCase().includes(search.toLowerCase()) ||
     a.codigo.toLowerCase().includes(search.toLowerCase()))
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Resuelta': return 'success';
      case 'Critico': return 'danger';
      default: return 'warning';
    }
  };

  const columns: DataTableColumn<AlertaStock>[] = [
    { key: 'id', header: 'ID', width: '80px', sortable: true, render: (a) => <span className={s.tdMono}>{a.id}</span> },
    { key: 'insumo', header: 'Insumo', sortable: true, render: (a) => (
      <div className={s.insumoCell}>
        <Package size={14} />
        <span className={s.tdPrimary}>{a.insumo}</span>
      </div>
    )},
    { key: 'stockActual', header: 'Stock Actual', width: '110px', sortable: true, align: 'center', render: (a) => (
      <span className={a.stockActual < a.stockMinimo ? s.diferenciaNegativa : ''}>{a.stockActual}</span>
    )},
    { key: 'stockMinimo', header: 'Stock Mínimo', width: '110px', sortable: true, align: 'center', render: (a) => a.stockMinimo },
    { key: 'diferencia', header: 'Diferencia', width: '90px', sortable: true, align: 'center', render: (a) => (
      <span className={a.diferencia < 0 ? s.diferenciaNegativa : s.diferenciaPositiva}>{a.diferencia}</span>
    )},
    { key: 'fechaAlerta', header: 'Fecha', width: '110px', sortable: true, render: (a) => (
      <div className={s.fechaCell}>
        <Calendar size={14} />
        {a.fechaAlerta}
      </div>
    )},
    { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
      { value: 'Pendiente', label: 'Pendiente' },
      { value: 'Resuelta', label: 'Resuelta' },
      { value: 'Critico', label: 'Crítico' },
    ], render: (a) => (
      <Badge variant={getEstadoBadge(a.estado)}>{a.estado}</Badge>
    )},
  ];

  const detailPanel: DataTableDetailPanel<AlertaStock> = {
    title: (item) => `Alerta ${item.id}`,
    size: 'xl',
    header: (item) => ({
      icon: <Bell size={18} />,
      title: 'Alerta de stock',
      code: item.id,
      subtitle: `${item.insumo} · ${item.codigo}`,
      meta: `${item.fechaAlerta} · ${item.responsable}`,
      status: <Badge variant={getEstadoBadge(item.estado)} dot>{item.estado}</Badge>,
    }),
    kpis: (item) => [
      { label: 'Stock actual', value: item.stockActual, icon: <Package size={16} />, tone: item.stockActual < item.stockMinimo ? 'warning' : 'success' },
      { label: 'Stock mínimo', value: item.stockMinimo, icon: <AlertTriangle size={16} />, tone: 'default' },
      { label: 'Diferencia', value: item.diferencia, helper: item.diferencia < 0 ? 'Requiere reposición' : 'Cobertura suficiente', icon: <BarChart3 size={16} />, tone: item.diferencia < 0 ? 'danger' : 'success' },
    ],
    observations: (item) => ({ title: 'Observaciones', icon: <FileText size={16} />, tone: item.estado === 'Resuelta' ? 'success' : item.estado === 'Critico' ? 'danger' : 'warning', children: item.observaciones }),
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailSection}>
          <h4 className={s.detailSectionTitle}>Información del insumo</h4>
          <div className={s.detailGrid}>
            <div className={s.detailItem}><span className={s.detailLabel}>Código</span><span>{item.codigo}</span></div>
            <div className={s.detailItem}><span className={s.detailLabel}>Categoría</span><span>{item.categoria}</span></div>
            <div className={s.detailItem}><span className={s.detailLabel}>Stock actual</span><span>{item.stockActual}</span></div>
            <div className={s.detailItem}><span className={s.detailLabel}>Stock mínimo</span><span>{item.stockMinimo}</span></div>
            <div className={s.detailItem}><span className={s.detailLabel}>Diferencia</span><span className={item.diferencia < 0 ? s.diferenciaNegativa : s.diferenciaPositiva}>{item.diferencia}</span></div>
            <div className={s.detailItem}><span className={s.detailLabel}>Fecha alerta</span><span>{item.fechaAlerta}</span></div>
            {item.responsable && <div className={s.detailItem}><span className={s.detailLabel}>Responsable</span><span>{item.responsable}</span></div>}
          </div>
        </div>
        {item.observaciones && (
          <div className={s.detailSection}>
            <h4 className={s.detailSectionTitle}>Observaciones</h4>
            <div className={s.detailItemFull}><span>{item.observaciones}</span></div>
          </div>
        )}
        <div className={s.modalActions}>
          <Button variant="secondary">Cerrar</Button>
        </div>
      </div>
    ),
  };

  const actions: DataTableAction<AlertaStock>[] = [
    { label: 'Resolver', icon: <CheckCircle size={14} />, onClick: (a) => { setAlertas(prev => prev.filter(al => al.id !== a.id)); toast.success('Alerta resuelta'); }, disabled: (a) => a.estado === 'Resuelta' },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: (a) => { if (confirm('¿Eliminar alerta?')) { setAlertas(prev => prev.filter(al => al.id !== a.id)); toast.success('Alerta eliminada'); } } },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Alertas de Stock</h1>
          <p className={s.pageSubtitle}>Notificaciones de inventario bajo</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <AlertTriangle size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{alertas.filter(a => a.estado === 'Pendiente').length}</div>
              <div className={s.statLabel}>Pendientes</div>
            </div>
          </div>
          <div className={s.statCard}>
            <Bell size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{alertas.filter(a => a.estado === 'Critico').length}</div>
              <div className={s.statLabel}>Críticos</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Pendiente', 'Resuelta', 'Critico'].map(f => (
            <button
              key={f}
              className={`${s.filterBtn} ${filtro === f ? s.filterBtnActive : ''}`}
              onClick={() => setFiltro(f as typeof filtro)}
            >
              {f}
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

      <div className={s.tableWrapper}>
        <DataTable<AlertaStock>
          data={filteredAlertas}
          pageSize={10}
          emptyMessage="No se encontraron alertas"
          maxVisibleColumns={5}
          detailPanel={detailPanel}
          actions={actions}
          columns={columns}
          enableColumnFilters={false}
          enableExport={false}
          enableRowSelection={false}
          enableSorting={true}
          toolbarLeft={null}
        />
      </div>
    </div>
  );
};
