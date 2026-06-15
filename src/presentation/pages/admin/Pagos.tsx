import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, CheckCircle, AlertTriangle, Clock, FileText, CreditCard, Download, DollarSign, ChevronDown, X } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Pagos.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface Factura {
  id: string;
  numeroFactura: string;
  cliente: string;
  total: number;
  abonado: number;
  saldo: number;
  cuotasTotales: number;
  cuotasPagadas: number;
  fechaProximaCuota: string;
  estado: 'Pendiente' | 'Parcial' | 'Pagado' | 'Vencido' | 'En Mora';
  metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Credito';
  fechaCreacion: string;
  vendedor: string;
}

interface Abono {
  id: string;
  facturaId: string;
  numeroFactura: string;
  cliente: string;
  valor: number;
  fecha: string;
  metodoPago: string;
  concepto: string;
  recibidoPor: string;
}

const mockFacturas: Factura[] = [
  { id: 'FAC-001', numeroFactura: 'F001-2024', cliente: 'Tienda La Esquina', total: 5355000, abonado: 5355000, saldo: 0, cuotasTotales: 1, cuotasPagadas: 1, fechaProximaCuota: '-', estado: 'Pagado', metodoPago: 'Transferencia', fechaCreacion: '2024-06-01', vendedor: 'Juan Pérez' },
  { id: 'FAC-002', numeroFactura: 'F002-2024', cliente: 'Distribuidora del Norte', total: 7378000, abonado: 2000000, saldo: 5378000, cuotasTotales: 3, cuotasPagadas: 1, fechaProximaCuota: '2024-07-05', estado: 'Parcial', metodoPago: 'Credito', fechaCreacion: '2024-06-05', vendedor: 'María Gómez' },
  { id: 'FAC-003', numeroFactura: 'F003-2024', cliente: 'Almacén Central', total: 2142000, abonado: 0, saldo: 2142000, cuotasTotales: 2, cuotasPagadas: 0, fechaProximaCuota: '2024-06-20', estado: 'Vencido', metodoPago: 'Transferencia', fechaCreacion: '2024-05-20', vendedor: 'Carlos Ruiz' },
  { id: 'FAC-004', numeroFactura: 'F004-2024', cliente: 'Moda Express', total: 10591000, abonado: 1000000, saldo: 9591000, cuotasTotales: 4, cuotasPagadas: 1, fechaProximaCuota: '2024-07-10', estado: 'Parcial', metodoPago: 'Credito', fechaCreacion: '2024-06-08', vendedor: 'Ana López' },
  { id: 'FAC-005', numeroFactura: 'F005-2024', cliente: 'Boutique Elegante', total: 3808000, abonado: 3808000, saldo: 0, cuotasTotales: 1, cuotasPagadas: 1, fechaProximaCuota: '-', estado: 'Pagado', metodoPago: 'Tarjeta', fechaCreacion: '2024-06-10', vendedor: 'Juan Pérez' },
  { id: 'FAC-006', numeroFactura: 'F006-2024', cliente: 'Ropa Deportiva Pro', total: 6545000, abonado: 3000000, saldo: 3545000, cuotasTotales: 3, cuotasPagadas: 1, fechaProximaCuota: '2024-06-15', estado: 'Parcial', metodoPago: 'Transferencia', fechaCreacion: '2024-05-28', vendedor: 'María Gómez' },
  { id: 'FAC-007', numeroFactura: 'F007-2024', cliente: 'Tienda El Barrio', total: 2890000, abonado: 0, saldo: 2890000, cuotasTotales: 2, cuotasPagadas: 0, fechaProximaCuota: '2024-06-18', estado: 'En Mora', metodoPago: 'Credito', fechaCreacion: '2024-05-15', vendedor: 'Carlos Ruiz' },
  { id: 'FAC-008', numeroFactura: 'F008-2024', cliente: 'Distribuciones Andina', total: 8920000, abonado: 4000000, saldo: 4920000, cuotasTotales: 4, cuotasPagadas: 2, fechaProximaCuota: '2024-07-20', estado: 'Parcial', metodoPago: 'Credito', fechaCreacion: '2024-06-02', vendedor: 'Ana López' },
  { id: 'FAC-009', numeroFactura: 'F009-2024', cliente: 'Modas Chic', total: 1560000, abonado: 1560000, saldo: 0, cuotasTotales: 1, cuotasPagadas: 1, fechaProximaCuota: '-', estado: 'Pagado', metodoPago: 'Efectivo', fechaCreacion: '2024-06-09', vendedor: 'Juan Pérez' },
  { id: 'FAC-010', numeroFactura: 'F010-2024', cliente: 'Ropa Juvenil S.A.', total: 4120000, abonado: 0, saldo: 4120000, cuotasTotales: 2, cuotasPagadas: 0, fechaProximaCuota: '2024-06-25', estado: 'Pendiente', metodoPago: 'Transferencia', fechaCreacion: '2024-06-11', vendedor: 'María Gómez' },
];

const mockAbonos: Abono[] = [
  { id: 'AB-001', facturaId: 'FAC-002', numeroFactura: 'F002-2024', cliente: 'Distribuidora del Norte', valor: 2000000, fecha: '2024-06-05', metodoPago: 'Transferencia', concepto: 'Abono inicial', recibidoPor: 'María Gómez' },
  { id: 'AB-002', facturaId: 'FAC-004', numeroFactura: 'F004-2024', cliente: 'Moda Express', valor: 1000000, fecha: '2024-06-08', metodoPago: 'Tarjeta', concepto: 'Primera cuota', recibidoPor: 'Ana López' },
  { id: 'AB-003', facturaId: 'FAC-006', numeroFactura: 'F006-2024', cliente: 'Ropa Deportiva Pro', valor: 3000000, fecha: '2024-05-28', metodoPago: 'Transferencia', concepto: 'Parcial', recibidoPor: 'María Gómez' },
  { id: 'AB-004', facturaId: 'FAC-008', numeroFactura: 'F008-2024', cliente: 'Distribuciones Andina', valor: 4000000, fecha: '2024-06-02', metodoPago: 'Credito', concepto: 'Abono 50%', recibidoPor: 'Ana López' },
  { id: 'AB-005', facturaId: 'FAC-008', numeroFactura: 'F008-2024', cliente: 'Distribuciones Andina', valor: 2000000, fecha: '2024-06-10', metodoPago: 'Transferencia', concepto: 'Segunda cuota', recibidoPor: 'María Gómez' },
];

export const AdminPagos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Parcial' | 'Pagado' | 'Vencido' | 'En Mora'>('Todos');
  const [filtroMetodo, setFiltroMetodo] = useState<string>('Todos');
  const [modalAbonoOpen, setModalAbonoOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [nuevoAbono, setNuevoAbono] = useState({ valor: '', metodo: 'Transferencia', concepto: '', fecha: '' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredFacturas = useMemo(() => {
    return mockFacturas.filter(f =>
      (filtroEstado === 'Todos' || f.estado === filtroEstado) &&
      (filtroMetodo === 'Todos' || f.metodoPago === filtroMetodo) &&
      (f.numeroFactura.toLowerCase().includes(search.toLowerCase()) ||
       f.cliente.toLowerCase().includes(search.toLowerCase()) ||
       f.vendedor.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, filtroEstado, filtroMetodo]);

  const metodosUnicos = Array.from(new Set(mockFacturas.map(f => f.metodoPago)));

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pagado': return 'success';
      case 'Parcial': return 'primary';
      case 'Pendiente': return 'default';
      case 'Vencido': return 'warning';
      case 'En Mora': return 'danger';
      default: return 'default';
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case 'Efectivo': return <DollarSign size={14} />;
      case 'Transferencia': return <FileText size={14} />;
      case 'Tarjeta': return <CreditCard size={14} />;
      case 'Credito': return <CreditCard size={14} />;
      default: return <DollarSign size={14} />;
    }
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  const stats = {
    totalFacturado: mockFacturas.reduce((sum, f) => sum + f.total, 0),
    totalAbonado: mockFacturas.reduce((sum, f) => sum + f.abonado, 0),
    totalSaldo: mockFacturas.reduce((sum, f) => sum + f.saldo, 0),
    vencidas: mockFacturas.filter(f => f.estado === 'Vencido' || f.estado === 'En Mora').length,
    porVencer: mockFacturas.filter(f => f.estado === 'Parcial' || f.estado === 'Pendiente').length,
  };

  const _handleVerDetalle = (factura: Factura) => {
    setSelectedFactura(factura);
    setModalDetalleOpen(true);
  };

  const handleRegistrarAbono = (factura: Factura) => {
    setSelectedFactura(factura);
    setNuevoAbono({ valor: '', metodo: 'Transferencia', concepto: '', fecha: new Date().toISOString().split('T')[0] });
    setModalAbonoOpen(true);
  };

  const handleGuardarAbono = () => {
    if (!selectedFactura || !nuevoAbono.valor) return;
    const valor = Number(nuevoAbono.valor);
    if (valor <= 0 || valor > selectedFactura.saldo) {
      toast.error(`El valor del abono debe ser mayor a 0 y menor o igual al saldo pendiente (${formatCurrency(selectedFactura.saldo)})`);
      return;
    }
    toast.success(`Abono de ${formatCurrency(valor)} registrado para factura ${selectedFactura.numeroFactura}`);
    setModalAbonoOpen(false);
    setNuevoAbono({ valor: '', metodo: 'Transferencia', concepto: '', fecha: '' });
  };

  const abonosDeFactura = (facturaId: string) => mockAbonos.filter(a => a.facturaId === facturaId);

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Pagos, abonos y financiación</h1>
          <p className={s.pageSubtitle}>Registro y gestión de pagos parciales y planes de financiación</p>
        </div>
        <div className={s.headerActions}>
          <Button variant="secondary" leftIcon={<Download size={16} />} onClick={() => toast.success('Exportando pagos...')}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => toast.info('Formulario de nuevo abono')}>
            Nuevo abono
          </Button>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <DollarSign size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.totalFacturado)}</div>
            <div className={s.statLabel}>Total Facturado</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardSuccess}`}>
          <CheckCircle size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.totalAbonado)}</div>
            <div className={s.statLabel}>Total Abonado</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardWarning}`}>
          <Clock size={20} className={s.statIconWarning} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.totalSaldo)}</div>
            <div className={s.statLabel}>Saldo Pendiente</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardDanger}`}>
          <AlertTriangle size={20} className={s.statIconDanger} />
          <div>
            <div className={s.statValue}>{stats.vencidas}</div>
            <div className={s.statLabel}>En Mora / Vencidas</div>
          </div>
        </div>
        <div className={s.statCard}>
          <FileText size={20} className={s.statIconPrimary} />
          <div>
            <div className={s.statValue}>{stats.porVencer}</div>
            <div className={s.statLabel}>Por Vencer</div>
          </div>
        </div>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar por factura, cliente o vendedor..."
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
            {['Todos', 'Pendiente', 'Parcial', 'Pagado', 'Vencido', 'En Mora'].map(estado => (
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
            {['Todos', ...metodosUnicos].map(metodo => (
              <button
                key={metodo}
                className={`${s.filterBtn} ${filtroMetodo === metodo ? s.filterBtnActive : ''}`}
                onClick={() => setFiltroMetodo(metodo)}
              >
                {metodo !== 'Todos' && getMetodoIcon(metodo)}
                {metodo}
              </button>
            ))}
          </div>
        </div>
      )}

      <DataTable<Factura>
        data={filteredFacturas}
        pageSize={10}
        emptyMessage="No se encontraron facturas con pagos registrados"
        maxVisibleColumns={5}
        modalSize="xl"
        detailPanel={{
          title: (f) => `Factura ${f.numeroFactura}`,
          render: (f) => (
            <div className={s.detailPanel}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Información de la factura</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>Cliente</span><span>{f.cliente}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Vendedor</span><span>{f.vendedor}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Total</span><span className={s.tdBold}>{formatCurrency(f.total)}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Abonado</span><span className={s.abonadoPositive}>{formatCurrency(f.abonado)}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Saldo</span><span className={f.saldo > 0 ? s.saldoNegative : ''}>{formatCurrency(f.saldo)}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Cuotas</span><span>{f.cuotasPagadas}/{f.cuotasTotales}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Información adicional</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>Fecha próxima cuota</span><span>{f.fechaProximaCuota}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Método de pago</span><span>{f.metodoPago}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Fecha creación</span><span>{f.fechaCreacion}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Historial de Abonos</h4>
                {abonosDeFactura(f.id).length === 0 ? (
                  <p className={s.noAbonos}>Sin abonos registrados</p>
                ) : (
                  <div className={s.abonosList}>
                    {abonosDeFactura(f.id).map(abono => (
                      <div key={abono.id} className={s.abonoRow}>
                        <div className={s.abonoInfo}>
                          <div className={s.abonoFecha}>{abono.fecha}</div>
                          <div className={s.abonoConcepto}>{abono.concepto}</div>
                          <div className={s.abonoMetodo}>{abono.metodoPago} · {abono.recibidoPor}</div>
                        </div>
                        <div className={s.abonoValor}>+{formatCurrency(abono.valor)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        }}
        actions={(f) => [
          ...(f.saldo > 0 ? [{ label: 'Registrar abono', icon: <DollarSign size={14} />, onClick: () => handleRegistrarAbono(f) }] : []),
        ]}
        columns={[
          { key: 'numeroFactura', header: 'N° Factura', width: '120px', sortable: true, filterable: true, filterPlaceholder: 'Filtrar factura...', render: (f) => <span className={s.tdPrimary}>{f.numeroFactura}</span> },
          { key: 'cliente', header: 'Cliente', sortable: true, filterable: true, render: (f) => f.cliente },
          { key: 'vendedor', header: 'Vendedor', width: '130px', sortable: true, render: (f) => f.vendedor },
          { key: 'total', header: 'Total', width: '120px', sortable: true, align: 'right', render: (f) => <span className={`${s.tdRight} ${s.tdBold}`}>{formatCurrency(f.total)}</span> },
          { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Parcial', label: 'Parcial' },
            { value: 'Pagado', label: 'Pagado' },
            { value: 'Vencido', label: 'Vencido' },
            { value: 'En Mora', label: 'En Mora' },
          ], render: (f) => (
            <Badge variant={getEstadoBadge(f.estado)}>{f.estado}</Badge>
          )},
        ]}
      />

      {modalDetalleOpen && selectedFactura && (
        <div className={s.modalOverlay} onClick={() => setModalDetalleOpen(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <div className={s.modalHeaderInfo}>
                <h2 className={s.modalTitle}>Factura {selectedFactura.numeroFactura}</h2>
                <Badge variant={getEstadoBadge(selectedFactura.estado)}>{selectedFactura.estado}</Badge>
              </div>
              <button className={s.closeBtn} onClick={() => setModalDetalleOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.facturaResumen}>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Cliente:</span>
                  <span className={s.infoValue}>{selectedFactura.cliente}</span>
                </div>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Vendedor:</span>
                  <span className={s.infoValue}>{selectedFactura.vendedor}</span>
                </div>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Total:</span>
                  <span className={`${s.infoValue} ${s.infoValueTotal}`}>{formatCurrency(selectedFactura.total)}</span>
                </div>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Abonado:</span>
                  <span className={`${s.infoValue} ${s.infoValueAbonado}`}>{formatCurrency(selectedFactura.abonado)}</span>
                </div>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Saldo:</span>
                  <span className={`${s.infoValue} ${s.infoValueSaldo}`}>{formatCurrency(selectedFactura.saldo)}</span>
                </div>
                <div className={s.infoBlock}>
                  <span className={s.infoLabel}>Cuotas:</span>
                  <span className={s.infoValue}>{selectedFactura.cuotasPagadas} / {selectedFactura.cuotasTotales}</span>
                </div>
              </div>

              <div className={s.abonosSection}>
                <h3 className={s.sectionTitle}>Historial de Abonos</h3>
                {abonosDeFactura(selectedFactura.id).length === 0 ? (
                  <p className={s.noAbonos}>Sin abonos registrados</p>
                ) : (
                  <div className={s.abonosList}>
                    {abonosDeFactura(selectedFactura.id).map(abono => (
                      <div key={abono.id} className={s.abonoRow}>
                        <div className={s.abonoInfo}>
                          <div className={s.abonoFecha}>{abono.fecha}</div>
                          <div className={s.abonoConcepto}>{abono.concepto}</div>
                          <div className={s.abonoMetodo}>{abono.metodoPago} · {abono.recibidoPor}</div>
                        </div>
                        <div className={s.abonoValor}>+{formatCurrency(abono.valor)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={s.formActions}>
                <Button variant="secondary" onClick={() => setModalDetalleOpen(false)}>
                  Cerrar
                </Button>
                {selectedFactura.saldo > 0 && (
                  <Button leftIcon={<DollarSign size={16} />} onClick={() => handleRegistrarAbono(selectedFactura)}>
                    Registrar abono
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAbonoOpen && selectedFactura && (
        <div className={s.modalOverlay} onClick={() => setModalAbonoOpen(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Registrar abono - {selectedFactura.numeroFactura}</h2>
              <button className={s.closeBtn} onClick={() => setModalAbonoOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.formGrid}>
                <div className={s.field}>
                  <label className={s.label}>Cliente</label>
                  <input type="text" className={s.input} value={selectedFactura.cliente} readOnly />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Saldo pendiente</label>
                  <input type="text" className={s.input} value={formatCurrency(selectedFactura.saldo)} readOnly />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Valor del abono *</label>
                  <input
                    type="number"
                    className={s.input}
                    value={nuevoAbono.valor}
                    onChange={e => setNuevoAbono({ ...nuevoAbono, valor: e.target.value })}
                    placeholder="Ingrese el valor"
                    min={1}
                    max={selectedFactura.saldo}
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Método de pago</label>
                  <select
                    className={s.input}
                    value={nuevoAbono.metodo}
                    onChange={e => setNuevoAbono({ ...nuevoAbono, metodo: e.target.value })}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Credito">Crédito</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Fecha</label>
                  <input
                    type="date"
                    className={s.input}
                    value={nuevoAbono.fecha}
                    onChange={e => setNuevoAbono({ ...nuevoAbono, fecha: e.target.value })}
                  />
                </div>
                <div className={`${s.field} ${s.fieldFull}`}>
                  <label className={s.label}>Concepto / Observación</label>
                  <input
                    type="text"
                    className={s.input}
                    value={nuevoAbono.concepto}
                    onChange={e => setNuevoAbono({ ...nuevoAbono, concepto: e.target.value })}
                    placeholder="Ej: Abono cuota 2/3"
                  />
                </div>
              </div>

              <div className={s.formActions}>
                <Button variant="secondary" onClick={() => setModalAbonoOpen(false)}>
                  Cancelar
                </Button>
                <Button leftIcon={<DollarSign size={16} />} onClick={handleGuardarAbono}>
                  Guardar abono
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



