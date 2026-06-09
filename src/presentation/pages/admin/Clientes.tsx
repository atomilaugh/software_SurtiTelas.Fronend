import React, { useState } from 'react';
import { Search, Plus, Eye, Edit } from 'lucide-react';
import s from './Clientes.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

interface Cliente {
  id: string;
  nombre: string;
  ciudad: string;
  tel: string;
  asesor: string;
  pedidos: number;
  estado: 'Activo' | 'Inactivo';
}

const mockClientes: Cliente[] = [
  { id: 'CL-001', nombre: 'Almacén El Sol', ciudad: 'Bogotá', tel: '310 234 5678', asesor: 'Camila Torres', pedidos: 34, estado: 'Activo' },
  { id: 'CL-002', nombre: 'Boutique Moda+', ciudad: 'Medellín', tel: '311 345 6789', asesor: 'Luis Herrera', pedidos: 18, estado: 'Activo' },
  { id: 'CL-003', nombre: 'Textiles Andina', ciudad: 'Cali', tel: '312 456 7890', asesor: 'Camila Torres', pedidos: 52, estado: 'Activo' },
  { id: 'CL-004', nombre: 'Moda Casual SAS', ciudad: 'Barranquilla', tel: '313 567 8901', asesor: 'Pedro Gómez', pedidos: 9, estado: 'Inactivo' },
  { id: 'CL-005', nombre: 'Confección del Valle', ciudad: 'Cali', tel: '314 567 8902', asesor: 'Luis Herrera', pedidos: 27, estado: 'Activo' },
  { id: 'CL-006', nombre: 'Telas Premium', ciudad: 'Bogotá', tel: '315 567 8903', asesor: 'Camila Torres', pedidos: 41, estado: 'Activo' },
  { id: 'CL-007', nombre: 'Moda Express', ciudad: 'Medellín', tel: '316 567 8904', asesor: 'Pedro Gómez', pedidos: 15, estado: 'Activo' },
  { id: 'CL-008', nombre: 'Estilo Único', ciudad: 'Cartagena', tel: '317 567 8905', asesor: 'Luis Herrera', pedidos: 22, estado: 'Activo' },
  { id: 'CL-009', nombre: 'Telas del Caribe', ciudad: 'Barranquilla', tel: '318 567 8906', asesor: 'Camila Torres', pedidos: 8, estado: 'Inactivo' },
  { id: 'CL-010', nombre: 'Confección Moderna', ciudad: 'Bogotá', tel: '319 567 8907', asesor: 'Pedro Gómez', pedidos: 33, estado: 'Activo' },
];

export const AdminClientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const filteredClientes = mockClientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCliente(null);
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Clientes</h1>
          <p className={s.pageSubtitle}>Gestión de clientes de la empresa</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Cliente
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar clientes..."
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
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Teléfono</th>
              <th>Asesor</th>
              <th>Pedidos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map(cliente => (
              <tr key={cliente.id}>
                <td className={s.tdMono}>{cliente.id}</td>
                <td className={s.tdPrimary}>{cliente.nombre}</td>
                <td>{cliente.ciudad}</td>
                <td>{cliente.tel}</td>
                <td>{cliente.asesor}</td>
                <td>{cliente.pedidos}</td>
                <td>
                  <Badge variant={cliente.estado === 'Activo' ? 'success' : 'default'}>
                    {cliente.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} title="Ver">
                      <Eye size={14} />
                    </button>
                    <button className={s.actionBtn} title="Editar" onClick={() => { setSelectedCliente(cliente); setModalOpen(true); }}>
                      <Edit size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={s.modalOverlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre</label>
                    <input type="text" className={s.input} defaultValue={selectedCliente?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>NIT/CC</label>
                    <input type="text" className={s.input} placeholder="Número de identificación" />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Ciudad</label>
                    <input type="text" className={s.input} defaultValue={selectedCliente?.ciudad} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Teléfono</label>
                    <input type="text" className={s.input} defaultValue={selectedCliente?.tel} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input type="email" className={s.input} placeholder="email@ejemplo.com" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Asesor asignado</label>
                    <select className={s.select}>
                      <option>Camila Torres</option>
                      <option>Luis Herrera</option>
                      <option>Pedro Gómez</option>
                    </select>
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Notas</label>
                  <textarea className={s.textarea} placeholder="Observaciones adicionales..." />
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedCliente ? 'Guardar cambios' : 'Crear cliente'}
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