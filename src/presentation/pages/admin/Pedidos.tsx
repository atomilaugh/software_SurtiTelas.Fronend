import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Pedidos.module.css';
import f from '@/styles/Form.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';

interface ItemPedido {
  id: string;
  descripcion: string;
  cantidad: string;
  precio: string;
}

interface Pedido {
  id: string;
  cliente: string;
  asesor: string;
  fecha: string;
  items: number;
  total: string;
  estado: 'Nuevo' | 'En producción' | 'Listo' | 'Despachado' | 'Entregado' | 'Cancelado';
  observaciones?: string;
}

const pedidosIniciales: Pedido[] = [
  { id: '#PD-2401', cliente: 'Almacén El Sol', asesor: 'Camila Torres', fecha: '08 Jun 2026', items: 24, total: '$2.480.000', estado: 'En producción' },
  { id: '#PD-2400', cliente: 'Boutique Moda+', asesor: 'Luis Herrera', fecha: '07 Jun 2026', items: 8, total: '$980.000', estado: 'Listo' },
  { id: '#PD-2399', cliente: 'Textiles Andina', asesor: 'Camila Torres', fecha: '07 Jun 2026', items: 45, total: '$5.120.000', estado: 'Despachado' },
  { id: '#PD-2398', cliente: 'Moda Casual SAS', asesor: 'Pedro Gómez', fecha: '06 Jun 2026', items: 12, total: '$1.340.000', estado: 'Entregado' },
  { id: '#PD-2397', cliente: 'La Tienda Norte', asesor: 'Luis Herrera', fecha: '05 Jun 2026', items: 6, total: '$720.000', estado: 'Cancelado' },
  { id: '#PD-2396', cliente: 'Confección del Valle', asesor: 'Camila Torres', fecha: '04 Jun 2026', items: 18, total: '$2.150.000', estado: 'Nuevo' },
  { id: '#PD-2395', cliente: 'Telas Premium', asesor: 'Luis Herrera', fecha: '03 Jun 2026', items: 22, total: '$3.200.000', estado: 'En producción' },
  { id: '#PD-2394', cliente: 'Moda Express', asesor: 'Pedro Gómez', fecha: '02 Jun 2026', items: 9, total: '$1.180.000', estado: 'Listo' },
];

const clientes = ['Almacén El Sol', 'Boutique Moda+', 'Textiles Andina', 'Moda Casual SAS', 'La Tienda Norte', 'Confección del Valle', 'Telas Premium', 'Moda Express'];
const asesores = ['Camila Torres', 'Luis Herrera', 'Pedro Gómez'];
const estadosPedido: Pedido['estado'][] = ['Nuevo', 'En producción', 'Listo', 'Despachado', 'Entregado', 'Cancelado'];

const orderStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'default',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

const formatoCOP = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);

export const AdminPedidos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [cliente, setCliente] = useState('');
  const [clienteLibre, setClienteLibre] = useState('');
  const [asesor, setAsesor] = useState(asesores[0]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [estado, setEstado] = useState<Pedido['estado']>('Nuevo');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ItemPedido[]>([
    { id: 'I1', descripcion: '', cantidad: '', precio: '' },
  ]);

  const filteredPedidos = pedidos.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = items.reduce((sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precio) || 0), 0);
  const totalItems = items.reduce((sum, it) => sum + (Number(it.cantidad) || 0), 0);

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedPedido(null);
  };

  const resetForm = () => {
    setCliente(clientes[0]);
    setClienteLibre('');
    setAsesor(asesores[0]);
    setFecha(new Date().toISOString().slice(0, 10));
    setEstado('Nuevo');
    setObservaciones('');
    setItems([{ id: 'I1', descripcion: '', cantidad: '', precio: '' }]);
    setFormError(null);
  };

  const openNew = () => {
    resetForm();
    setSelectedPedido(null);
    setEditModalOpen(true);
  };

  const openEdit = (p: Pedido) => {
    setSelectedPedido(p);
    setCliente(p.cliente);
    setClienteLibre('');
    setAsesor(p.asesor);
    setFecha(p.fecha);
    setEstado(p.estado);
    setObservaciones(p.observaciones || '');
    setItems([{ id: 'I1', descripcion: '', cantidad: String(p.items), precio: '' }]);
    setFormError(null);
    setEditModalOpen(true);
  };

  const updateItem = (id: string, field: keyof ItemPedido, value: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: `I${prev.length + 1}-${Date.now()}`, descripcion: '', cantidad: '', precio: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const clienteFinal = cliente === '__otro__' ? clienteLibre.trim() : cliente.trim();
    if (!clienteFinal) { setFormError('El cliente es obligatorio'); return; }
    const itemsValidos = items.filter(it => it.descripcion.trim() && Number(it.cantidad) > 0);
    if (itemsValidos.length === 0) { setFormError('Debes agregar al menos un producto al pedido'); return; }
    setSaving(true);
    const total = itemsValidos.reduce((sum, it) => sum + (Number(it.cantidad) || 0) * (Number(it.precio) || 0), 0);
    const cantidadItems = itemsValidos.reduce((sum, it) => sum + (Number(it.cantidad) || 0), 0);
    if (selectedPedido) {
      setPedidos(prev => prev.map(p => p.id === selectedPedido.id ? {
        ...p, cliente: clienteFinal, asesor, fecha, estado, observaciones, items: cantidadItems, total: formatoCOP(total),
      } : p));
      toast.success(`Pedido ${selectedPedido.id} actualizado`);
    } else {
      const secuencia = pedidos.length + 2401;
      const nuevo: Pedido = {
        id: `#PD-${secuencia}`,
        cliente: clienteFinal,
        asesor,
        fecha,
        estado,
        observaciones,
        items: cantidadItems,
        total: formatoCOP(total),
      };
      setPedidos(prev => [nuevo, ...prev]);
      toast.success(`Pedido ${nuevo.id} creado`);
    }
    setSaving(false);
    closeModals();
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Pedidos</h1>
          <p className={s.pageSubtitle}>Gestión de pedidos del sistema</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar pedidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Pedido>
        data={filteredPedidos}
        pageSize={10}
        emptyMessage="No se encontraron pedidos"
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="pedidos"
        maxVisibleColumns={5}
        columns={[
          { key: 'id', header: 'ID Pedido', width: '110px', sortable: true, filterable: true, render: (p) => <span className={s.tdMono}>{p.id}</span> },
          { key: 'cliente', header: 'Cliente', sortable: true, filterable: true, render: (p) => <span className={s.tdPrimary}>{p.cliente}</span> },
          { key: 'asesor', header: 'Asesor', render: (p) => p.asesor },
          { key: 'fecha', header: 'Fecha', width: '110px', render: (p) => p.fecha },
          { key: 'total', header: 'Total', width: '120px', render: (p) => p.total },
          { key: 'estado', header: 'Estado', width: '130px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Nuevo', label: 'Nuevo' },
            { value: 'En producción', label: 'En producción' },
            { value: 'Listo', label: 'Listo' },
            { value: 'Despachado', label: 'Despachado' },
            { value: 'Entregado', label: 'Entregado' },
            { value: 'Cancelado', label: 'Cancelado' },
          ], render: (p) => (
            <Badge variant={orderStatuses[p.estado]}>{p.estado}</Badge>
          )},
        ]}
        actions={(p) => [
          { label: 'Editar', onClick: () => openEdit(p) },
        ]}
        detailPanel={{
          title: (p) => `Pedido ${p.id}`,
          render: (p, onClose) => (
            <div className={s.detailModalContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Detalles del pedido</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>ID</span><span>{p.id}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Cliente</span><span>{p.cliente}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Asesor</span><span>{p.asesor}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Items</span><span>{p.items}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Total</span><span>{p.total}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Estado</span><span><Badge variant={orderStatuses[p.estado]}>{p.estado}</Badge></span></div>
                </div>
              </div>
              <div className={s.modalActions}>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          ),
        }}
      />

      {/* Modal Ver Pedido */}
      <Modal
        open={viewModalOpen && !!selectedPedido}
        onClose={closeModals}
        title="Detalle de Pedido"
        size="md"
      >
        {selectedPedido && (
          <div className={s.detailModalContent}>
            <div className={s.detailSection}>
              <h4 className={s.detailSectionTitle}>Detalles del pedido</h4>
              <div className={s.detailGrid}>
                <div className={s.detailItem}><span className={s.detailLabel}>ID</span><span>{selectedPedido.id}</span></div>
                <div className={s.detailItem}><span className={s.detailLabel}>Cliente</span><span>{selectedPedido.cliente}</span></div>
                <div className={s.detailItem}><span className={s.detailLabel}>Asesor</span><span>{selectedPedido.asesor}</span></div>
                <div className={s.detailItem}><span className={s.detailLabel}>Fecha</span><span>{selectedPedido.fecha}</span></div>
                <div className={s.detailItem}><span className={s.detailLabel}>Items</span><span>{selectedPedido.items}</span></div>
                <div className={s.detailItem}><span className={s.detailLabel}>Total</span><span>{selectedPedido.total}</span></div>
              </div>
            </div>
            <div className={s.modalActions}>
              <Button variant="secondary" onClick={closeModals}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Nuevo / Editar Pedido */}
      <Modal
        open={editModalOpen}
        onClose={closeModals}
        title={selectedPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        description={selectedPedido ? `Modificando ${selectedPedido.id}` : 'Completa la información del pedido'}
        size="xl"
        variant="form"
      >
        <form onSubmit={handleSubmit} className={f.form}>
          {formError && <div className={f.formError}>{formError}</div>}

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Cliente *</label>
              <select className={f.select} value={cliente} onChange={e => setCliente(e.target.value)}>
                {clientes.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__otro__">Otro (escribir)...</option>
              </select>
            </div>
            {cliente === '__otro__' && (
              <div className={f.field}>
                <label className={f.label}>Nombre del cliente *</label>
                <input className={f.input} value={clienteLibre} onChange={e => setClienteLibre(e.target.value)} placeholder="Nombre del cliente" />
              </div>
            )}
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Asesor *</label>
              <select className={f.select} value={asesor} onChange={e => setAsesor(e.target.value)}>
                {asesores.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className={f.field}>
              <label className={f.label}>Fecha *</label>
              <input className={f.input} type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
          </div>

          <div className={f.field}>
            <label className={f.label}>Estado *</label>
            <select className={f.select} value={estado} onChange={e => setEstado(e.target.value as Pedido['estado'])}>
              {estadosPedido.map(es => <option key={es} value={es}>{es}</option>)}
            </select>
          </div>

          <div className={f.field}>
            <label className={f.label}>Productos del pedido</label>
            <table className={f.itemsTable}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th className={f.centerCol}>Cant.</th>
                  <th className={f.rightCol}>Precio unit.</th>
                  <th className={f.rightCol}>Subtotal</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => {
                  const sub = (Number(it.cantidad) || 0) * (Number(it.precio) || 0);
                  return (
                    <tr key={it.id}>
                      <td><input className={f.input} value={it.descripcion} onChange={e => updateItem(it.id, 'descripcion', e.target.value)} placeholder="Producto" /></td>
                      <td className={f.centerCol}><input className={f.input} type="number" min="1" value={it.cantidad} onChange={e => updateItem(it.id, 'cantidad', e.target.value)} /></td>
                      <td className={f.rightCol}><input className={f.input} type="number" min="0" value={it.precio} onChange={e => updateItem(it.id, 'precio', e.target.value)} /></td>
                      <td className={f.rightCol} style={{ fontWeight: 600 }}>{formatoCOP(sub)}</td>
                      <td>
                        <button type="button" className={f.removeRowBtn} onClick={() => removeItem(it.id)} aria-label="Eliminar producto" disabled={items.length === 1}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button type="button" className={f.addRowBtn} onClick={addItem}>
              <Plus size={14} /> Agregar producto
            </button>
          </div>

          <div className={f.totalsBox}>
            <div className={f.totalRow}><span>Total de items:</span><span>{totalItems}</span></div>
            <div className={`${f.totalRow} ${f.totalRowFinal}`}><span>Total pedido:</span><span>{formatoCOP(subtotal)}</span></div>
          </div>

          <div className={f.field}>
            <label className={f.label}>Observaciones</label>
            <textarea className={f.textarea} value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Notas del pedido..." rows={2} />
          </div>

          <div className={f.formActions}>
            <Button type="button" variant="secondary" onClick={closeModals} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} leftIcon={<Save size={16} />}>
              {selectedPedido ? 'Guardar cambios' : 'Crear pedido'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};