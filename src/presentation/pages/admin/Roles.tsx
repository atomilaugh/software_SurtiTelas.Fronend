import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Shield, Check, Trash2, ToggleLeft } from 'lucide-react';
import s from './Roles.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useDelegatedTooltips } from '@/shared/components/Tooltip';

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  usuarios: number;
  estado: 'Activo' | 'Inactivo';
}

const mockRolesInicial: Rol[] = [
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
  const [items, setItems] = useState<Rol[]>(mockRolesInicial);

  const tableRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useDelegatedTooltips(tableRef, { placement: 'top' });

  const filteredRoles = items.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRol(null);
  };

  const handleSubmitRol = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nombre = String(fd.get('nombre') ?? '').trim();
    const descripcion = String(fd.get('descripcion') ?? '').trim();
    const permisos = fd.getAll('permisos') as string[];
    if (selectedRol) {
      setItems(prev => prev.map(it => it.id === selectedRol.id ? { ...it, nombre, descripcion, permisos } : it));
      toast.success('Rol actualizado');
    } else {
      const nuevo: Rol = {
        id: `R-${String(items.length + 1).padStart(3, '0')}`,
        nombre,
        descripcion,
        permisos,
        usuarios: 0,
        estado: 'Activo',
      };
      setItems(prev => [nuevo, ...prev]);
      toast.success('Rol creado');
    }
    handleCloseModal();
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

      <div className={s.tableWrapper} ref={tableRef}>
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
                    <button className={s.actionBtn} data-bs-toggle="tooltip" data-bs-title="Editar" onClick={() => { setSelectedRol(rol); setModalOpen(true); }}>
                        <Edit size={14} />
                      </button>
                      <button className={`${s.actionBtn} ${s.actionBtnToggle}`} data-bs-toggle="tooltip" data-bs-title={rol.estado === 'Activo' ? 'Desactivar' : 'Activar'} onClick={() => toast.info('Rol actualizado')}>
                        <ToggleLeft size={14} />
                      </button>
                      <button className={`${s.actionBtn} ${s.actionBtnDanger}`} data-bs-toggle="tooltip" data-bs-title="Eliminar" onClick={() => { if (confirm(`¿Eliminar rol?`)) toast.success('Rol eliminado'); }}>
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
              <form className={s.form} ref={formRef}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre del Rol</label>
                    <input type="text" className={s.input} name="nombre" defaultValue={selectedRol?.nombre} />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Descripción</label>
                  <textarea className={s.textarea} placeholder="Descripción del rol..." name="descripcion" defaultValue={selectedRol?.descripcion} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Permisos</label>
                  <div className={s.permisosGrid}>
                    {['Gestión usuarios', 'Gestión inventario', 'Reportes', 'Configuración', 'Ver clientes', 'Crear pedidos', 'Facturación', 'Alertas stock'].map(permiso => (
                      <label key={permiso} className={s.permisoCheckbox}>
                        <input type="checkbox" name="permisos" value={permiso.toLowerCase()} defaultChecked={selectedRol?.permisos.includes(permiso.toLowerCase())} />
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
                  <Button onClick={handleSubmitRol}>
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