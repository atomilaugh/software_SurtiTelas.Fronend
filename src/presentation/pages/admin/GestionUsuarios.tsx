import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, User, ShieldCheck, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import s from './GestionUsuarios.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Button } from '@/shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '@/shared/ui/DataTable';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
  fechaRegistro: string;
}

const mockUsuarios: Usuario[] = [
  { id: 'U-001', nombre: 'Carlos Martínez', email: 'carlos.martinez@surtitelas.com', telefono: '310 123 4567', rol: 'Administrador', estado: 'Activo', fechaRegistro: '2024-01-15' },
  { id: 'U-002', nombre: 'Ana López', email: 'ana.lopez@surtitelas.com', telefono: '311 234 5678', rol: 'Asesor', estado: 'Activo', fechaRegistro: '2024-02-20' },
  { id: 'U-003', nombre: 'Luis Pérez', email: 'luis.perez@surtitelas.com', telefono: '312 345 6789', rol: 'Almacén', estado: 'Activo', fechaRegistro: '2024-03-10' },
  { id: 'U-004', nombre: 'María González', email: 'maria.gonzalez@surtitelas.com', telefono: '313 456 7890', rol: 'Producción', estado: 'Activo', fechaRegistro: '2024-01-25' },
  { id: 'U-005', nombre: 'Jorge Ruiz', email: 'jorge.ruiz@surtitelas.com', telefono: '314 567 8901', rol: 'Reportes', estado: 'Inactivo', fechaRegistro: '2023-11-05' },
  { id: 'U-006', nombre: 'Camila Torres', email: 'camila.torres@surtitelas.com', telefono: '315 678 9012', rol: 'Asesor', estado: 'Activo', fechaRegistro: '2024-04-12' },
];

export const AdminGestionUsuarios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const filteredUsuarios = useMemo(() => {
    return mockUsuarios.filter(u =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.rol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
  };

  const columns: DataTableColumn<Usuario>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'rol', header: 'Rol', sortable: true },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Usuario> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'lg',
    header: item => ({
      icon: <User size={18} />,
      title: 'Usuario del sistema',
      code: item.id,
      subtitle: item.email,
      meta: item.fechaRegistro,
      status: item.estado,
      badgeVariant: item.estado === 'Activo' ? 'success' : 'default',
    }),
    kpis: item => [
      { label: 'Rol', value: item.rol, icon: <ShieldCheck size={16} />, tone: 'primary' },
      { label: 'Fecha registro', value: item.fechaRegistro, icon: <Calendar size={16} />, tone: 'default' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Teléfono:</span> {item.telefono}</div>
        <div className={s.detailRow}><span>Email:</span> {item.email}</div>
        <div className={s.detailRow}><span>Rol:</span> {item.rol}</div>
        <div className={s.detailRow}><span>Fecha registro:</span> {item.fechaRegistro}</div>
      </div>
    ),
  };

  const actions = ((item: Usuario): DataTableAction<Usuario>[] => [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (i) => { setSelectedUsuario(i); setModalOpen(true); } },
    { label: 'Activar/Desactivar', icon: <ToggleLeft size={14} />, onClick: () => toast.info(item.estado === 'Activo' ? 'Usuario desactivado' : 'Usuario activado') },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: () => { if (confirm(`¿Eliminar usuario ${item.nombre}?`)) toast.success('Usuario eliminado'); } },
  ]) as DataTableAction<Usuario>[] | ((item: Usuario) => DataTableAction<Usuario>[]);

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de Usuarios</h1>
          <p className={s.pageSubtitle}>Administración de usuarios del sistema</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Usuario
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={filteredUsuarios}
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

      {modalOpen && (
        <div className={s.modalOverlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre completo</label>
                    <input type="text" className={s.input} defaultValue={selectedUsuario?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Rol</label>
                    <select className={s.select} defaultValue={selectedUsuario?.rol}>
                      <option>Administrador</option>
                      <option>Asesor</option>
                      <option>Almacén</option>
                      <option>Producción</option>
                      <option>Reportes</option>
                    </select>
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input type="email" className={s.input} defaultValue={selectedUsuario?.email} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Teléfono</label>
                    <input type="tel" className={s.input} defaultValue={selectedUsuario?.telefono} />
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedUsuario ? 'Guardar cambios' : 'Crear usuario'}
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

