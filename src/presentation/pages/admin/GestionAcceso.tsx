import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ToggleLeft } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './GestionAcceso.module.css';
import { Button } from '../../../shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '../../../shared/ui/DataTable';

interface Acceso {
  id: string;
  usuario: string;
  rol: string;
  modulo: string;
  permiso: string;
  fechaAsignacion: string;
  expira: string | null;
  estado: 'Activo' | 'Expirado' | 'Pendiente';
}

const mockAccesos: Acceso[] = [
  { id: 'A-001', usuario: 'Carlos Martínez', rol: 'Administrador', modulo: 'Usuarios', permiso: 'Gestión completa', fechaAsignacion: '2024-01-15', expira: null, estado: 'Activo' },
  { id: 'A-002', usuario: 'Ana López', rol: 'Asesor', modulo: 'Pedidos', permiso: 'Crear y editar', fechaAsignacion: '2024-02-20', expira: '2024-12-31', estado: 'Activo' },
  { id: 'A-003', usuario: 'María González', rol: 'Producción', modulo: 'Talleres', permiso: 'Asignación', fechaAsignacion: '2024-03-10', expira: null, estado: 'Activo' },
  { id: 'A-004', usuario: 'Luis Pérez', rol: 'Almacén', modulo: 'Inventario', permiso: 'Solo lectura', fechaAsignacion: '2024-01-25', expira: null, estado: 'Activo' },
  { id: 'A-005', usuario: 'Jorge Ruiz', rol: 'Asesor', modulo: 'Reportes', permiso: 'Visualización', fechaAsignacion: '2023-11-05', expira: '2024-05-15', estado: 'Expirado' },
];

export const AdminGestionAcceso: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAcceso, setSelectedAcceso] = useState<Acceso | null>(null);

  const filteredAccesos = useMemo(() => {
    return mockAccesos.filter(a =>
      a.usuario.toLowerCase().includes(search.toLowerCase()) ||
      a.rol.toLowerCase().includes(search.toLowerCase()) ||
      a.modulo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAcceso(null);
  };

  const columns: DataTableColumn<Acceso>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'usuario', header: 'Usuario', sortable: true },
    { key: 'rol', header: 'Rol', sortable: true },
    { key: 'modulo', header: 'Módulo', sortable: true },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Acceso> = {
    title: item => `Detalle: ${item.usuario}`,
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Módulo:</span> {item.modulo}</div>
        <div className={s.detailRow}><span>Permiso:</span> {item.permiso}</div>
        <div className={s.detailRow}><span>Fecha asignación:</span> {item.fechaAsignacion}</div>
        <div className={s.detailRow}><span>Expira:</span> {item.expira || '-'}</div>
      </div>
    ),
  };

  const actions: DataTableAction<Acceso>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => { setSelectedAcceso(item); setModalOpen(true); } },
    { label: 'Desactivar', icon: <ToggleLeft size={14} />, onClick: (item) => toast.info(item.estado === 'Activo' ? 'Acceso desactivado' : 'Acceso activado') },
    { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: () => { if (confirm(`¿Eliminar acceso?`)) toast.success('Acceso eliminado'); } },
  ];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de Acceso</h1>
          <p className={s.pageSubtitle}>Control de acceso al sistema</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Acceso
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar accesos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={filteredAccesos}
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
                {selectedAcceso ? 'Editar Acceso' : 'Nuevo Acceso'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Usuario</label>
                    <select className={s.select} defaultValue={selectedAcceso?.usuario}>
                      <option>Carlos Martínez</option>
                      <option>Ana López</option>
                      <option>Luis Pérez</option>
                      <option>María González</option>
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Rol</label>
                    <select className={s.select} defaultValue={selectedAcceso?.rol}>
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
                    <label className={s.label}>Módulo</label>
                    <select className={s.select} defaultValue={selectedAcceso?.modulo}>
                      <option>Usuarios</option>
                      <option>Inventario</option>
                      <option>Pedidos</option>
                      <option>Reportes</option>
                      <option>Producción</option>
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Tipo de Permiso</label>
                    <select className={s.select} defaultValue={selectedAcceso?.permiso}>
                      <option>Gestión completa</option>
                      <option>Crear y editar</option>
                      <option>Solo lectura</option>
                      <option>Visualización</option>
                    </select>
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Fecha de expiración</label>
                  <input type="date" className={s.input} defaultValue={selectedAcceso?.expira || ''} />
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedAcceso ? 'Guardar cambios' : 'Crear acceso'}
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
