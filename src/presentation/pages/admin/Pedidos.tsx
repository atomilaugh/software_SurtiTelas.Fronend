import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import s from './Pedidos.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

interface Pedido {
  id: string;
  cliente: string;
  asesor: string;
  fecha: string;
  items: number;
  total: string;
  estado: 'Nuevo' | 'En producción' | 'Listo' | 'Despachado' | 'Entregado' | 'Cancelado';
}

const mockPedidos: Pedido[] = [
  { id: '#PD-2401', cliente: 'Almacén El Sol', asesor: 'Camila Torres', fecha: '08 Jun 2026', items: 24, total: '$2.480.000', estado: 'En producción' },
  { id: '#PD-2400', cliente: 'Boutique Moda+', asesor: 'Luis Herrera', fecha: '07 Jun 2026', items: 8, total: '$980.000', estado: 'Listo' },
  { id: '#PD-2399', cliente: 'Textiles Andina', asesor: 'Camila Torres', fecha: '07 Jun 2026', items: 45, total: '$5.120.000', estado: 'Despachado' },
  { id: '#PD-2398', cliente: 'Moda Casual SAS', asesor: 'Pedro Gómez', fecha: '06 Jun 2026', items: 12, total: '$1.340.000', estado: 'Entregado' },
  { id: '#PD-2397', cliente: 'La Tienda Norte', asesor: 'Luis Herrera', fecha: '05 Jun 2026', items: 6, total: '$720.000', estado: 'Cancelado' },
  { id: '#PD-2396', cliente: 'Confección del Valle', asesor: 'Camila Torres', fecha: '04 Jun 2026', items: 18, total: '$2.150.000', estado: 'Nuevo' },
  { id: '#PD-2395', cliente: 'Telas Premium', asesor: 'Luis Herrera', fecha: '03 Jun 2026', items: 22, total: '$3.200.000', estado: 'En producción' },
  { id: '#PD-2394', cliente: 'Moda Express', asesor: 'Pedro Gómez', fecha: '02 Jun 2026', items: 9, total: '$1.180.000', estado: 'Listo' },
];

const orderStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'default',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

export const AdminPedidos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const filteredPedidos = mockPedidos.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedPedido(null);
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Pedidos</h1>
          <p className={s.pageSubtitle}>Gestión de pedidos del sistema</p>
        </div>
        <Button onClick={() => setEditModalOpen(true)}>
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar pedidos..."
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
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Asesor</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(pedido => (
              <tr key={pedido.id}>
                <td className={s.tdMono}>{pedido.id}</td>
                <td className={s.tdPrimary}>{pedido.cliente}</td>
                <td>{pedido.asesor}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.items}</td>
                <td>{pedido.total}</td>
                <td>
                  <Badge variant={orderStatuses[pedido.estado]}>
                    {pedido.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} onClick={() => { setSelectedPedido(pedido); setViewModalOpen(true); }}>Ver</button>
                    <button className={s.actionBtn} onClick={() => { setSelectedPedido(pedido); setEditModalOpen(true); }}>Editar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ver Pedido */}
      {viewModalOpen && selectedPedido && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Detalle de Pedido</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <div className={s.detailRow}><span>ID:</span> {selectedPedido.id}</div>
              <div className={s.detailRow}><span>Cliente:</span> {selectedPedido.cliente}</div>
              <div className={s.detailRow}><span>Asesor:</span> {selectedPedido.asesor}</div>
              <div className={s.detailRow}><span>Fecha:</span> {selectedPedido.fecha}</div>
              <div className={s.detailRow}><span>Items:</span> {selectedPedido.items}</div>
              <div className={s.detailRow}><span>Total:</span> {selectedPedido.total}</div>
              <div className={s.detailRow}><span>Estado:</span> <Badge variant={orderStatuses[selectedPedido.estado]}>{selectedPedido.estado}</Badge></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Pedido */}
      {editModalOpen && selectedPedido && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>{selectedPedido && Object.keys(selectedPedido).length ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
              <button className={s.closeBtn} onClick={closeModals}><X size={16} /></button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Cliente</label>
                    <select className={s.select} defaultValue={selectedPedido?.cliente}>
                      <option>Almacén El Sol</option>
                      <option>Boutique Moda+</option>
                      <option>Textiles Andina</option>
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Estado</label>
                    <select className={s.select} defaultValue={selectedPedido?.estado}>
                      <option>Nuevo</option>
                      <option>En producción</option>
                      <option>Listo</option>
                      <option>Despachado</option>
                      <option>Entregado</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={closeModals}>Cancelar</Button>
                  <Button onClick={closeModals}>{selectedPedido ? 'Guardar cambios' : 'Crear pedido'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};