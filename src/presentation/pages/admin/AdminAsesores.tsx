import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, User, Users, BarChart3, Calendar } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './AdminAsesores.module.css';
import { Button } from '../../../shared/ui/Button';
import { DataTable, DataTableColumn, DataTableAction, DataTableDetailPanel } from '../../../shared/ui/DataTable';

interface Asesor {
  id: string;
  nombre: string;
  email: string;
  tel: string;
  clientes: number;
  comisiones: string;
  estado: 'Activo' | 'Inactivo';
}

const mockAsesoresInicial: Asesor[] = [
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
  const [items, setItems] = useState<Asesor[]>(mockAsesoresInicial);

  const formRef = useRef<HTMLFormElement>(null);

  const filteredAsesores = items.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitAsesor = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nombre = String(fd.get('nombre') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const tel = String(fd.get('tel') ?? '').trim();
    const estado = (String(fd.get('estado') ?? 'Activo') || 'Activo') as Asesor['estado'];
    if (selectedAsesor) {
      setItems(prev => prev.map(it => it.id === selectedAsesor.id ? { ...it, nombre, email, tel, estado } : it));
      toast.success('Asesor actualizado');
    } else {
      const nuevo: Asesor = {
        id: `AS-${String(items.length + 1).padStart(3, '0')}`,
        nombre,
        email,
        tel,
        clientes: 0,
        comisiones: '$0',
        estado,
      };
      setItems(prev => [nuevo, ...prev]);
      toast.success('Asesor creado');
    }
    setModalOpen(false);
    setSelectedAsesor(null);
  };

  const columns: DataTableColumn<Asesor>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'clientes', header: 'Clientes', sortable: true, align: 'right' },
    { key: 'estado', header: 'Estado', sortable: true },
  ];

  const detailPanel: DataTableDetailPanel<Asesor> = {
    title: item => `Detalle: ${item.nombre}`,
    size: 'lg',
    header: item => ({
      icon: <User size={18} />,
      title: 'Asesor comercial',
      code: item.id,
      subtitle: item.email,
      meta: `${item.clientes} clientes activos`,
      status: item.estado,
      badgeVariant: item.estado === 'Activo' ? 'success' : 'default',
    }),
    kpis: item => [
      { label: 'Clientes', value: item.clientes, icon: <Users size={16} />, tone: 'primary' },
      { label: 'Comisiones', value: item.comisiones, icon: <BarChart3 size={16} />, tone: 'success' },
      { label: 'Estado', value: item.estado, icon: <Calendar size={16} />, tone: item.estado === 'Activo' ? 'success' : 'default' },
    ],
    render: (item) => (
      <div className={s.detailPanel}>
        <div className={s.detailRow}><span>Teléfono:</span> {item.tel}</div>
        <div className={s.detailRow}><span>Comisiones:</span> {item.comisiones}</div>
        <div className={s.detailRow}><span>Email:</span> {item.email}</div>
        <div className={s.detailRow}><span>Clientes:</span> {item.clientes}</div>
      </div>
    ),
  };

  const actions: DataTableAction<Asesor>[] = [
    { label: 'Editar', icon: <Edit size={14} />, onClick: (item) => { setSelectedAsesor(item); setModalOpen(true); toast.info('Editar asesor'); } },
  ];

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
        <SearchInput
          placeholder="Buscar asesores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        <DataTable
          data={filteredAsesores}
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
        <div className={s.modalOverlay} onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {selectedAsesor ? 'Editar Asesor' : 'Nuevo Asesor'}
              </h2>
              <button className={s.closeBtn} onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>×</button>
            </div>
            <div className={s.modalBody}>
              <form className={s.form} ref={formRef}>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Nombre</label>
                    <input type="text" className={s.input} name="nombre" defaultValue={selectedAsesor?.nombre} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input type="email" className={s.input} name="email" defaultValue={selectedAsesor?.email} />
                  </div>
                </div>
                <div className={s.formRow}>
                  <div className={s.field}>
                    <label className={s.label}>Teléfono</label>
                    <input type="text" className={s.input} name="tel" defaultValue={selectedAsesor?.tel} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Estado</label>
                    <select className={s.select} name="estado" defaultValue={selectedAsesor?.estado}>
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className={s.formActions}>
                  <Button variant="secondary" onClick={() => { setModalOpen(false); setSelectedAsesor(null); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitAsesor}>
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

