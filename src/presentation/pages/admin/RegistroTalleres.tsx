import React, { useState } from 'react';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, ToggleLeft, Factory, Phone } from 'lucide-react';
import s from './RegistroTalleres.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface Taller {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  capacidad: number;
  ocupacion: number;
  estado: 'Activo' | 'Inactivo';
}

const mockTalleres: Taller[] = [
  { id: 'T-001', nombre: 'Taller Textil El Progreso', contacto: 'Roberto Sánchez', telefono: '310 234 5678', email: 'progreso@textil.com', direccion: 'Cra 45 # 120-35', ciudad: 'Bogotá', capacidad: 100, ocupacion: 75, estado: 'Activo' },
  { id: 'T-002', nombre: 'Confección Martínez', contacto: 'Laura Martínez', telefono: '311 345 6789', email: 'martinez@confeccion.com', direccion: 'Cl 30 # 45-60', ciudad: 'Medellín', capacidad: 80, ocupacion: 60, estado: 'Activo' },
  { id: 'T-003', nombre: 'Taller San José', contacto: 'Carlos Pérez', telefono: '312 456 7890', email: 'sanjose@taller.com', direccion: 'Av 7 # 23-45', ciudad: 'Cali', capacidad: 120, ocupacion: 90, estado: 'Activo' },
  { id: 'T-004', nombre: 'Artesanías del Valle', contacto: 'María González', telefono: '313 567 8901', email: 'artesanias@valle.com', direccion: 'Cl 15 # 30-20', ciudad: 'Barranquilla', capacidad: 50, ocupacion: 30, estado: 'Activo' },
  { id: 'T-005', nombre: 'Taller Rápido', contacto: 'Jorge Ruiz', telefono: '314 567 8902', email: 'rapido@taller.com', direccion: 'Cra 8 # 12-30', ciudad: 'Bogotá', capacidad: 200, ocupacion: 0, estado: 'Inactivo' },
];

export const AdminRegistroTalleres: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);

  const filteredTalleres = mockTalleres.filter(t =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    t.contacto.toLowerCase().includes(search.toLowerCase()) ||
    t.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTaller(null);
  };

  const handleToggleEstado = (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    toast.success(`Taller ${id} cambiado a estado: ${nuevoEstado}`);
  };

  const handleEliminar = (id: string) => {
    if (confirm(`¿Está seguro de eliminar el taller ${id}?`)) {
      toast.success(`Taller ${id} eliminado`);
    }
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Registro de Talleres</h1>
          <p className={s.pageSubtitle}>Gestión de talleres externos</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Taller
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar talleres..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Taller>
        data={filteredTalleres}
        pageSize={10}
        emptyMessage="No se encontraron talleres"
actions={(t) => [
          ...(t.estado === 'Activo' ? [{ label: 'Desactivar', icon: <ToggleLeft size={14} />, onClick: () => toast.success('Taller desactivado') }] : [{ label: 'Activar', icon: <ToggleLeft size={14} />, onClick: () => toast.success('Taller activado') }]),
          { label: 'Editar', icon: <Edit size={14} />, onClick: () => toast.info('Editar taller') },
          { label: 'Eliminar', icon: <Trash2 size={14} />, danger: true, onClick: () => { if (confirm('¿Eliminar taller?')) toast.success('Taller eliminado'); } },
        ]}
        columns={[
          { key: 'nombre', header: 'Taller', width: '240px', render: (t) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[var(--color-text-primary)]">{t.nombre}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{t.contacto}</span>
            </div>
          )},
          { key: 'ciudad', header: 'Ubicación', width: '200px', render: (t) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{t.ciudad}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{t.direccion}</span>
            </div>
          )},
          { key: 'telefono', header: 'Contacto', width: '180px', render: (t) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-[var(--color-text-primary)]">{t.telefono}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{t.email}</span>
            </div>
          )},
          { key: 'ocupacion', header: 'Ocupación', width: '160px', render: (t) => (
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-elevated)]">
                <div className="h-1.5 rounded-full bg-[var(--color-accent)]" style={{ width: `${(t.ocupacion / t.capacidad) * 100}%` }} />
              </div>
              <span className="text-xs text-[var(--color-text-secondary)]">{t.ocupacion} / {t.capacidad}</span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '100px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ], render: (t) => (
            <Badge variant={t.estado === 'Activo' ? 'success' : 'default'}>
              {t.estado}
            </Badge>
          )},
        ]}
      />

      {modalOpen && (
        <div className={s.modalOverlay} onClick={handleCloseModal}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedTaller ? 'Editar Taller' : 'Nuevo Taller'}
              </h2>
              <button className={s.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre del Taller</label>
                    <input type="text" className={s.input} defaultValue={selectedTaller?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Contacto</label>
                    <input type="text" className={s.input} defaultValue={selectedTaller?.contacto} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Teléfono</label>
                    <input type="tel" className={s.input} defaultValue={selectedTaller?.telefono} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input type="email" className={s.input} defaultValue={selectedTaller?.email} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Dirección</label>
                    <input type="text" className={s.input} defaultValue={selectedTaller?.direccion} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Ciudad</label>
                    <input type="text" className={s.input} defaultValue={selectedTaller?.ciudad} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Capacidad</label>
                    <input type="number" className={s.input} defaultValue={selectedTaller?.capacidad} />
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloseModal}>
                    {selectedTaller ? 'Guardar cambios' : 'Crear taller'}
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
