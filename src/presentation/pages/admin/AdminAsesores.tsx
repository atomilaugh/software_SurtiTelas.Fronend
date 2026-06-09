import React, { useState } from 'react';
import { Search, Plus, Eye, Edit } from 'lucide-react';
import s from './AdminAsesores.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

interface Asesor {
  id: string;
  nombre: string;
  email: string;
  tel: string;
  clientes: number;
  comisiones: string;
  estado: 'Activo' | 'Inactivo';
}

const mockAsesores: Asesor[] = [
  { id: 'AS-001', nombre: 'Camila Torres', email: 'camila@surtitelas.com', tel: '310 234 5678', clientes: 24, comisiones: '$4.2M', estado: 'Activo' },
  { id: 'AS-002', nombre: 'Luis Herrera', email: 'luis@surtitelas.com', tel: '311 345 6789', clientes: 18, comisiones: '$2.8M', estado: 'Activo' },
  { id: 'AS-003', nombre: 'Pedro Gómez', email: 'pedro@surtitelas.com', tel: '312 456 7890', clientes: 12, comisiones: '$1.9M', estado: 'Activo' },
  { id: 'AS-004', nombre: 'María Ruiz', email: 'maria@surtitelas.com', tel: '313 567 8901', clientes: 8, comisiones: '$1.2M', estado: 'Inactivo' },
  { id: 'AS-005', nombre: 'Jorge Sánchez', email: 'jorge@surtitelas.com', tel: '314 567 8902', clientes: 15, comisiones: '$3.1M', estado: 'Activo' },
];

export const AdminAsesores: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsesor, setSelectedAsesor] = useState<Asesor | null>(null);

  const filteredAsesores = mockAsesores.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Asesores</h1>
          <p className={s.pageSubtitle}>Gestión del equipo de asesores comerciales</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Asesor
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar asesores..."
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
              <th>Email</th>
              <th>Teléfono</th>
              <th>Clientes</th>
              <th>Comisiones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAsesores.map(asesor => (
              <tr key={asesor.id}>
                <td className={s.tdMono}>{asesor.id}</td>
                <td className={s.tdPrimary}>{asesor.nombre}</td>
                <td>{asesor.email}</td>
                <td>{asesor.tel}</td>
                <td>{asesor.clientes}</td>
                <td className={s.tdMoney}>{asesor.comisiones}</td>
                <td>
                  <Badge variant={asesor.estado === 'Activo' ? 'info' : 'default'}>
                    {asesor.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} title="Ver">
                      <Eye size={14} />
                    </button>
                    <button className={s.actionBtn} title="Editar" onClick={() => { setSelectedAsesor(asesor); setModalOpen(true); }}>
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
        <div className={s.modalOverlay} onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedAsesor ? 'Editar Asesor' : 'Nuevo Asesor'}
              </h2>
              <button className={s.closeBtn} onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre</label>
                    <input type="text" className={s.input} defaultValue={selectedAsesor?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input type="email" className={s.input} defaultValue={selectedAsesor?.email} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Teléfono</label>
                    <input type="text" className={s.input} defaultValue={selectedAsesor?.tel} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Estado</label>
                    <select className={s.select} defaultValue={selectedAsesor?.estado}>
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>
                    Cancelar
                  </Button>
                  <Button onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>
                    {selectedAsesor ? 'Guardar cambios' : 'Crear asesor'}
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