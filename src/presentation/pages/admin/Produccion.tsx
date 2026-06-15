import React, { useState, useMemo } from 'react';
import s from './Produccion.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';

interface OrdenProduccion {
  id: string;
  pedido: string;
  operario: string;
  referencia: string;
  cantidad: number;
  fechaInicio: string;
  fechaEstimada: string;
  avance: number;
  estado: 'Pendiente' | 'En proceso' | 'Terminado';
}

const mockOrdenes: OrdenProduccion[] = [
  { id: 'OP-001', pedido: '#PD-2401', operario: 'Juan Pérez', referencia: 'CAM-001', cantidad: 50, fechaInicio: '05 Jun', fechaEstimada: '10 Jun', avance: 65, estado: 'En proceso' },
  { id: 'OP-002', pedido: '#PD-2400', operario: 'María López', referencia: 'CAM-002', cantidad: 30, fechaInicio: '04 Jun', fechaEstimada: '09 Jun', avance: 100, estado: 'Terminado' },
  { id: 'OP-003', pedido: '#PD-2399', operario: 'Carlos Ruiz', referencia: 'CAM-003', cantidad: 80, fechaInicio: '03 Jun', fechaEstimada: '12 Jun', avance: 25, estado: 'En proceso' },
  { id: 'OP-004', pedido: '#PD-2398', operario: 'Ana Martínez', referencia: 'CAM-004', cantidad: 20, fechaInicio: '', fechaEstimada: '08 Jun', avance: 0, estado: 'Pendiente' },
];


export const AdminProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);

  const filtered = useMemo(() => {
    return mockOrdenes.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.pedido.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const closeModals = () => {
    setEditModalOpen(false);
    setSelectedOrden(null);
  };

  const columns: DataTableColumn<OrdenProduccion>[] = [
    { key: 'id', header: 'ID Orden', sortable: true },
    { key: 'pedido', header: 'Pedido', sortable: true },
    { key: 'referencia', header: 'Referencia', sortable: true },
    { key: 'cantidad', header: 'Cantidad', sortable: true, align: 'right' },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<OrdenProduccion> = {
    title: item => `Detalle: ${item.id}`,
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Operario:</span> {item.operario}</div>
        <div className={s.detailRow}><span>Referencia:</span> {item.referencia}</div>
        <div className={s.detailRow}><span>Cantidad:</span> {item.cantidad}</div>
        <div className={s.detailRow}><span>Fecha inicio:</span> {item.fechaInicio || '-'}</div>
        <div className={s.detailRow}><span>Fecha estimada:</span> {item.fechaEstimada}</div>
        <div className={s.detailRow}><span>Avance:</span> {item.avance}%</div>
        <div className={s.progressBar}>
          <div className={s.progressFill} style={{ width: `${item.avance}%` }} />
        </div>
      </div>
    ),
  };

  const actions: DataTableAction<OrdenProduccion>[] = [
    { label: 'Editar', onClick: (item) => { setSelectedOrden(item); setEditModalOpen(true); } },
  ];

  return (
    <div>
      <h1 className={s.pageTitle}>Producción</h1>
      <p className={s.pageSubtitle}>Órdenes de producción activas</p>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar órdenes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={filtered}
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

      {editModalOpen && selectedOrden && (
        <Modal
          open={editModalOpen}
          onClose={closeModals}
          title="Editar Orden de Producción"
          size="md"
        >
          <form className={s.form} onSubmit={(e) => { e.preventDefault(); closeModals(); }}>
            <div className={s.formRow}>
              <div className={s.field}>
                <label className={s.label}>Operario asignado</label>
                <select className={s.select} defaultValue={selectedOrden.operario}>
                  <option>Juan Pérez</option>
                  <option>María López</option>
                  <option>Carlos Ruiz</option>
                  <option>Ana Martínez</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Estado</label>
                <select className={s.select} defaultValue={selectedOrden.estado}>
                  <option>Pendiente</option>
                  <option>En proceso</option>
                  <option>Terminado</option>
                </select>
              </div>
            </div>
            <div className={s.formActions}>
              <Button variant="secondary" type="button" onClick={closeModals}>Cancelar</Button>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
