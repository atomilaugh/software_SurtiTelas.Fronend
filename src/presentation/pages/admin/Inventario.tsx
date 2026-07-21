import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Inventario.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import { inventoryApi, type InventoryMovement } from '@/infrastructure/api/inventoryApi';
import { useAuthStore } from '@/core/stores/authStore';
import { TIPOS_MOVIMIENTO, MOTIVOS_MOVIMIENTO } from '@/shared/constants/options';

interface MovimientoFila {
  id: string;
  ref: string;
  nombre: string;
  cantidadStock: number;
  stock: 'OK' | 'Bajo stock' | 'Agotado';
  tela: string;
  tipo: string;
  motivo: string;
}

function toFila(m: InventoryMovement): MovimientoFila {
  return {
    id: m.id,
    ref: m.productId ?? m.rawMaterialId ?? m.id,
    nombre: m.motivo,
    cantidadStock: m.cantidad,
    stock: m.tipo === 'salida' ? 'Bajo stock' : m.tipo === 'ajuste' ? 'Agotado' : 'OK',
    tela: m.tipo,
    tipo: m.tipo,
    motivo: m.motivo,
  };
}

export const AdminInventario: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ajusteModalOpen, setAjusteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<MovimientoFila | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const user = useAuthStore((st) => st.user);
  const [productos, setProductos] = useState<MovimientoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MovimientoFila | null>(null);

  const [editCantidad, setEditCantidad] = useState(0);
  const [editMotivo, setEditMotivo] = useState('Ingreso de mercancía');
  const [editTipo, setEditTipo] = useState<'entrada' | 'salida' | 'ajuste'>('entrada');

  useEffect(() => {
    const fetchMovimientos = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await inventoryApi.list();
        setProductos(result.data.map(toFila));
      } catch {
        setError('No se pudieron cargar los movimientos de inventario');
      } finally {
        setLoading(false);
      }
    };
    void fetchMovimientos();
  }, []);

  const filtered = useMemo(() => {
    return productos.filter(p =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.tela && p.tela.toLowerCase().includes(search.toLowerCase()))
    );
  }, [productos, search]);

  const tableData = useMemo(() => filtered.map(p => ({ ...p, id: p.ref })), [filtered]);

  const closeModals = () => {
    setAjusteModalOpen(false);
    setEditModalOpen(false);
    setSelectedProducto(null);
    setEditCantidad(0);
    setEditMotivo('Ingreso de mercancía');
    setEditTipo('entrada');
    setFormError(null);
    setSaving(false);
  };

  const openAjusteModal = () => {
    setSelectedProducto(null);
    setEditCantidad(0);
    setEditMotivo('Ingreso de mercancía');
    setEditTipo('entrada');
    setFormError(null);
    setAjusteModalOpen(true);
  };

  const handleGuardarAjuste = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await inventoryApi.create({
        tipo: editTipo,
        cantidad: Math.abs(editCantidad),
        motivo: editMotivo,
        productId: selectedProducto?.ref || undefined,
        usuarioId: user?.uid ?? '',
      });
      const result = await inventoryApi.list();
      setProductos(result.data.map(toFila));
      closeModals();
    } catch {
      setFormError('Error al registrar movimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = (item: MovimientoFila) => {
    setDeleteConfirm(item);
  };

  const handleEditarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProducto) return;
    setSaving(true);
    try {
      await inventoryApi.create({
        tipo: 'ajuste',
        cantidad: Math.abs(editCantidad),
        ajuste: editCantidad,
        motivo: 'Edición de stock',
        productId: selectedProducto.ref,
        usuarioId: user?.uid ?? '',
      });
      const result = await inventoryApi.list();
      setProductos(result.data.map(toFila));
      closeModals();
    } catch {
      setFormError('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const columns: DataTableColumn<MovimientoFila>[] = [
    { key: 'ref', header: 'Referencia', sortable: true },
    { key: 'nombre', header: 'Producto', sortable: true },
    { key: 'cantidadStock', header: 'Disponible', sortable: true, align: 'right' },
    { key: 'stock', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<MovimientoFila> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'lg',
    header: item => ({
      icon: <Package size={18} />,
      title: 'Producto en inventario',
      code: item.ref,
      subtitle: item.tela ? `Tela: ${item.tela}` : undefined,
      meta: item.stock === 'OK' ? 'Disponible para producción' : 'Requiere atención de stock',
      status: item.stock === 'OK' ? 'Activo' : item.stock,
      badgeVariant: item.stock === 'OK' ? 'success' : item.stock === 'Bajo stock' ? 'warning' : 'danger',
    }),
    kpis: item => [
      { label: 'Stock actual', value: item.cantidadStock, icon: <Package size={16} />, tone: item.stock === 'OK' ? 'success' : item.stock === 'Bajo stock' ? 'warning' : 'danger' },
      { label: 'Estado', value: item.stock, icon: <AlertTriangle size={16} />, tone: item.stock === 'OK' ? 'success' : item.stock === 'Bajo stock' ? 'warning' : 'danger' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Tela:</span> {item.tela}</div>
        <div className={s.detailRow}><span>Referencia:</span> {item.ref}</div>
        <div className={s.detailRow}><span>Stock:</span> {item.cantidadStock}</div>
      </div>
    ),
  };

  const actions: DataTableAction<MovimientoFila>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => { setSelectedProducto(item); setEditCantidad(item.cantidadStock); setEditModalOpen(true); } },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: (item) => handleEliminar(item) },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Inventario</h1>
          <p className={s.pageSubtitle}>Gestión de productos y stock</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openAjusteModal}>
          Ajustar stock
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={tableData}
          columns={columns}
          detailPanel={detailPanel}
          actions={actions}
          enableColumnFilters={false}
          enableExport={false}
          enableRowSelection={false}
          enableSorting={true}
          emptyMessage={loading ? 'Cargando inventario...' : error ? error : 'No se encontraron productos'}
          toolbarLeft={null}
          maxVisibleColumns={5}
        />
      </div>

      {ajusteModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Ajustar Stock</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form} onSubmit={handleGuardarAjuste}>
                {formError && (
                  <div className={s.formErrorBanner}>
                    {formError}
                  </div>
                )}
                <div className={s.field}>
                  <label className={s.label}>Producto (Referencia)</label>
                  <select className={s.select} value={selectedProducto?.ref || ''} onChange={e => {
                    const prod = productos.find(p => p.ref === e.target.value);
                    setSelectedProducto(prod || null);
                  }} required>
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => <option key={p.ref} value={p.ref}>{p.ref} - {p.nombre}</option>)}
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Tipo de movimiento</label>
                  <select className={s.select} value={editTipo} onChange={e => setEditTipo(e.target.value as 'entrada' | 'salida' | 'ajuste')}>
                    {TIPOS_MOVIMIENTO.map(t => (
                      <option key={t} value={t}>{t === 'entrada' ? 'Entrada (+)' : t === 'salida' ? 'Salida (-)' : 'Ajuste'}</option>
                    ))}
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Cantidad</label>
                  <input type="number" className={s.input} value={editCantidad} onChange={e => setEditCantidad(Number(e.target.value))} min="0" required />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Motivo</label>
                  <select className={s.select} value={editMotivo} onChange={e => setEditMotivo(e.target.value)}>
                    {MOTIVOS_MOVIMIENTO.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className={s.modalFooter}>
                  <Button type="button" variant="secondary" onClick={closeModals} disabled={saving}>Cancelar</Button>
                  <Button type="submit" loading={saving}>Aplicar ajuste</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && selectedProducto && (
        <div className={s.modalOverlay}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Editar Producto</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form} onSubmit={handleEditarSubmit}>
                <div className={s.field}>
                  <label className={s.label}>Referencia</label>
                  <input type="text" className={s.input} value={selectedProducto.ref} readOnly style={{ opacity: 0.6 }} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Nombre</label>
                  <input type="text" className={s.input} value={selectedProducto.nombre} readOnly style={{ opacity: 0.6 }} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Stock actual</label>
                  <input type="number" className={s.input} value={editCantidad} onChange={e => setEditCantidad(Number(e.target.value))} min="0" required />
                </div>
                <div className={s.modalFooter}>
                  <Button type="button" variant="secondary" onClick={closeModals} disabled={saving}>Cancelar</Button>
                  <Button type="submit" loading={saving}>Guardar cambios</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (!deleteConfirm) return;
          setProductos(prev => prev.filter(p => p.ref !== deleteConfirm.ref));
          setDeleteConfirm(null);
        }}
        title="Eliminar producto"
        description={`¿Estás seguro de que deseas eliminar "${deleteConfirm?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
};
