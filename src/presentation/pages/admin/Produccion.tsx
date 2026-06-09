import React, { useState } from 'react';
import { Search } from 'lucide-react';
import s from './Produccion.module.css';
import { Badge } from '../../../shared/ui/Badge';

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

const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  'Pendiente': 'warning',
  'En proceso': 'info',
  'Terminado': 'success',
};

export const AdminProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null);

  const filtered = mockOrdenes.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.pedido.toLowerCase().includes(search.toLowerCase())
  );

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedOrden(null);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Producción</h1>
      <p className={s.pageSubtitle}>Órdenes de producción activas</p>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar órdenes..."
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
              <th>ID Orden</th>
              <th>Pedido</th>
              <th>Operario</th>
              <th>Referencia</th>
              <th>Cantidad</th>
              <th>F. Inicio</th>
              <th>F. Estimada</th>
              <th>Avance</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(orden => (
              <tr key={orden.id}>
                <td className={s.tdMono}>{orden.id}</td>
                <td className={s.tdPrimary}>{orden.pedido}</td>
                <td>{orden.operario}</td>
                <td>{orden.referencia}</td>
                <td>{orden.cantidad}</td>
                <td>{orden.fechaInicio || '-'}</td>
                <td>{orden.fechaEstimada}</td>
                <td>
                  <div className={s.progressBar}>
                    <div className={s.progressFill} style={{ width: `${orden.avance}%` }} />
                  </div>
                </td>
                <td>
                  <Badge variant={statusMap[orden.estado]}>
                    {orden.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} onClick={() => { setSelectedOrden(orden); setViewModalOpen(true); }}>Ver</button>
                    <button className={s.actionBtn} onClick={() => { setSelectedOrden(orden); setEditModalOpen(true); }}>Editar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ver Orden */}
      {viewModalOpen && selectedOrden && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Detalle de Orden</h2>
              <button className={s.closeBtn} onClick={closeModals}>×</button>
            </div>
            <div className={s.modalBody}>
              <div className={s.detailRow}><span>ID:</span> {selectedOrden.id}</div>
              <div className={s.detailRow}><span>Pedido:</span> {selectedOrden.pedido}</div>
              <div className={s.detailRow}><span>Operario:</span> {selectedOrden.operario}</div>
              <div className={s.detailRow}><span>Referencia:</span> {selectedOrden.referencia}</div>
              <div className={s.detailRow}><span>Cantidad:</span> {selectedOrden.cantidad}</div>
              <div className={s.detailRow}><span>Fecha inicio:</span> {selectedOrden.fechaInicio || '-'}</div>
              <div className={s.detailRow}><span>Fecha estimada:</span> {selectedOrden.fechaEstimada}</div>
              <div className={s.detailRow}><span>Estado:</span> <Badge variant={statusMap[selectedOrden.estado]}>{selectedOrden.estado}</Badge></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Orden */}
      {editModalOpen && selectedOrden && (
        <div className={s.modalOverlay} onClick={closeModals}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>Editar Orden de Producción</h2>
              <button className={s.closeBtn} onClick={closeModals}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.field}>
                  <label className={s.label}>Operario asignado</label>
                  <select className={s.input} defaultValue={selectedOrden.operario}>
                    <option>Juan Pérez</option>
                    <option>María López</option>
                    <option>Carlos Ruiz</option>
                    <option>Ana Martínez</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Estado</label>
                  <select className={s.input} defaultValue={selectedOrden.estado}>
                    <option>Pendiente</option>
                    <option>En proceso</option>
                    <option>Terminado</option>
                  </select>
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
    </div>
  );
};