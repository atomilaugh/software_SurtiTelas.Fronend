import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ToggleLeft, Barcode, Package, CreditCard, Calendar, User } from 'lucide-react';
import s from './ProductosTerminados.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';
import { SearchInput } from '@/shared/ui/SearchInput';

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

const mockProductos: Producto[] = [
  { id: 'PT-001', codigo: 'PROD-001', nombre: 'Camisa Polo M', categoria: 'Camisas', talla: 'M', color: 'Azul', stock: 50, precio: 45000, fechaCreacion: '2024-01-15', estado: 'Activo' },
  { id: 'PT-002', codigo: 'PROD-002', nombre: 'Pantaloneta', categoria: 'Pantalones', talla: 'Única', color: 'Negro', stock: 30, precio: 38000, fechaCreacion: '2024-02-20', estado: 'Activo' },
  { id: 'PT-003', codigo: 'PROD-003', nombre: 'Chaqueta Denim', categoria: 'Chaquetas', talla: 'L', color: 'Azul', stock: 15, precio: 120000, fechaCreacion: '2024-03-10', estado: 'Activo' },
  { id: 'PT-004', codigo: 'PROD-004', nombre: 'Blusa Casual', categoria: 'Blusas', talla: 'S', color: 'Blanco', stock: 0, precio: 35000, fechaCreacion: '2024-01-25', estado: 'Inactivo' },
  { id: 'PT-005', codigo: 'PROD-005', nombre: 'Vestido Largo', categoria: 'Vestidos', talla: 'M', color: 'Rojo', stock: 25, precio: 85000, fechaCreacion: '2024-04-12', estado: 'Activo' },
];

export const AdminProductosTerminados: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredProductos = useMemo(() => {
    return mockProductos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
    { label: 'Editar', icon: <Edit size={14} />, onClick: () => toast.info('Editar producto terminado') },
    { label: 'Desactivar', icon: <ToggleLeft size={14} />, onClick: () => toast.info('Estado del producto actualizado') },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: () => { if (confirm('¿Eliminar producto terminado?')) toast.success('Producto terminado eliminado'); } },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de Productos Terminados</h1>
          <p className={s.pageSubtitle}>Control de productos finalizados</p>
        </div>
        <Button onClick={() => toast.info('Formulario de nuevo producto terminado')}>
          <Plus size={16} />
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
    </div>
  );
};
