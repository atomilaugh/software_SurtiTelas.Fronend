import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Download, FileText, Printer, Clock, CheckCircle, AlertTriangle, Plus, Edit, Send, DollarSign, ChevronDown, Calendar, Eye, X } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Recibos.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface Recibo {
  id: string;
  numeroRecibo: string;
  cliente: string;
  nitCliente: string;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: 'Borrador' | 'Enviado' | 'Pagado' | 'Vencido' | 'Cancelado';
  metodoPago?: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Credito';
  vendedor: string;
  items: ItemRecibo[];
}

interface ItemRecibo {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

const mockRecibos: Recibo[] = [
  {
    id: 'REC-001',
    numeroRecibo: 'R001-2024',
    cliente: 'Tienda La Esquina',
    nitCliente: '900123456-1',
    fechaEmision: '2024-06-01',
    fechaVencimiento: '2024-06-15',
    subtotal: 4500000,
    iva: 855000,
    total: 5355000,
    estado: 'Pagado',
    metodoPago: 'Transferencia',
    vendedor: 'Juan Pérez',
    items: [
      { id: 'I1', descripcion: 'Camisa manga larga x100', cantidad: 100, precioUnitario: 25000, total: 2500000 },
      { id: 'I2', descripcion: 'Pantalón jean x80', cantidad: 80, precioUnitario: 25000, total: 2000000 },
    ],
  },
  {
    id: 'REC-002',
    numeroRecibo: 'R002-2024',
    cliente: 'Distribuidora del Norte',
    nitCliente: '800234567-2',
    fechaEmision: '2024-06-05',
    fechaVencimiento: '2024-06-20',
    subtotal: 6200000,
    iva: 1178000,
    total: 7378000,
    estado: 'Enviado',
    metodoPago: 'Credito',
    vendedor: 'María Gómez',
    items: [
      { id: 'I1', descripcion: 'Blusa estampada x200', cantidad: 200, precioUnitario: 18000, total: 3600000 },
      { id: 'I2', descripcion: 'Vestido casual x130', cantidad: 130, precioUnitario: 20000, total: 2600000 },
    ],
  },
  {
    id: 'REC-003',
    numeroRecibo: 'R003-2024',
    cliente: 'Almacén Central',
    nitCliente: '701345678-3',
    fechaEmision: '2024-05-20',
    fechaVencimiento: '2024-06-05',
    subtotal: 1800000,
    iva: 342000,
    total: 2142000,
    estado: 'Vencido',
    vendedor: 'Carlos Ruiz',
    items: [
      { id: 'I1', descripcion: 'Camiseta básica x360', cantidad: 360, precioUnitario: 5000, total: 1800000 },
    ],
  },
  {
    id: 'REC-004',
    numeroRecibo: 'R004-2024',
    cliente: 'Moda Express',
    nitCliente: '902456789-4',
    fechaEmision: '2024-06-08',
    fechaVencimiento: '2024-06-22',
    subtotal: 8900000,
    iva: 1691000,
    total: 10591000,
    estado: 'Enviado',
    metodoPago: 'Credito',
    vendedor: 'Ana López',
    items: [
      { id: 'I1', descripcion: 'Conjunto deportivo x300', cantidad: 300, precioUnitario: 22000, total: 6600000 },
      { id: 'I2', descripcion: 'Short deportivo x230', cantidad: 230, precioUnitario: 10000, total: 2300000 },
    ],
  },
  {
    id: 'REC-005',
    numeroRecibo: 'R005-2024',
    cliente: 'Boutique Elegante',
    nitCliente: '803567890-5',
    fechaEmision: '2024-06-10',
    fechaVencimiento: '2024-06-25',
    subtotal: 3200000,
    iva: 608000,
    total: 3808000,
    estado: 'Borrador',
    vendedor: 'Juan Pérez',
    items: [
      { id: 'I1', descripcion: 'Vestido gala x50', cantidad: 50, precioUnitario: 64000, total: 3200000 },
    ],
  },
  {
    id: 'REC-006',
    numeroRecibo: 'R006-2024',
    cliente: 'Ropa Deportiva Pro',
    nitCliente: '904678901-6',
    fechaEmision: '2024-05-28',
    fechaVencimiento: '2024-06-10',
    subtotal: 5500000,
    iva: 1045000,
    total: 6545000,
    estado: 'Cancelado',
    metodoPago: 'Efectivo',
    vendedor: 'María Gómez',
    items: [
      { id: 'I1', descripcion: 'Chaqueta impermeable x110', cantidad: 110, precioUnitario: 50000, total: 5500000 },
    ],
  },
];

export const AdminRecibos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Borrador' | 'Enviado' | 'Pagado' | 'Vencido' | 'Cancelado'>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState<Recibo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecibos = useMemo(() => {
    return mockRecibos.filter(r =>
      (filtroEstado === 'Todos' || r.estado === filtroEstado) &&
      (r.numeroRecibo.toLowerCase().includes(search.toLowerCase()) ||
       r.cliente.toLowerCase().includes(search.toLowerCase()) ||
       r.nitCliente.toLowerCase().includes(search.toLowerCase()) ||
       r.vendedor.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, filtroEstado]);

  const handleVerDetalle = (recibo: Recibo) => {
    setSelectedRecibo(recibo);
    setModalOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Borrador': return 'default';
      case 'Enviado': return 'primary';
      case 'Pagado': return 'success';
      case 'Vencido': return 'warning';
      case 'Cancelado': return 'danger';
      default: return 'default';
    }
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  const stats = {
    totalRecibos: mockRecibos.filter(r => r.estado !== 'Cancelado').reduce((sum, r) => sum + r.total, 0),
    pendientes: mockRecibos.filter(r => r.estado === 'Enviado').length,
    pagados: mockRecibos.filter(r => r.estado === 'Pagado').length,
    vencidos: mockRecibos.filter(r => r.estado === 'Vencido').length,
    pendientesMonto: mockRecibos.filter(r => r.estado === 'Enviado' || r.estado === 'Vencido').reduce((sum, r) => sum + r.total, 0),
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Recibos</h1>
          <p className={s.pageSubtitle}>Gestión de recibos</p>
        </div>
        <div className={s.headerActions}>
          <Button variant="secondary" leftIcon={<Download size={16} />} onClick={() => toast.success('Exportando recibos...')}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => toast.info('Formulario de nuevo recibo')}>
            Nuevo Recibo
          </Button>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <DollarSign size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.totalRecibos)}</div>
            <div className={s.statLabel}>Total Recibos</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardWarning}`}>
          <Clock size={20} className={s.statIconWarning} />
          <div>
            <div className={s.statValue}>{stats.pendientesMonto > 0 ? formatCurrency(stats.pendientesMonto) : '$0'}</div>
            <div className={s.statLabel}>Por Cobrar</div>
          </div>
        </div>
        <div className={s.statCard}>
          <CheckCircle size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{stats.pagados}</div>
            <div className={s.statLabel}>Pagados</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardDanger}`}>
          <AlertTriangle size={20} className={s.statIconDanger} />
          <div>
            <div className={s.statValue}>{stats.vencidos}</div>
            <div className={s.statLabel}>Vencidos</div>
          </div>
        </div>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar por recibo, cliente o NIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
        <button className={s.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <FileText size={16} />
          Filtros
          <ChevronDown size={14} className={`${s.filterChevron} ${showFilters ? s.filterChevronOpen : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className={s.filtersPanel}>
          <div className={s.filterGroup}>
            {['Todos', 'Borrador', 'Enviado', 'Pagado', 'Vencido', 'Cancelado'].map(estado => (
              <button
                key={estado}
                className={`${s.filterBtn} ${filtroEstado === estado ? s.filterBtnActive : ''}`}
                onClick={() => setFiltroEstado(estado as typeof filtroEstado)}
              >
                {estado}
              </button>
            ))}
          </div>
          <div className={s.viewToggle}>
            <button className={`${s.viewBtn} ${s.viewBtnActive}`} title="Vista tabla">
              <FileText size={16} />
            </button>
            <button className={s.viewBtn} title="Vista tarjetas">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 16, height: 16 }}>
                <div style={{ width: 6, height: 6, background: 'currentColor', borderRadius: 1 }} />
                <div style={{ width: 6, height: 6, background: 'currentColor', borderRadius: 1 }} />
                <div style={{ width: 6, height: 6, background: 'currentColor', borderRadius: 1 }} />
                <div style={{ width: 6, height: 6, background: 'currentColor', borderRadius: 1 }} />
              </div>
            </button>
          </div>
        </div>
      )}

        <DataTable<Recibo>
          data={filteredRecibos}
          pageSize={10}
          emptyMessage="No se encontraron recibos"
          enableSorting
          enableColumnFilters
          enableRowSelection
          enableExport
          exportFileName="recibos"
          maxVisibleColumns={5}
          modalSize="xl"
          columns={[
            { key: 'numeroRecibo', header: 'N° Recibo', width: '130px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar recibo...', render: (r) => <span className={s.tdPrimary}>{r.numeroRecibo}</span> },
            { key: 'cliente', header: 'Cliente', sortable: true, filterable: true, render: (r) => r.cliente },
            { key: 'nitCliente', header: 'NIT', width: '120px', render: (r) => <span className={s.tdMono}>{r.nitCliente}</span> },
            { key: 'fechaEmision', header: 'Fecha', width: '110px', render: (r) => (
              <div className={s.fechaCell}><Calendar size={14} />{r.fechaEmision}</div>
            )},
            { key: 'total', header: 'Total', width: '120px', render: (r) => <span className={`${s.tdRight} ${s.tdTotal}`}>{formatCurrency(r.total)}</span> },
            { key: 'estado', header: 'Estado', width: '160px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
              { value: 'Borrador', label: 'Borrador' },
              { value: 'Enviado', label: 'Enviado' },
              { value: 'Pagado', label: 'Pagado' },
              { value: 'Vencido', label: 'Vencido' },
              { value: 'Cancelado', label: 'Cancelado' },
            ], render: (r) => (
              <Badge variant={getEstadoBadge(r.estado)}>{r.estado}</Badge>
            )},
          ]}
          actions={(r) => [
            ...(r.estado === 'Borrador' || r.estado === 'Enviado' ? [{ label: 'Editar', icon: <Edit size={14} />, onClick: () => toast.info(`Editando ${r.numeroRecibo}`) }] : []),
            ...(r.estado === 'Borrador' ? [{ label: 'Enviar', icon: <Send size={14} />, onClick: () => toast.success(`Recibo ${r.numeroRecibo} enviado`) }] : []),
            ...(r.estado === 'Enviado' ? [{ label: 'Marcar pagado', icon: <CheckCircle size={14} />, onClick: () => toast.success(`Recibo ${r.numeroRecibo} marcado como pagado`) }] : []),
          ]}
          detailPanel={{
            title: (r) => `Recibo ${r.numeroRecibo}`,
            render: (r, onClose) => (
              <div className={s.detailModalContent}>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Información de recibo</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Cliente</span><span>{r.cliente}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>NIT</span><span>{r.nitCliente}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Vendedor</span><span>{r.vendedor}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Emisión</span><span>{r.fechaEmision}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Vencimiento</span><span>{r.fechaVencimiento}</span></div>
                    {r.metodoPago && <div className={s.detailItem}><span className={s.detailLabel}>Método</span><span>{r.metodoPago}</span></div>}
                  </div>
                </div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Detalle de artículos</h4>
                  <table className={s.detailItemsTable}>
                    <thead><tr><th>Descripción</th><th style={{ textAlign: 'center' }}>Cant.</th><th style={{ textAlign: 'right' }}>Precio Unit.</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
                    <tbody>{r.items.map(item => (<tr key={item.id}><td>{item.descripcion}</td><td style={{ textAlign: 'center' }}>{item.cantidad}</td><td style={{ textAlign: 'right' }}>{formatCurrency(item.precioUnitario)}</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{formatCurrency(item.total)}</td></tr>))}</tbody>
                  </table>
                </div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Resumen</h4>
                  <div className={s.totalsGrid}>
                    <div className={s.totalRow}><span>Subtotal:</span><span>{formatCurrency(r.subtotal)}</span></div>
                    <div className={s.totalRow}><span>IVA (19%):</span><span>{formatCurrency(r.iva)}</span></div>
                    <div className={`${s.totalRow} ${s.totalRowFinal}`}><span>Total:</span><span>{formatCurrency(r.total)}</span></div>
                  </div>
                </div>
                <div className={s.modalActions}>
                  <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                   <Button variant="secondary" leftIcon={<Printer size={16} />} onClick={() => toast.info(`Imprimiendo ${r.numeroRecibo}`)}>Imprimir</Button>
                </div>
              </div>
            ),
          }}
        />
      </div>
  );
};



