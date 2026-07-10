import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ToggleLeft, Shield, User, Truck } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Permisos.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { useDelegatedTooltips } from '@/shared/components/Tooltip';

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  tipo: 'Lectura' | 'Escritura' | 'Administrador';
  roles: number;
  estado: 'Activo' | 'Inactivo';
  rolesAsignados: string[];
}

const rolLabels: Record<string, string> = {
  admin: 'Administrador',
  asesor: 'Asesor',
  domiciliario: 'Domiciliario',
  cliente: 'Cliente',
};

const mockPermisosInicial: Permiso[] = [
  { id: 'P-001', nombre: 'Gestión de usuarios', descripcion: 'Crear, editar y eliminar usuarios', modulo: 'Usuarios', tipo: 'Administrador', roles: 2, estado: 'Activo', rolesAsignados: ['admin'] },
  { id: 'P-002', nombre: 'Ver usuarios', descripcion: 'Visualizar lista de usuarios', modulo: 'Usuarios', tipo: 'Lectura', roles: 4, estado: 'Activo', rolesAsignados: ['admin', 'asesor', 'domiciliario'] },
  { id: 'P-003', nombre: 'Gestión de insumos', descripcion: 'Crear y editar insumos', modulo: 'Inventario', tipo: 'Escritura', roles: 2, estado: 'Activo', rolesAsignados: ['admin', 'asesor'] },
  { id: 'P-004', nombre: 'Alertas stock', descripcion: 'Configurar notificaciones de stock', modulo: 'Inventario', tipo: 'Lectura', roles: 3, estado: 'Activo', rolesAsignados: ['admin', 'asesor', 'domiciliario'] },
  { id: 'P-005', nombre: 'Ver reportes', descripcion: 'Acceso a visualización de reportes', modulo: 'Reportes', tipo: 'Lectura', roles: 5, estado: 'Activo', rolesAsignados: ['admin', 'asesor', 'domiciliario'] },
  { id: 'P-006', nombre: 'Editar reportes', descripcion: 'Modificar reportes generados', modulo: 'Reportes', tipo: 'Escritura', roles: 1, estado: 'Inactivo', rolesAsignados: ['admin'] },
];

export const AdminPermisos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
  const [items, setItems] = useState<Permiso[]>(mockPermisosInicial);

  const tableRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useDelegatedTooltips(tableRef, { placement: 'top' });

  const filteredPermisos = items.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    p.modulo.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPermiso(null);
  };

  const handleSubmitPermiso = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nombre = String(fd.get('nombre') ?? '').trim();
    const descripcion = String(fd.get('descripcion') ?? '').trim();
    const modulo = String(fd.get('modulo') ?? '').trim();
    const tipo = (String(fd.get('tipo') ?? '') || 'Lectura') as Permiso['tipo'];
    const rolesAsignados = fd.getAll('roles') as string[];
    if (selectedPermiso) {
      setItems(prev => prev.map(it => it.id === selectedPermiso.id ? { ...it, nombre, descripcion, modulo, tipo, rolesAsignados } : it));
      toast.success('Permiso actualizado');
    } else {
      const nuevo: Permiso = {
        id: `P-${String(items.length + 1).padStart(3, '0')}`,
        nombre,
        descripcion,
        modulo,
        tipo,
        roles: rolesAsignados.length,
        estado: 'Activo',
        rolesAsignados,
      };
      setItems(prev => [nuevo, ...prev]);
      toast.success('Permiso creado');
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Permisos</h1>
          <p className={s.pageSubtitle}>Gestión de permisos del sistema</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Permiso
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar permisos..."
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
              <th>Módulo</th>
              <th>Tipo</th>
              <th>Roles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermisos.map(permiso => (
              <tr key={permiso.id}>
                <td className={s.tdMono}>{permiso.id}</td>
                <td className={s.tdPrimary}>{permiso.nombre}</td>
                <td>{permiso.descripcion}</td>
                <td>{permiso.modulo}</td>
                <td>
                  <Badge variant={
                    permiso.tipo === 'Administrador' ? 'success' :
                    permiso.tipo === 'Escritura' ? 'warning' : 'default'
                  }>
                    {permiso.tipo}
                  </Badge>
                </td>
                <td>
                  <div className={s.rolesInline}>
                    {permiso.rolesAsignados.map(rol => (
                      <Badge key={rol} variant="outline" dot={rol === 'admin'}>
                        {rolLabels[rol]}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>
                  <Badge variant={permiso.estado === 'Activo' ? 'success' : 'default'}>
                    {permiso.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} data-bs-toggle="tooltip" data-bs-title="Editar" onClick={() => { setSelectedPermiso(permiso); setModalOpen(true); }}>
                       <Edit size={14} />
                     </button>
                     <button className={`${s.actionBtn} ${s.actionBtnToggle}`} data-bs-toggle="tooltip" data-bs-title={permiso.estado === 'Activo' ? 'Desactivar' : 'Activar'} onClick={() => toast.info('Permiso actualizado')}>
                       <ToggleLeft size={14} />
                     </button>
                     <button className={`${s.actionBtn} ${s.actionBtnDanger}`} data-bs-toggle="tooltip" data-bs-title="Eliminar" onClick={() => { if (confirm(`¿Eliminar permiso?`)) toast.success('Permiso eliminado'); }}>
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
                {selectedPermiso ? 'Editar Permiso' : 'Nuevo Permiso'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form} ref={formRef}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre del Permiso</label>
                    <input type="text" className={s.input} name="nombre" defaultValue={selectedPermiso?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Módulo</label>
                    <select className={s.select} name="modulo" defaultValue={selectedPermiso?.modulo}>
                      <option>Usuarios</option>
                      <option>Inventario</option>
                      <option>Reportes</option>
                      <option>Producción</option>
                      <option>Ventas</option>
                    </select>
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Descripción</label>
                  <textarea className={s.textarea} placeholder="Descripción del permiso..." name="descripcion" defaultValue={selectedPermiso?.descripcion} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Tipo de permiso</label>
                  <div className={s.tipoOptions}>
                    {['Lectura', 'Escritura', 'Administrador'].map(tipo => (
                      <label key={tipo} className={s.tipoRadio}>
                        <input type="radio" name="tipo" value={tipo} defaultChecked={selectedPermiso?.tipo === tipo} />
                        <span>{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Roles con acceso</label>
                  <div className={s.rolesCheckboxGroup}>
                    {(['admin', 'asesor', 'domiciliario', 'cliente'] as const).map(rol => (
                      <label key={rol} className={s.rolesCheckbox}>
                          <input
                            type="checkbox"
                            name="roles"
                            value={rol}
                            defaultChecked={selectedPermiso?.rolesAsignados.includes(rol)}
                          />
                        <span className={s.rolesLabel}>
                          {rol === 'admin' && <Shield size={14} />}
                          {rol === 'asesor' && <User size={14} />}
                          {rol === 'domiciliario' && <Truck size={14} />}
                          {rol === 'cliente' && <User size={14} />}
                          {rolLabels[rol]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitPermiso}>
                    {selectedPermiso ? 'Guardar cambios' : 'Crear permiso'}
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