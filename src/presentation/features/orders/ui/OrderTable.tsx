import React from 'react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { Order, OrderStatus } from '@/domain/entities/Order';
import s from './OrderTable.module.css';

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  error?: string | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void> | void;
}

const statusVariant: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'primary' | 'purple' | 'outline' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'primary',
  'En camino': 'info',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

const formatCurrency = (value: number) => `$${value.toLocaleString('es-CO')}`;

const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(new Date(value));

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading = false,
  error = null,
  onUpdateStatus,
}) => {
  const handleStatus = async (orderId: string, status: OrderStatus) => {
    await onUpdateStatus(orderId, status);
  };

  return (
    <section className={s.tableCard}>
      <div className={s.tableHeader}>
        <div>
          <h2 className={s.tableTitle}>Pedidos</h2>
          <p className={s.tableSubtitle}>Historial y estado operativo de los pedidos</p>
        </div>
        <span className={s.countBadge}>{orders.length} pedidos</span>
      </div>

      {error && <div className={s.errorMessage}>{error}</div>}

      <div className={s.tableWrapper}>
        {loading ? (
          <div className={s.loadingState}>Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className={s.emptyState}>No hay pedidos registrados</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Asesor</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><span className={s.tdMono}>{order.id}</span></td>
                  <td><span className={s.tdPrimary}>{order.cliente}</span></td>
                  <td>{order.asesor}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.items}</td>
                  <td><span className={s.amount}>{formatCurrency(order.total)}</span></td>
                  <td>
                    <Badge variant={statusVariant[order.estado]} dot>
                      {order.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className={s.actions}>
                      {order.estado === 'Listo' && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleStatus(order.id, 'Despachado')}
                        >
                          Despachar
                        </Button>
                      )}

                      {order.estado === 'En camino' && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleStatus(order.id, 'Entregado')}
                        >
                          Entregar
                        </Button>
                      )}

                      {order.estado !== 'Entregado' && order.estado !== 'Cancelado' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleStatus(order.id, 'Cancelado')}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
