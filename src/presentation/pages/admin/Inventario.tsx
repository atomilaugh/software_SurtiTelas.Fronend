import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import s from './Inventario.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

interface InventarioItem {
  id: string;
  referencia: string;
  descripcion: string;
  tela: string;
  color: string;
  disponible: number;
  stockMinimo: number;
  costo: string;
  venta: string;
}

const mockInventario: InventarioItem[] = [
  { id: 'I-001', referencia: 'CAM-001', descripcion: 'Camiseta básica', tela: 'Algodón', color: 'Blanco', disponible: 150, stockMinimo: 50, costo: '$25.000', venta: '$45.000' },
  { id: 'I-002', referencia: 'CAM-002', descripcion: 'Camiseta básica', tela: 'Poliéster', color: 'Negro', disponible: 25, stockMinimo: 50, costo: '$28.000', venta: '$48.000' },
  { id: 'I-003', referencia: 'CAM-003', descripcion: 'Pantaloneta', tela: 'Lino', color: 'Beige', disponible: 0, stockMinimo: 30, costo: '$35.000', venta: '$55.000' },
  { id: 'I-004', referencia: 'CAM-004', descripcion: 'Blusa', tela: 'Seda', color: 'Rojo', disponible: 80, stockMinimo: 40, costo: '$45.000', venta: '$75.000' },
  { id: 'I-005', referencia: 'CAM-005', descripcion: 'Chaqueta', tela: 'Denim', color: 'Azul', disponible: 12, stockMinimo: 40, costo: '$85.000', venta: '$145.000' },
];

const getStockStatus = (item: InventarioItem): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  if (item.disponible === 0) return 'danger';
  if (item.disponible > item.stockMinimo * 2) return 'success';
  return 'warning';
};

const getStockLabel = (item: InventarioItem) => {
  if (item.disponible === 0) return 'Agotado';
  if (item.disponible > item.stockMinimo * 2) return 'OK';
  return 'Bajo stock';
};

export const AdminInventario: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ajusteModalOpen, setAjusteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);

  const filtered = mockInventario.filter(i =>
    i.referencia.toLowerCase().includes(search.toLowerCase()) ||
    i.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const closeModals = () => {
    setAjusteModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Inventario</h1>
          <p className={s.pageSubtitle}>Gestión de productos y stock</p>
        </div>
        <Button onClick={() => setAjusteModalOpen(true)}>
          <Plus size={16} />
          Ajustar stock
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Referencia</th>
              <th>Descripción</th>
              <th>Tela</th>
              <th>Color</th>
              <th>Disponible</th>
              <th>Stock mín.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td className={s.tdMono}>{item.id}</td>
                <td className={s.tdPrimary}>{item.referencia}</td>
                <td>{item.descripcion}</td>
                <td>{item.tela}</td>
                <td>{item.color}</td>
                <td>{item.disponible}</td>
                <td>{item.stockMinimo}</td>
                <td>
                  <Badge variant={getStockStatus(item)}>
                    {getStockLabel(item)}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} title="Editar" onClick={() => { setSelectedItem(item); setEditModalOpen(true); }}>
                      <Edit size={14} />
                    </button>
                    <button className={`${s.actionBtn} ${s.actionBtnDanger}`} title="Eliminar" onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajustar Stock */}
      {ajusteModalOpen && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Ajustar Stock</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.field}>
                  <label className={s.label}>Referencia</label>
                  <input type="text" className={s.input} placeholder="Referencia del producto" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Cantidad a ajustar</label>
                  <input type="number" className={s.input} placeholder="Ej: +50 o -20" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Motivo</label>
                  <select className={s.input}>
                    <option>Ingreso de mercancía</option>
                    <option>Devolución cliente</option>
                    <option>Daño/rotura</option>
                    <option>Corrección inventario</option>
                  </select>
                </div>
                <div className={s.formActions}>
                  <button className={s.btnSecondary} type="button" onClick={closeModals}>Cancelar</button>
                  <button className={s.btnPrimary} type="button" onClick={closeModals}>Aplicar ajuste</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Item */}
      {editModalOpen && selectedItem && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Editar Producto</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.field}>
                  <label className={s.label}>Descripción</label>
                  <input type="text" className={s.input} defaultValue={selectedItem.descripcion} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Stock mínimo</label>
                  <input type="number" className={s.input} defaultValue={selectedItem.stockMinimo} />
                </div>
                <div className={s.formActions}>
                  <button className={s.btnSecondary} type="button" onClick={closeModals}>Cancelar</button>
                  <button className={s.btnPrimary} type="button" onClick={closeModals}>Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteModalOpen && selectedItem && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Confirmar eliminación</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                ¿Está seguro de eliminar el producto <strong>{selectedItem.referencia}</strong>? Esta acción no se puede revertir.
              </p>
              <div className={s.formActions}>
                <button className={s.btnSecondary} type="button" onClick={closeModals}>Cancelar</button>
                <button className={s.btnDanger} type="button" onClick={closeModals}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};