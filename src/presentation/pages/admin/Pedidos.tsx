import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SearchInput } from '@/shared/ui/SearchInput';
import s from './Pedidos.module.css';
import f from '@/styles/Form.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { ordersApi } from '@/infrastructure/api/ordersApi';
import { customersApi } from '@/infrastructure/api/customersApi';
import { authApi, type BackendAuthUser } from '@/infrastructure/api/authApi';
import { useAuthStore } from '@/core/stores/authStore';
import { ESTADOS_PEDIDO, ORDER_STATUS_COLORS } from '@/shared/constants/options';
import type { Pedido, PedidoItem, Cliente } from '@/core/types';
import { useServerPagination } from '@/hooks/useServerPagination';

type PedidoFormItem = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

const orderStatuses = ORDER_STATUS_COLORS;

const formatoCOP = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);

export const AdminPedidos: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [pageData, setPageData] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [asesores, setAsesores] = useState<BackendAuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const [clienteNombre, setClienteNombre] = useState('');
  const [asesorId, setAsesorId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [estado, setEstado] = useState<Pedido['estado']>('Nuevo');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<PedidoFormItem[]>([
    { id: 'I1', nombre: '', precio: 0, cantidad: 1 },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const pagination = useServerPagination(10);

  const hydrate = useCallback(async () => {
    setLoading(true);
    try {
      const ordersQuery: Record<string, string | number | boolean | undefined | null> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search.trim()) ordersQuery.search = search.trim();
      const [ordersResult, clientsResult, _profile, usersResult] = await Promise.all([
        ordersApi.list(ordersQuery),
        customersApi.list(),
        authApi.me(),
        authApi.listUsers(),
      ]);
      setPageData(ordersResult.pedidos);
      pagination.setTotalRecords(ordersResult.meta.totalRecords);
      setClientes(clientsResult.data);
      setAsesores(usersResult.data.filter((u) => u.role === 'ASESOR'));
      if (!asesorId && usersResult.data.some((u) => u.role === 'ASESOR')) {
        const adminAsesor = usersResult.data.find((u) => u.role === 'ASESOR');
        setAsesorId(adminAsesor?.id ?? '');
      }
    } catch {
      toast.error('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [asesorId, pagination.page, pagination.limit, search, pagination.setTotalRecords]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const handlePageChange = useCallback((newPage: number) => {
    pagination.setPage(newPage);
  }, [pagination]);

  const subtotal = items.reduce((sum, it) => sum + it.precio * it.cantidad, 0);
  const totalItems = items.reduce((sum, it) => sum + it.cantidad, 0);

  const resetForm = () => {
    setClienteNombre('');
    setAsesorId('');
    setFecha(new Date().toISOString().slice(0, 10));
    setEstado('Nuevo');
    setObservaciones('');
    setItems([{ id: 'I1', nombre: '', precio: 0, cantidad: 1 }]);
    setFormError(null);
  };

  const openNew = () => {
    resetForm();
    setSelectedPedido(null);
    setEditModalOpen(true);
  };

  const openEdit = (p: Pedido) => {
    setSelectedPedido(p);
    setClienteNombre(p.cliente);
    setFecha(p.fecha);
    setEstado(p.estado);
    setObservaciones(p.observaciones || '');
    setItems(
      (p.itemsList ?? []).map((it, idx) => ({
        id: `I${idx + 1}-${Date.now()}`,
        nombre: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
      }))
    );
    setFormError(null);
    setEditModalOpen(true);
  };

  const updateFormItem = (id: string, field: keyof PedidoFormItem, value: string | number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `I${prev.length + 1}-${Date.now()}`, nombre: '', precio: 0, cantidad: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const clienteFinal = clienteNombre.trim();
    if (!clienteFinal) {
      setFormError('El cliente es obligatorio');
      return;
    }

    const clienteDto = clientes.find((c) => c.nombre.toLowerCase() === clienteFinal.toLowerCase());
    if (!clienteDto) {
      setFormError('Selecciona un cliente válido');
      return;
    }

    const itemsValidos = items.filter((it) => it.nombre.trim() && it.cantidad > 0);
    if (itemsValidos.length === 0) {
      setFormError('Debes agregar al menos un producto al pedido');
      return;
    }

    setSaving(true);
    try {
      const itemsList: PedidoItem[] = itemsValidos.map((it) => ({
        productId: undefined,
        nombre: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
      }));

      if (selectedPedido) {
        const actualizado = await ordersApi.updateStatus(selectedPedido.id, estado);
        setPageData((prev) =>
          prev.map((p) => (p.id === selectedPedido.id ? actualizado : p))
        );
        toast.success(`Pedido ${selectedPedido.id} actualizado`);
      } else {
        const resultado = await ordersApi.create({
          clienteId: clienteDto.id,
          asesorId: asesorId || user?.uid,
          itemsList,
          prioridad: undefined,
          observaciones: observaciones || undefined,
        });
        await hydrate();
        toast.success(`Pedido ${resultado.pedido.id} creado`);
      }
      setEditModalOpen(false);
      resetForm();
    } catch {
      toast.error('No fue posible guardar el pedido.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Pedidos</h1>
          <p className={s.pageSubtitle}>Gestión de pedidos del sistema</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar pedidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => { setSearch(value); pagination.setPage(1); }}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <DataTable<Pedido>
        data={pageData}
        pageSize={pagination.limit}
        emptyMessage={loading ? 'Cargando pedidos...' : 'Sin resultados'}
        enableSorting
        enableColumnFilters
        enableRowSelection
        enableExport
        exportFileName="pedidos"
        maxVisibleColumns={5}
        serverMode
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { key: 'id', header: 'ID Pedido', width: '130px', sortable: true, filterable: true, render: (p) => <span className={s.tdMono}>{p.numero ?? p.id}</span> },
          { key: 'cliente', header: 'Cliente', sortable: true, filterable: true, render: (p) => <span className={s.tdPrimary}>{p.cliente}</span> },
          { key: 'asesor', header: 'Asesor', render: (p) => p.asesor },
          { key: 'fecha', header: 'Fecha', width: '110px', render: (p) => p.fecha },
          { key: 'total', header: 'Total', width: '120px', render: (p) => p.total },
          { key: 'estado', header: 'Estado', width: '130px', sortable: true, filterable: true, filterType: 'select', filterOptions: ESTADOS_PEDIDO.map(es => ({ value: es, label: es })), render: (p) => (
            <Badge variant={orderStatuses[p.estado]}>{p.estado}</Badge>
          )},
        ]}
        actions={(p) => [
          { label: 'Editar', onClick: () => openEdit(p) },
        ]}
        detailPanel={{
          title: (p) => `Pedido ${p.numero ?? p.id}`,
          render: (p, onClose) => (
            <div className={s.detailModalContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Detalles del pedido</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>ID</span><span>{p.numero ?? p.id}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Cliente</span><span>{p.cliente}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Asesor</span><span>{p.asesor}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Items</span><span>{p.items}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Total</span><span>{p.total}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Estado</span><span><Badge variant={orderStatuses[p.estado]}>{p.estado}</Badge></span></div>
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
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); resetForm(); }}
        title={selectedPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        description={selectedPedido ? `Modificando ${selectedPedido.id}` : 'Completa la información del pedido'}
        size="xl"
        variant="form"
      >
        <form onSubmit={handleSubmit} className={f.form}>
          {formError && <div className={f.formError}>{formError}</div>}

          <div className={f.formRow}>
            <div className={f.field}>
              <label className={f.label}>Cliente *</label>
              <select className={f.select} value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)}>
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={f.field}>
              <label className={f.label}>Asesor *</label>
              <select className={f.select} value={asesorId} onChange={(e) => setAsesorId(e.target.value)}>
                <option value="">Selecciona un asesor</option>
                {asesores.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={f.field}>
              <label className={f.label}>Fecha *</label>
              <input className={f.input} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
          </div>

          <div className={f.field}>
            <label className={f.label}>Estado *</label>
            <select className={f.select} value={estado} onChange={(e) => setEstado(e.target.value as Pedido['estado'])}>
              {ESTADOS_PEDIDO.map(es => (
                <option key={es} value={es}>{es}</option>
              ))}
            </select>
          </div>

          <div className={f.field}>
            <label className={f.label}>Productos del pedido</label>
            <table className={f.itemsTable}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th className={f.centerCol}>Cant.</th>
                  <th className={f.rightCol}>Precio unit.</th>
                  <th className={f.rightCol}>Subtotal</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const sub = it.precio * it.cantidad;
                  return (
                    <tr key={it.id}>
                      <td>
                        <input
                          className={f.input}
                          value={it.nombre}
                          onChange={(e) => updateFormItem(it.id, 'nombre', e.target.value)}
                          placeholder="Producto"
                        />
                      </td>
                      <td className={f.centerCol}>
                        <input
                          className={f.input}
                          type="number"
                          min="1"
                          value={it.cantidad}
                          onChange={(e) => updateFormItem(it.id, 'cantidad', Number(e.target.value))}
                        />
                      </td>
                      <td className={f.rightCol}>
                        <input
                          className={f.input}
                          type="number"
                          min="0"
                          value={it.precio}
                          onChange={(e) => updateFormItem(it.id, 'precio', Number(e.target.value))}
                        />
                      </td>
                      <td className={f.rightCol} style={{ fontWeight: 600 }}>
                        {formatoCOP(sub)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={f.removeRowBtn}
                          onClick={() => removeItem(it.id)}
                          aria-label="Eliminar producto"
                          disabled={items.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button type="button" className={f.addRowBtn} onClick={addItem}>
              <Plus size={14} /> Agregar producto
            </button>
          </div>

          <div className={f.totalsBox}>
            <div className={f.totalRow}><span>Total de items:</span><span>{totalItems}</span></div>
            <div className={`${f.totalRow} ${f.totalRowFinal}`}><span>Total pedido:</span><span>{formatoCOP(subtotal)}</span></div>
          </div>

          <div className={f.field}>
            <label className={f.label}>Observaciones</label>
            <textarea
              className={f.textarea}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas del pedido..."
              rows={2}
            />
          </div>

          <div className={f.formActions}>
            <Button type="button" variant="secondary" onClick={() => { setEditModalOpen(false); resetForm(); }} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} leftIcon={<Save size={16} />}>
              {selectedPedido ? 'Guardar cambios' : 'Crear pedido'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
