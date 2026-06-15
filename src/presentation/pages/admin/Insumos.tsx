import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ToggleLeft, AlertTriangle, Barcode, Package, BarChart3, CreditCard } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Insumos.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';

interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  medida: string;
  stock: number;
  stockMin: number;
  stockMax: number;
  precio: number;
  proveedor: string;
  estado: 'Activo' | 'Inactivo';
}

const mockInsumos: Insumo[] = [
  { id: 'I-001', codigo: 'INS-001', nombre: 'Algodón Pima', categoria: 'Fibra', medida: 'Kg', stock: 150, stockMin: 50, stockMax: 300, precio: 12000, proveedor: 'Textiles Andina', estado: 'Activo' },
  { id: 'I-002', codigo: 'INS-002', nombre: 'Poliéster', categoria: 'Fibra', medida: 'Kg', stock: 80, stockMin: 100, stockMax: 250, precio: 8500, proveedor: 'Fabricato Sur', estado: 'Activo' },
  { id: 'I-003', codigo: 'INS-003', nombre: 'Botones de náilon', categoria: 'Accesorios', medida: 'Und', stock: 500, stockMin: 200, stockMax: 1000, precio: 250, proveedor: 'Accesorios Pro', estado: 'Activo' },
  { id: 'I-004', codigo: 'INS-004', nombre: 'Hilo polyester', categoria: 'Hilos', medida: 'Unds', stock: 25, stockMin: 30, stockMax: 500, precio: 1200, proveedor: 'Hilos del Valle', estado: 'Activo' },
  { id: 'I-005', codigo: 'INS-005', nombre: 'Cremallera', categoria: 'Cierres', medida: 'Und', stock: 350, stockMin: 100, stockMax: 500, precio: 1800, proveedor: 'Cierres Técnicos', estado: 'Activo' },
  { id: 'I-006', codigo: 'INS-006', nombre: 'Etiquetas', categoria: 'Accesorios', medida: 'Und', stock: 120, stockMin: 100, stockMax: 500, precio: 150, proveedor: 'Etiquetas Express', estado: 'Inactivo' },
];

export const AdminInsumos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  const filteredInsumos = useMemo(() => {
    return mockInsumos.filter(i =>
      i.nombre.toLowerCase().includes(search.toLowerCase()) ||
      i.codigo.toLowerCase().includes(search.toLowerCase()) ||
      i.categoria.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInsumo(null);
  };

  const columns: DataTableColumn<Insumo>[] = [
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
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      align: 'right',
      render: (item) => (
        <div className={s.stockCell}>
          <span>{item.stock}</span>
          {item.stock < item.stockMin && (
            <AlertTriangle size={14} className={s.stockAlert} />
          )}
        </div>
      ),
    },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Insumo> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'xl',
    header: item => ({
      icon: <Package size={18} />,
      title: 'Insumo',
      code: item.codigo,
      subtitle: `${item.nombre} · ${item.categoria}`,
      meta: item.medida,
      status: item.estado,
      badgeVariant: item.estado === 'Activo' ? 'success' : 'default',
    }),
    kpis: item => [
      { label: 'Stock', value: item.stock, icon: <Package size={16} />, tone: item.stock < item.stockMin ? 'warning' : 'success' },
      { label: 'Stock mínimo', value: item.stockMin, icon: <AlertTriangle size={16} />, tone: 'default' },
      { label: 'Stock máximo', value: item.stockMax, icon: <BarChart3 size={16} />, tone: 'primary' },
      { label: 'Precio', value: `$${item.precio.toLocaleString()}`, icon: <CreditCard size={16} />, tone: 'info' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Medida:</span> {item.medida}</div>
        <div className={s.detailRow}><span>Precio:</span> ${item.precio.toLocaleString()}</div>
        <div className={s.detailRow}><span>Proveedor:</span> {item.proveedor}</div>
        <div className={s.detailRow}><span>Stock mínimo:</span> {item.stockMin}</div>
        <div className={s.detailRow}><span>Stock máximo:</span> {item.stockMax}</div>
      </div>
    ),
  };

  const actions = ((item: Insumo): DataTableAction<Insumo>[] => [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (i) => { setSelectedInsumo(i); setModalOpen(true); } },
    { label: item.estado === 'Activo' ? 'Desactivar' : 'Activar', icon: <ToggleLeft size={14} />, onClick: (item) => toast.success(`Insumo ${item.estado === 'Activo' ? 'desactivado' : 'activado'}`) },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: (item) => { if (confirm(`¿Eliminar ${item.nombre}?`)) toast.success('Insumo eliminado'); } },
  ]) as DataTableAction<Insumo>[] | ((item: Insumo) => DataTableAction<Insumo>[]);

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de Insumos</h1>
          <p className={s.pageSubtitle}>Inventario de insumos</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Insumo
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar insumos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={filteredInsumos}
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

      {modalOpen && (
        <div className={s.modalOverlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Código</label>
                    <input type="text" className={s.input} defaultValue={selectedInsumo?.codigo} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Nombre</label>
                    <input type="text" className={s.input} defaultValue={selectedInsumo?.nombre} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Categoría</label>
                    <select className={s.select} defaultValue={selectedInsumo?.categoria}>
                      <option>Fibra</option>
                      <option>Hilos</option>
                      <option>Accesorios</option>
                      <option>Cierres</option>
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Medida</label>
                    <select className={s.select} defaultValue={selectedInsumo?.medida}>
                      <option>Kg</option>
                      <option>Unid</option>
                      <option>Lts</option>
                      <option>Mts</option>
                    </select>
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Stock mínimo</label>
                    <input type="number" className={s.input} defaultValue={selectedInsumo?.stockMin} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Stock máximo</label>
                    <input type="number" className={s.input} defaultValue={selectedInsumo?.stockMax} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Precio</label>
                    <input type="number" className={s.input} defaultValue={selectedInsumo?.precio} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Proveedor</label>
                    <select className={s.select} defaultValue={selectedInsumo?.proveedor}>
                      <option>Textiles Andina</option>
                      <option>Fabricato Sur</option>
                      <option>Accesorios Pro</option>
                      <option>Hilos del Valle</option>
                    </select>
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedInsumo ? 'Guardar cambios' : 'Crear insumo'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
