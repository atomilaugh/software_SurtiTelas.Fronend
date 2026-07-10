import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ToggleLeft, Barcode, Package, CreditCard, Calendar, User, Save } from 'lucide-react';
import s from './ProductosTerminados.module.css';
import f from '@/styles/Form.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Modal } from '@/shared/ui/Modal';

interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  talla: string;
  color: string;
  stock: number;
  precio: number;
  fechaCreacion: string;
  estado: 'Activo' | 'Inactivo';
}

const productosIniciales: Producto[] = [
  { id: 'PT-001', codigo: 'PROD-001', nombre: 'Camisa Polo M', categoria: 'Camisas', talla: 'M', color: 'Azul', stock: 50, precio: 45000, fechaCreacion: '2024-01-15', estado: 'Activo' },
  { id: 'PT-002', codigo: 'PROD-002', nombre: 'Pantaloneta', categoria: 'Pantalones', talla: 'Única', color: 'Negro', stock: 30, precio: 38000, fechaCreacion: '2024-02-20', estado: 'Activo' },
  { id: 'PT-003', codigo: 'PROD-003', nombre: 'Chaqueta Denim', categoria: 'Chaquetas', talla: 'L', color: 'Azul', stock: 15, precio: 120000, fechaCreacion: '2024-03-10', estado: 'Activo' },
  { id: 'PT-004', codigo: 'PROD-004', nombre: 'Blusa Casual', categoria: 'Blusas', talla: 'S', color: 'Blanco', stock: 0, precio: 35000, fechaCreacion: '2024-01-25', estado: 'Inactivo' },
  { id: 'PT-005', codigo: 'PROD-005', nombre: 'Vestido Largo', categoria: 'Vestidos', talla: 'M', color: 'Rojo', stock: 25, precio: 85000, fechaCreacion: '2024-04-12', estado: 'Activo' },
];

const categorias = ['Camisas', 'Pantalones', 'Chaquetas', 'Blusas', 'Vestidos', 'Básicos', 'Deportivo'];
const tallas = ['XS', 'S', 'M', 'L', 'XL', 'Única'];

export const AdminProductosTerminados: React.FC = () => {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(categorias[0]);
  const [talla, setTalla] = useState(tallas[0]);
  const [color, setColor] = useState('');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState<'Activo' | 'Inactivo'>('Activo');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredProductos = useMemo(() => {
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
    );
  }, [productos, search]);

  const resetForm = () => {
    setCodigo('');
    setNombre('');
    setCategoria(categorias[0]);
    setTalla(tallas[0]);
    setColor('');
    setStock('');
    setPrecio('');
    setEstado('Activo');
    setFormError(null);
  };

  const openModal = (item?: Producto) => {
    if (item) {
      setCodigo(item.codigo);
      setNombre(item.nombre);
      setCategoria(item.categoria);
      setTalla(item.talla);
      setColor(item.color);
      setStock(String(item.stock));
      setPrecio(String(item.precio));
      setEstado(item.estado);
      setEditingId(item.id);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!nombre.trim()) { setFormError('El nombre del producto es obligatorio'); return; }
    if (!codigo.trim()) { setFormError('El código del producto es obligatorio'); return; }
    if (!precio || Number(precio) <= 0) { setFormError('El precio debe ser mayor a 0'); return; }
    if (!editingId && productos.some(p => p.codigo.toLowerCase() === codigo.trim().toLowerCase())) {
      setFormError('Ya existe un producto con ese código'); return;
    }
    setSaving(true);
    const hoy = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setProductos(prev => prev.map(p => p.id === editingId ? {
        ...p,
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria,
        talla,
        color: color.trim() || 'Sin especificar',
        stock: Number(stock) || 0,
        precio: Number(precio),
        estado,
      } : p));
      toast.success(`Producto "${nombre.trim()}" actualizado correctamente`);
    } else {
      const nuevo: Producto = {
        id: `PT-${String(productos.length + 1).padStart(3, '0')}`,
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria,
        talla,
        color: color.trim() || 'Sin especificar',
        stock: Number(stock) || 0,
        precio: Number(precio),
        fechaCreacion: hoy,
        estado,
      };
      setProductos(prev => [nuevo, ...prev]);
      toast.success(`Producto "${nuevo.nombre}" creado correctamente`);
    }
    closeModal();
  };

  const columns: DataTableColumn<Producto>[] = [
    {
      key: 'codigo',
      header: 'Código',
      sortable: true,
      render: (item) => (
        <div className={s.codigoCell}>
          <Barcode size={14} />
          {item.codigo}
        </div>
      ),
    },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'categoria', header: 'Categoría', sortable: true },
    { key: 'stock', header: 'Stock', sortable: true, align: 'right' },
    { key: 'precio', header: 'Precio', sortable: true, align: 'right' },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Producto> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'xl',
    header: item => ({
      icon: <Package size={18} />,
      title: 'Producto terminado',
      code: item.codigo,
      subtitle: `${item.nombre} · ${item.categoria}`,
      meta: item.fechaCreacion,
      status: item.estado,
      badgeVariant: item.estado === 'Activo' ? 'success' : 'default',
    }),
    kpis: item => [
      { label: 'Stock', value: item.stock, icon: <Package size={16} />, tone: item.stock > 0 ? 'success' : 'danger' },
      { label: 'Precio', value: `$${item.precio.toLocaleString()}`, icon: <CreditCard size={16} />, tone: 'info' },
      { label: 'Talla', value: item.talla, icon: <User size={16} />, tone: 'primary' },
      { label: 'Creación', value: item.fechaCreacion, icon: <Calendar size={16} />, tone: 'default' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Talla:</span> {item.talla}</div>
        <div className={s.detailRow}><span>Color:</span> {item.color}</div>
        <div className={s.detailRow}><span>Precio:</span> ${item.precio.toLocaleString()}</div>
        <div className={s.detailRow}><span>Fecha creación:</span> {item.fechaCreacion}</div>
      </div>
    ),
  };

  const actions: DataTableAction<Producto>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => openModal(item) },
    { label: 'Desactivar', icon: <ToggleLeft size={14} />, onClick: (item) => {
      setProductos(prev => prev.map(p => p.id === item.id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p));
      toast.info(`Producto "${item.nombre}" ${item.estado === 'Activo' ? 'desactivado' : 'activado'}`);
    } },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: (item) => { if (confirm('¿Eliminar producto terminado?')) { setProductos(prev => prev.filter(p => p.id !== item.id)); toast.success('Producto terminado eliminado'); } } },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de Productos Terminados</h1>
          <p className={s.pageSubtitle}>Control de productos finalizados</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => openModal()}>
          Nuevo Producto
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
          data={filteredProductos}
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

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Registrar Nuevo Producto"
        description="Completa la información del producto terminado"
        size="lg"
        variant="form"
      >
        <form onSubmit={handleSubmit} className={f.form}>
          {formError && <div className={f.formError}>{formError}</div>}

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Código *</label>
              <input className={f.input} value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ej: PROD-006" />
            </div>
            <div className={f.field}>
              <label className={f.label}>Nombre *</label>
              <input className={f.input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Camisa Polo M" />
            </div>
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Categoría *</label>
              <select className={f.select} value={categoria} onChange={e => setCategoria(e.target.value)}>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={f.field}>
              <label className={f.label}>Talla *</label>
              <select className={f.select} value={talla} onChange={e => setTalla(e.target.value)}>
                {tallas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Color</label>
              <input className={f.input} value={color} onChange={e => setColor(e.target.value)} placeholder="Ej: Azul" />
            </div>
            <div className={f.field}>
              <label className={f.label}>Estado *</label>
              <select className={f.select} value={estado} onChange={e => setEstado(e.target.value as 'Activo' | 'Inactivo')}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Stock (unidades) *</label>
              <input className={f.input} type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" />
            </div>
            <div className={f.field}>
              <label className={f.label}>Precio ($) *</label>
              <input className={f.input} type="number" min="1" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className={f.formActions}>
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} leftIcon={<Save size={16} />}>
              Crear producto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
