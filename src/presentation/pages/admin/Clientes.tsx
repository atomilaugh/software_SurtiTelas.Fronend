import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Edit } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Clientes.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { customersApi } from '@/infrastructure/api/customersApi';
import { authApi } from '@/infrastructure/api/authApi';
import type { Cliente } from '@/core/types';
import { useServerPagination } from '@/hooks/useServerPagination';

interface AsesorOption {
  id: string;
  nombre: string;
  role: string;
}

export const AdminClientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [pageData, setPageData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asesores, setAsesores] = useState<AsesorOption[]>([]);
  const [loadingAsesores, setLoadingAsesores] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);
  const pagination = useServerPagination(10);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, string | number | boolean | undefined | null> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search.trim()) query.search = search.trim();
      const result = await customersApi.list(query);
      setPageData(result.data);
      pagination.setTotalRecords(result.meta.totalRecords);
    } catch {
      setError('No se pudieron cargar los clientes');
      toast.error('No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, pagination.setTotalRecords]);

  useEffect(() => {
    void fetchClientes();
  }, [fetchClientes]);

  const fetchAsesores = async () => {
    setLoadingAsesores(true);
    try {
      const data = await authApi.listUsers();
      const users = (data as { data: Array<{ id: string; nombre: string; role: string }> }).data;
      const mapped: AsesorOption[] = users
        .filter(u => u.role === 'ASESOR' || u.role === 'ADMIN')
        .map(u => ({ id: u.id, nombre: u.nombre, role: u.role }));
      setAsesores(mapped);
    } catch {
      toast.error('No se pudieron cargar los asesores');
    } finally {
      setLoadingAsesores(false);
    }
  };

  useEffect(() => {
    void fetchAsesores();
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    pagination.setPage(newPage);
  }, [pagination]);

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSubmitCliente = async () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nombre = String(fd.get('nombre') ?? '').trim();
    const ciudad = String(fd.get('ciudad') ?? '').trim();
    const tel = String(fd.get('tel') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const asesorId = String(fd.get('asesorId') ?? '').trim();
    const isTrustedCustomer = fd.get('isTrustedCustomer') === 'on';
    try {
      if (selectedCliente) {
        const actualizado = await customersApi.update(selectedCliente.id, { nombre, ciudad, tel, email, asesorId: asesorId || undefined, isTrustedCustomer });
        setPageData(prev => prev.map(it => it.id === selectedCliente.id ? actualizado : it));
        toast.success('Cliente actualizado');
      } else {
        const nuevo = await customersApi.create({ nombre, ciudad, tel, email, asesorId: asesorId || undefined, isTrustedCustomer, estado: 'Activo' });
        setPageData(prev => [nuevo, ...prev]);
        toast.success('Cliente creado');
      }
      handleCloseFormModal();
    } catch {
      toast.error('No fue posible guardar el cliente');
    }
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
          onSearch={(value) => { setSearch(value); pagination.setPage(1); }}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Cliente>
        data={pageData}
        pageSize={pagination.limit}
        emptyMessage={loading ? 'Cargando clientes...' : error ? error : 'Sin resultados'}
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="clientes"
        maxVisibleColumns={5}
        serverMode
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalRecords}
        onPageChange={handlePageChange}
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
          { label: 'Editar', icon: <Edit size={14} aria-hidden="true" focusable="false" />, onClick: () => handleEdit(c) },
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
              <select className={s.select} name="asesorId" disabled={loadingAsesores}>
                <option value="">-- Seleccione un asesor --</option>
                {asesores.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
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