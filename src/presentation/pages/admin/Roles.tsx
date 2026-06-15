import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Shield, Check, Trash2, ToggleLeft } from 'lucide-react';
import s from './Roles.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  usuarios: number;
  estado: 'Activo' | 'Inactivo';
}

const mockRoles: Rol[] = [
  { id: 'R-001', nombre: 'Administrador', descripcion: 'Acceso completo al sistema', permisos: ['gestión usuarios', 'gestión inventario', 'reportes', 'configuración'], usuarios: 2, estado: 'Activo' },
  { id: 'R-002', nombre: 'Asesor', descripcion: 'Gestión de clientes y pedidos', permisos: ['ver clientes', 'crear pedidos', 'facturación'], usuarios: 8, estado: 'Activo' },
  { id: 'R-003', nombre: 'Almacén', descripcion: 'Gestión de inventario y stock', permisos: ['gestión insumos', 'alertas stock', 'control entradas/salidas'], usuarios: 4, estado: 'Activo' },
  { id: 'R-004', nombre: 'Producción', descripcion: 'Acceso a módulos de producción', permisos: ['registro talleres', 'asignación producción', 'seguimiento'], usuarios: 3, estado: 'Activo' },
  { id: 'R-005', nombre: 'Reportes', descripcion: 'Solo visualización de reportes', permisos: ['ver reportes'], usuarios: 1, estado: 'Inactivo' },
];

export const AdminRoles: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  const filteredRoles = mockRoles.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRol(null);
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Roles</h1>
          <p className={s.pageSubtitle}>Gestión de roles y permisos del sistema</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Rol
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Usuarios</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(rol => (
              <tr key={rol.id}>
                <td className={s.tdMono}>{rol.id}</td>
                <td className={s.tdPrimary}>{rol.nombre}</td>
                <td>{rol.descripcion}</td>
                <td>
                  <div className={s.permisosList}>
                    {rol.permisos.map((permiso, idx) => (
                      <span key={idx} className={s.permisoTag}>
                        <Shield size={12} />
                        {permiso}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{rol.usuarios}</td>
                <td>
                  <Badge variant={rol.estado === 'Activo' ? 'success' : 'default'}>
                    {rol.estado}
                  </Badge>
                </td>
<td>
                   <div className={s.actions}>
                     <button className={s.actionBtn} title="Editar" onClick={() => { setSelectedRol(rol); setModalOpen(true); }}>
                       <Edit size={14} />
                     </button>
                     <button className={`${s.actionBtn} ${s.actionBtnToggle}`} title={rol.estado === 'Activo' ? 'Desactivar' : 'Activar'} onClick={() => toast.info('Rol actualizado')}>
                       <ToggleLeft size={14} />
                     </button>
                     <button className={`${s.actionBtn} ${s.actionBtnDanger}`} title="Eliminar" onClick={() => { if (confirm(`¿Eliminar rol?`)) toast.success('Rol eliminado'); }}>
                       <Trash2 size={14} />
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
                {selectedRol ? 'Editar Rol' : 'Nuevo Rol'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre del Rol</label>
                    <input type="text" className={s.input} defaultValue={selectedRol?.nombre} />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Descripción</label>
                  <textarea className={s.textarea} placeholder="Descripción del rol..." defaultValue={selectedRol?.descripcion} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Permisos</label>
                  <div className={s.permisosGrid}>
                    {['Gestión usuarios', 'Gestión inventario', 'Reportes', 'Configuración', 'Ver clientes', 'Crear pedidos', 'Facturación', 'Alertas stock'].map(permiso => (
                      <label key={permiso} className={s.permisoCheckbox}>
                        <input type="checkbox" defaultChecked={selectedRol?.permisos.includes(permiso.toLowerCase())} />
                        <Check size={14} className={s.checkIcon} />
                        <span>{permiso}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedRol ? 'Guardar cambios' : 'Crear rol'}
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