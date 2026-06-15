import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Star, Phone, MapPin, Package } from 'lucide-react';
import s from './Proveedores.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/core/stores';
import { DataTable } from '@/shared/ui/DataTable';
import { Modal } from '@/shared/ui/Modal';
import type { Proveedor } from '@/core/types';

export const AdminProveedores: React.FC = () => {
  const [search, setSearch] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [saving, setSaving] = useState(false);

  const proveedores = useAppStore(s => s.proveedores);
  const createProveedor = useAppStore(s => s.createProveedor);
  const updateProveedor = useAppStore(s => s.updateProveedor);
  const deleteProveedor = useAppStore(s => s.deleteProveedor);

  const [formNombre, setFormNombre] = useState('');
  const [formNit, setFormNit] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDireccion, setFormDireccion] = useState('');
  const [formCiudad, setFormCiudad] = useState('');
  const [formMateriales, setFormMateriales] = useState('');
  const [formCalificacion, setFormCalificacion] = useState(3);
  const [formEstado, setFormEstado] = useState<Proveedor['estado']>('Activo');

  const filtered = useMemo(() => {
    return proveedores.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.nit.toLowerCase().includes(search.toLowerCase()) ||
      p.ciudad.toLowerCase().includes(search.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [proveedores, search]);

  const resetForm = () => {
    setFormNombre('');
    setFormNit('');
    setFormTelefono('');
    setFormEmail('');
    setFormDireccion('');
    setFormCiudad('');
    setFormMateriales('');
    setFormCalificacion(3);
    setFormEstado('Activo');
    setSelectedProveedor(null);
    setSaving(false);
  };

  const openCreateModal = () => {
    resetForm();
    setFormModalOpen(true);
  };

  const openEditModal = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setFormNombre(proveedor.nombre);
    setFormNit(proveedor.nit);
    setFormTelefono(proveedor.telefono);
    setFormEmail(proveedor.email);
    setFormDireccion(proveedor.direccion);
    setFormCiudad(proveedor.ciudad);
    setFormMateriales(proveedor.materiales.join(', '));
    setFormCalificacion(proveedor.calificacion);
    setFormEstado(proveedor.estado);
    setSaving(false);
    setFormModalOpen(true);
  };

  const closeModals = () => {
    setFormModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const materialesArr = formMateriales.split(',').map(m => m.trim()).filter(Boolean);

    const data = {
      nombre: formNombre,
      nit: formNit,
      telefono: formTelefono,
      email: formEmail,
      direccion: formDireccion,
      ciudad: formCiudad,
      materiales: materialesArr,
      estado: formEstado,
      calificacion: formCalificacion,
      pedidosRealizados: selectedProveedor?.pedidosRealizados ?? 0,
      ultimoPedido: selectedProveedor?.ultimoPedido,
    };

    try {
      if (selectedProveedor) {
        updateProveedor(selectedProveedor.id, data);
      } else {
        createProveedor(data);
      }
      closeModals();
    } catch {
      setSaving(false);
    }
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      deleteProveedor(id);
    }
  };

  const renderStars = (calificacion: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < calificacion ? s.starFilled : s.starEmpty}
      />
    ));
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Gestión de proveedores</h1>
          <p className={s.pageSubtitle}>Administración de proveedores</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
          Nuevo proveedor
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar por nombre, NIT, ciudad o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Proveedor>
        data={filtered}
        pageSize={10}
        emptyMessage="No se encontraron proveedores"
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="proveedores"
        maxVisibleColumns={5}
        columns={[
          { key: 'nombre', header: 'Proveedor', sortable: true, filterable: true, render: (p) => (
            <div className={s.proveedorCell}>
              <span className={s.proveedorNombre}>{p.nombre}</span>
            </div>
          )},
          { key: 'nit', header: 'NIT', width: '130px', render: (p) => <span className={s.tdMono}>{p.nit}</span> },
          { key: 'ciudad', header: 'Ciudad', render: (p) => (
            <div className={s.ubicacionCell}>
              <MapPin size={12} />
              <span>{p.ciudad}</span>
            </div>
          )},
          { key: 'telefono', header: 'Teléfono', render: (p) => (
            <div className={s.contactLine}>
              <Phone size={12} />
              <span>{p.telefono}</span>
            </div>
          )},
          { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ], render: (p) => (
            <Badge variant={p.estado === 'Activo' ? 'success' : 'default'}>{p.estado}</Badge>
          )},
        ]}
        actions={(p) => [
          { label: 'Editar', icon: <Edit size={14} />, onClick: () => openEditModal(p) },
          { label: 'Eliminar', icon: <Trash2 size={14} />, onClick: () => handleEliminar(p.id), danger: true },
        ]}
        detailPanel={{
          title: (p) => `Proveedor: ${p.nombre}`,
          render: (p, onClose) => (
            <div className={s.detailModalContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Información básica</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>NIT</span><span>{p.nit}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Pedidos</span><span>{p.pedidosRealizados}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Calificación</span><span className={s.starsCell}>{renderStars(p.calificacion)}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Contacto</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>Teléfono</span><span>{p.telefono}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Email</span><span>{p.email}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Dirección</span><span>{p.direccion}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Materiales</h4>
                <div className={s.chipsCell}>
                  {p.materiales.slice(0, 4).map((m, i) => (
                    <span key={i} className={s.chip}>{m}</span>
                  ))}
                </div>
              </div>
              <div className={s.modalActions}>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          ),
        }}
      />

      <Modal
        open={formModalOpen}
        onClose={closeModals}
        title={selectedProveedor ? 'Editar proveedor' : 'Nuevo proveedor'}
        size="lg"
      >
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Nombre / Razón social</label>
              <input
                type="text"
                className={s.input}
                value={formNombre}
                onChange={e => setFormNombre(e.target.value)}
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>NIT</label>
              <input
                type="text"
                className={s.input}
                value={formNit}
                onChange={e => setFormNit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Teléfono</label>
              <input
                type="text"
                className={s.input}
                value={formTelefono}
                onChange={e => setFormTelefono(e.target.value)}
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Email</label>
              <input
                type="email"
                className={s.input}
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Ciudad</label>
              <input
                type="text"
                className={s.input}
                value={formCiudad}
                onChange={e => setFormCiudad(e.target.value)}
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Dirección</label>
              <input
                type="text"
                className={s.input}
                value={formDireccion}
                onChange={e => setFormDireccion(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>Materiales / Servicios (separados por coma)</label>
            <div className={s.inputWithIcon}>
              <Package size={14} className={s.inputIcon} />
              <input
                type="text"
                className={s.input}
                value={formMateriales}
                onChange={e => setFormMateriales(e.target.value)}
                placeholder="Algodón, Poliéster, Hilos..."
              />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Calificación (1 a 5)</label>
              <div className={s.ratingRow}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formCalificacion}
                  onChange={e => setFormCalificacion(Number(e.target.value))}
                  className={s.ratingInput}
                />
                <span className={s.ratingValue}>{formCalificacion}</span>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Estado</label>
              <select
                className={s.select}
                value={formEstado}
                onChange={e => setFormEstado(e.target.value as Proveedor['estado'])}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className={s.formActions}>
            <Button type="button" variant="secondary" onClick={closeModals} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {selectedProveedor ? 'Guardar cambios' : 'Crear proveedor'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

