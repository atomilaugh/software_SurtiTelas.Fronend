import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Pedidos.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';

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
          { label: 'Editar', onClick: () => { setSelectedPedido(p); setEditModalOpen(true); } },
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

      {/* Modal Editar Pedido */}
      <Modal
        open={editModalOpen}
        onClose={closeModals}
        title={selectedPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        size="md"
      >
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
      </Modal>
    </div>
  );
};