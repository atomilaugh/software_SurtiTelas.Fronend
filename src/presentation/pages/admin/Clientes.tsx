import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Edit } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Clientes.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';

interface Cliente {
  id: string;
  nombre: string;
  ciudad: string;
  tel: string;
  asesor: string;
  pedidos: number;
  estado: 'Activo' | 'Inactivo';
  email?: string;
  direccion?: string;
  observaciones?: string;
  isTrustedCustomer?: boolean;
}

const mockClientesInicial: Cliente[] = [
  { id: 'CL-001', nombre: 'Almacén El Sol', ciudad: 'Bogotá', tel: '310 234 5678', asesor: 'Camila Torres', pedidos: 34, estado: 'Activo', email: 'contacto@alsol.com', isTrustedCustomer: true },
  { id: 'CL-002', nombre: 'Boutique Moda+', ciudad: 'Medellín', tel: '311 345 6789', asesor: 'Luis Herrera', pedidos: 18, estado: 'Activo', email: 'info@modaplus.co', isTrustedCustomer: false },
  { id: 'CL-003', nombre: 'Textiles Andina', ciudad: 'Cali', tel: '312 456 7890', asesor: 'Camila Torres', pedidos: 52, estado: 'Activo', email: 'ventas@andina.com', isTrustedCustomer: true },
  { id: 'CL-004', nombre: 'Moda Casual SAS', ciudad: 'Barranquilla', tel: '313 567 8901', asesor: 'Pedro Gómez', pedidos: 9, estado: 'Inactivo', email: 'admin@modacasual.com', isTrustedCustomer: false },
  { id: 'CL-005', nombre: 'Confección del Valle', ciudad: 'Cali', tel: '314 567 8902', asesor: 'Luis Herrera', pedidos: 27, estado: 'Activo', email: 'ventas@delvalle.com', isTrustedCustomer: false },
  { id: 'CL-006', nombre: 'Telas Premium', ciudad: 'Bogotá', tel: '315 567 8903', asesor: 'Camila Torres', pedidos: 41, estado: 'Activo', email: 'info@telaspremium.com', isTrustedCustomer: true },
  { id: 'CL-007', nombre: 'Moda Express', ciudad: 'Medellín', tel: '316 567 8904', asesor: 'Pedro Gómez', pedidos: 15, estado: 'Activo', email: 'ventas@modaexpress.co', isTrustedCustomer: false },
  { id: 'CL-008', nombre: 'Estilo Único', ciudad: 'Cartagena', tel: '317 567 8905', asesor: 'Luis Herrera', pedidos: 22, estado: 'Activo', email: 'info@estilounico.com', isTrustedCustomer: false },
  { id: 'CL-009', nombre: 'Telas del Caribe', ciudad: 'Barranquilla', tel: '318 567 8906', asesor: 'Camila Torres', pedidos: 8, estado: 'Inactivo', email: 'admin@telascaribe.com', isTrustedCustomer: false },
  { id: 'CL-010', nombre: 'Confección Moderna', ciudad: 'Bogotá', tel: '319 567 8907', asesor: 'Pedro Gómez', pedidos: 33, estado: 'Activo', email: 'ventas@confeccionmoderna.com', isTrustedCustomer: true },
];

export const AdminClientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [items, setItems] = useState<Cliente[]>(mockClientesInicial);

  const formRef = useRef<HTMLFormElement>(null);

  const filteredClientes = items.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSubmitCliente = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nombre = String(fd.get('nombre') ?? '').trim();
    const ciudad = String(fd.get('ciudad') ?? '').trim();
    const tel = String(fd.get('tel') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const asesor = String(fd.get('asesor') ?? '').trim();
    const isTrustedCustomer = fd.get('isTrustedCustomer') === 'on';
    if (selectedCliente) {
      setItems(prev => prev.map(it => it.id === selectedCliente.id ? { ...it, nombre, ciudad, tel, email, asesor, isTrustedCustomer } : it));
      toast.success('Cliente actualizado');
    } else {
      const nuevo: Cliente = {
        id: `CL-${String(items.length + 1).padStart(3, '0')}`,
        nombre,
        ciudad,
        tel,
        asesor,
        pedidos: 0,
        estado: 'Activo',
        email,
        isTrustedCustomer,
      };
      setItems(prev => [nuevo, ...prev]);
      toast.success('Cliente creado');
    }
    handleCloseFormModal();
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Clientes</h1>
          <p className={s.pageSubtitle}>Gestión de clientes de la empresa</p>
        </div>
        <Button onClick={() => setFormModalOpen(true)}>
          <Plus size={16} />
          Nuevo Cliente
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar clientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Cliente>
        data={filteredClientes}
        pageSize={10}
        emptyMessage="No se encontraron clientes"
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="clientes"
        maxVisibleColumns={5}
        columns={[
          { key: 'id', header: 'ID', width: '90px', sortable: true, filterable: true, render: (c) => <span className={s.tdMono}>{c.id}</span> },
          { key: 'nombre', header: 'Nombre', sortable: true, filterable: true, render: (c) => <span className={s.tdPrimary}>{c.nombre}</span> },
          { key: 'ciudad', header: 'Ciudad', render: (c) => c.ciudad },
          { key: 'tel', header: 'Teléfono', render: (c) => c.tel },
          { key: 'estado', header: 'Estado', width: '100px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ], render: (c) => (
            <Badge variant={c.estado === 'Activo' ? 'success' : 'default'}>{c.estado}</Badge>
          )},
          { key: 'isTrustedCustomer', header: 'Confianza', width: '110px', render: (c) => (
            <Badge variant={c.isTrustedCustomer ? 'success' : 'outline'} dot={c.isTrustedCustomer}>
              {c.isTrustedCustomer ? 'Cliente de Confianza' : 'Estándar'}
            </Badge>
          )},
        ]}
        actions={(c) => [
          { label: 'Editar', icon: <Edit size={14} />, onClick: () => handleEdit(c) },
        ]}
        detailPanel={{
          title: (c) => `Cliente: ${c.nombre}`,
          render: (c, onClose) => (
            <div className={s.detailModalContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Información básica</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>ID</span><span>{c.id}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Nombre</span><span>{c.nombre}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Asesor</span><span>{c.asesor}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Pedidos</span><span>{c.pedidos}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Estado de Confianza</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}>
                    <span className={s.detailLabel}>Tipo de Cliente</span>
                    <Badge variant={c.isTrustedCustomer ? 'success' : 'outline'} dot={c.isTrustedCustomer}>
                      {c.isTrustedCustomer ? 'Cliente de Confianza' : 'Cliente Estándar'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Contacto</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>Teléfono</span><span>{c.tel}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Email</span><span>{c.email || '—'}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Ciudad</span><span>{c.ciudad}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Dirección</span><span>{c.direccion || '—'}</span></div>
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
        onClose={handleCloseFormModal}
        title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
      >
        <form className={s.form} ref={formRef}>
          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Nombre</label>
              <input type="text" className={s.input} name="nombre" defaultValue={selectedCliente?.nombre} />
            </div>
            <div className={s.field}>
              <label className={s.label}>NIT/CC</label>
              <input type="text" className={s.input} placeholder="Número de identificación" />
            </div>
          </div>
          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Ciudad</label>
              <input type="text" className={s.input} name="ciudad" defaultValue={selectedCliente?.ciudad} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Teléfono</label>
              <input type="text" className={s.input} name="tel" defaultValue={selectedCliente?.tel} />
            </div>
          </div>
          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Email</label>
              <input type="email" className={s.input} name="email" placeholder="email@ejemplo.com" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Asesor asignado</label>
              <select className={s.select} name="asesor">
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
          <div className={s.field}>
            <label className={s.label}>Cliente de Confianza</label>
            <div className={s.checkboxWrapper}>
              <input
                type="checkbox"
                id="trusted-customer"
                className={s.checkbox}
                name="isTrustedCustomer"
                defaultChecked={selectedCliente?.isTrustedCustomer ?? false}
              />
              <label htmlFor="trusted-customer" className={s.checkboxLabel}>
                Permite al cliente realizar compras mediante pagos por abonos y cuotas.
              </label>
            </div>
          </div>
          <div className={s.formActions}>
            <Button variant="secondary" onClick={handleCloseFormModal}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitCliente}>
              {selectedCliente ? 'Guardar cambios' : 'Crear cliente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};