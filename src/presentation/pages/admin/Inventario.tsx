import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Inventario.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';
import { useAppStore } from '@/core/stores';
import type { Producto } from '@/core/types';

export const AdminInventario: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ajusteModalOpen, setAjusteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const productos = useAppStore(s => s.productos);
  const addMovimiento = useAppStore(s => s.addMovimiento);
  const updateProducto = useAppStore(s => s.updateProducto);
  const deleteProducto = useAppStore(s => s.deleteProducto);

  const [editCantidad, setEditCantidad] = useState(0);
  const [editMotivo, setEditMotivo] = useState('Ingreso de mercancía');
  const [editTipo, setEditTipo] = useState<'entrada' | 'salida' | 'ajuste'>('entrada');

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
      addMovimiento({
        tipo: editTipo,
        productoRef: selectedProducto?.ref || '',
        cantidad: Math.abs(editCantidad),
        motivo: editMotivo,
        usuario: 'admin',
      });
      closeModals();
    } catch {
      setFormError('Error al registrar movimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = (ref: string) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      deleteProducto(ref);
    }
  };

  const columns: DataTableColumn<Producto>[] = [
    { key: 'ref', header: 'Referencia', sortable: true },
    { key: 'nombre', header: 'Producto', sortable: true },
    { key: 'cantidadStock', header: 'Disponible', sortable: true, align: 'right' },
    { key: 'stock', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Producto> = {
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

  const actions: DataTableAction<Producto>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => { setSelectedProducto(item); setEditCantidad(item.cantidadStock); setEditModalOpen(true); } },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: (item) => handleEliminar(item.ref) },
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
          toolbarLeft={null}
          maxVisibleColumns={5}
          emptyMessage="No se encontraron productos"
        />
      </div>

      {ajusteModalOpen && (
        <div className={s.modalOverlay} onClick={closeModals}>
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
                    <option value="entrada">Entrada (+)</option>
                    <option value="salida">Salida (-)</option>
                    <option value="ajuste">Ajuste</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Cantidad</label>
                  <input type="number" className={s.input} value={editCantidad} onChange={e => setEditCantidad(Number(e.target.value))} min="0" required />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Motivo</label>
                  <select className={s.select} value={editMotivo} onChange={e => setEditMotivo(e.target.value)}>
                    <option>Ingreso de mercancía</option>
                    <option>Devolución cliente</option>
                    <option>Daño/rotura</option>
                    <option>Corrección inventario</option>
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
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Editar Producto</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form} onSubmit={e => {
                e.preventDefault();
                updateProducto(selectedProducto.ref, { 
                  cantidadStock: editCantidad,
                });
                closeModals();
              }}>
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
    </div>
  );
};