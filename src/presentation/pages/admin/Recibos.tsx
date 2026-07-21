import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Download, FileText, Printer, Clock, CheckCircle, AlertTriangle, Plus, Edit, Send, DollarSign, ChevronDown, Calendar, Save, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Recibos.module.css';
import f from '@/styles/Form.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { Modal } from '@/shared/ui/Modal';
import { receiptsApi, type Receipt } from '@/infrastructure/api/receiptsApi';

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

interface ItemForm {
  id: string;
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
}

function toRecibo(dto: Receipt): Recibo {
  const total = Number(dto.total) || 0;
  return {
    id: dto.id,
    numeroRecibo: dto.numero,
    cliente: 'Cliente',
    nitCliente: dto.customerId,
    fechaEmision: (dto.createdAt ?? new Date().toISOString()).slice(0, 10),
    fechaVencimiento: (dto.createdAt ?? new Date().toISOString()).slice(0, 10),
    subtotal: total,
    iva: Math.round(total * 0.19),
    total,
    estado: 'Borrador',
    vendedor: 'Sin asignar',
    items: dto.pagos && dto.pagos.length > 0
      ? dto.pagos.map((p, i) => ({ id: p.id ?? `I${i + 1}`, descripcion: p.method, cantidad: 1, precioUnitario: Number(p.amount) || 0, total: Number(p.amount) || 0 }))
      : [{ id: 'I1', descripcion: 'Recibo', cantidad: 1, precioUnitario: total, total }],
  };
}

const metodosPago: NonNullable<Recibo['metodoPago']>[] = ['Efectivo', 'Transferencia', 'Tarjeta', 'Credito'];

export const AdminRecibos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Borrador' | 'Enviado' | 'Pagado' | 'Vencido' | 'Cancelado'>('Todos');
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await receiptsApi.list();
        if (!active) return;
        setRecibos(data.map(toRecibo));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los recibos');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const [cliente, setCliente] = useState('');
  const [nitCliente, setNitCliente] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().slice(0, 10));
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [metodoPago, setMetodoPago] = useState<'' | NonNullable<Recibo['metodoPago']>>('');
  const [items, setItems] = useState<ItemForm[]>([
    { id: 'I1', descripcion: '', cantidad: '', precioUnitario: '' },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const hoy = new Date().toISOString().slice(0, 10);

  const filteredRecibos = useMemo(() => {
    return recibos.filter(r =>
      (filtroEstado === 'Todos' || r.estado === filtroEstado) &&
      (r.numeroRecibo.toLowerCase().includes(search.toLowerCase()) ||
       r.cliente.toLowerCase().includes(search.toLowerCase()) ||
       r.nitCliente.toLowerCase().includes(search.toLowerCase()) ||
       r.vendedor.toLowerCase().includes(search.toLowerCase()))
    );
  }, [recibos, search, filtroEstado]);

  const subtotal = items.reduce((sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0), 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const resetForm = () => {
    setCliente('');
    setNitCliente('');
    setVendedor('');
    setFechaEmision(hoy);
    setFechaVencimiento('');
    setMetodoPago('');
    setItems([{ id: 'I1', descripcion: '', cantidad: '', precioUnitario: '' }]);
    setFormError(null);
  };

  const openModal = (recibo?: Recibo) => {
    if (recibo) {
      setCliente(recibo.cliente);
      setNitCliente(recibo.nitCliente);
      setVendedor(recibo.vendedor);
      setFechaEmision(recibo.fechaEmision);
      setFechaVencimiento(recibo.fechaVencimiento);
      setMetodoPago(recibo.metodoPago || '');
      setItems(recibo.items.map(it => ({ id: it.id, descripcion: it.descripcion, cantidad: String(it.cantidad), precioUnitario: String(it.precioUnitario) })));
      setEditingId(recibo.id);
    } else {
      resetForm();
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setFormError(null);
    setEditingId(null);
  };

  const updateItem = (id: string, field: keyof ItemForm, value: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: `I${prev.length + 1}-${Date.now()}`, descripcion: '', cantidad: '', precioUnitario: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!cliente.trim()) { setFormError('El cliente es obligatorio'); return; }
    if (!nitCliente.trim()) { setFormError('El NIT del cliente es obligatorio'); return; }
    const itemsValidos = items.filter(it => it.descripcion.trim() && Number(it.cantidad) > 0 && Number(it.precioUnitario) > 0);
    if (itemsValidos.length === 0) { setFormError('Debes agregar al menos un artículo válido'); return; }
    setSaving(true);
    const itemsRecibo: ItemRecibo[] = itemsValidos.map((it, idx) => {
      const cantidad = Number(it.cantidad);
      const precioUnitario = Number(it.precioUnitario);
      return {
        id: it.id || `I${idx + 1}`,
        descripcion: it.descripcion.trim(),
        cantidad,
        precioUnitario,
        total: cantidad * precioUnitario,
      };
    });
    if (editingId) {
      setRecibos(prev => prev.map(r => r.id === editingId ? {
        ...r,
        cliente: cliente.trim(),
        nitCliente: nitCliente.trim(),
        vendedor: vendedor.trim() || 'Sin asignar',
        fechaEmision,
        fechaVencimiento: fechaVencimiento || fechaEmision,
        items: itemsRecibo,
        metodoPago: metodoPago || undefined,
      } : r));
      toast.success('Recibo actualizado correctamente');
    } else {
      const secuencia = String(recibos.length + 1).padStart(3, '0');
      const nuevo: Recibo = {
        id: `REC-${secuencia}`,
        numeroRecibo: `R${secuencia}-${new Date().getFullYear()}`,
        cliente: cliente.trim(),
        nitCliente: nitCliente.trim(),
        fechaEmision,
        fechaVencimiento: fechaVencimiento || fechaEmision,
        subtotal,
        iva,
        total,
        estado: 'Borrador',
        metodoPago: metodoPago || undefined,
        vendedor: vendedor.trim() || 'Sin asignar',
        items: itemsRecibo,
      };
      setRecibos(prev => [nuevo, ...prev]);
      toast.success(`Recibo ${nuevo.numeroRecibo} creado`);
    }
    closeModal();
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
    totalRecibos: recibos.filter(r => r.estado !== 'Cancelado').reduce((sum, r) => sum + r.total, 0),
    pendientes: recibos.filter(r => r.estado === 'Enviado').length,
    pagados: recibos.filter(r => r.estado === 'Pagado').length,
    vencidos: recibos.filter(r => r.estado === 'Vencido').length,
    pendientesMonto: recibos.filter(r => r.estado === 'Enviado' || r.estado === 'Vencido').reduce((sum, r) => sum + r.total, 0),
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
          <Button leftIcon={<Plus size={16} />} onClick={() => openModal()}>
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

      <div className={s.tableWrapper}>
        {loading && (
          <div className={s.stateBox}>
            <Loader2 size={28} className={s.spin} />
            <p>Cargando recibos...</p>
          </div>
        )}
        {error && (
          <div className={s.errorBox}>
            <AlertCircle size={28} />
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
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
            ...(r.estado === 'Borrador' || r.estado === 'Enviado' ? [{ label: 'Editar', icon: <Edit size={14} />, onClick: () => openModal(r) }] : []),
            ...(r.estado === 'Borrador' ? [{ label: 'Enviar', icon: <Send size={14} />, onClick: () => { setRecibos(prev => prev.map(rc => rc.id === r.id ? { ...rc, estado: 'Enviado' } : rc)); toast.success(`Recibo ${r.numeroRecibo} enviado`); } }] : []),
            ...(r.estado === 'Enviado' ? [{ label: 'Marcar pagado', icon: <CheckCircle size={14} />, onClick: () => { setRecibos(prev => prev.map(rc => rc.id === r.id ? { ...rc, estado: 'Pagado' } : rc)); toast.success(`Recibo ${r.numeroRecibo} marcado como pagado`); } }] : []),
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
                    <Button variant="secondary" leftIcon={<Printer size={16} />} onClick={() => { window.print(); toast.info(`Imprimiendo ${r.numeroRecibo}`); }}>Imprimir</Button>
                 </div>
              </div>
            ),
          }}
        />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Crear Nuevo Recibo"
        description="Registra un recibo con sus artículos y totals"
        size="xl"
        variant="form"
      >
        <form onSubmit={handleSubmit} className={f.form}>
          {formError && <div className={f.formError}>{formError}</div>}

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Cliente *</label>
              <input className={f.input} value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ej: Tienda La Esquina" />
            </div>
            <div className={f.field}>
              <label className={f.label}>NIT *</label>
              <input className={f.input} value={nitCliente} onChange={e => setNitCliente(e.target.value)} placeholder="Ej: 900123456-1" />
            </div>
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Vendedor</label>
              <input className={f.input} value={vendedor} onChange={e => setVendedor(e.target.value)} placeholder="Ej: Juan Pérez" />
            </div>
            <div className={f.field}>
              <label className={f.label}>Método de pago</label>
              <select className={f.select} value={metodoPago} onChange={e => setMetodoPago(e.target.value as NonNullable<Recibo['metodoPago']>)}>
                <option value="">Sin especificar</option>
                {metodosPago.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Fecha de emisión *</label>
              <input className={f.input} type="date" value={fechaEmision} onChange={e => setFechaEmision(e.target.value)} />
            </div>
            <div className={f.field}>
              <label className={f.label}>Fecha de vencimiento</label>
              <input className={f.input} type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} />
            </div>
          </div>

          <div className={f.field}>
            <label className={f.label}>Artículos del recibo</label>
            <table className={f.itemsTable}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th className={f.centerCol}>Cant.</th>
                  <th className={f.rightCol}>Precio unit.</th>
                  <th className={f.rightCol}>Total</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => {
                  const tot = (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0);
                  return (
                    <tr key={it.id}>
                      <td><input className={f.input} value={it.descripcion} onChange={e => updateItem(it.id, 'descripcion', e.target.value)} placeholder="Descripción del artículo" /></td>
                      <td className={f.centerCol}><input className={f.input} type="number" min="1" value={it.cantidad} onChange={e => updateItem(it.id, 'cantidad', e.target.value)} /></td>
                      <td className={f.rightCol}><input className={f.input} type="number" min="0" value={it.precioUnitario} onChange={e => updateItem(it.id, 'precioUnitario', e.target.value)} /></td>
                      <td className={f.rightCol} style={{ fontWeight: 600 }}>{formatCurrency(tot)}</td>
                      <td>
                        <button type="button" className={f.removeRowBtn} onClick={() => removeItem(it.id)} aria-label="Eliminar artículo" disabled={items.length === 1}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button type="button" className={f.addRowBtn} onClick={addItem}>
              <Plus size={14} /> Agregar artículo
            </button>
          </div>

          <div className={f.totalsBox}>
            <div className={f.totalRow}><span>Subtotal:</span><span>{formatCurrency(subtotal)}</span></div>
            <div className={f.totalRow}><span>IVA (19%):</span><span>{formatCurrency(iva)}</span></div>
            <div className={`${f.totalRow} ${f.totalRowFinal}`}><span>Total:</span><span>{formatCurrency(total)}</span></div>
          </div>

          <div className={f.formActions}>
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} leftIcon={<Save size={16} />}>
              Crear recibo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};



