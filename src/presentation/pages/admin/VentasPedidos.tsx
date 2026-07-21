import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import s from './VentasPedidos.module.css';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Button } from '@/shared/ui/Button';
import { ordersApi } from '@/infrastructure/api/ordersApi';
import type { Pedido } from '@/core/types';
import { Loader2, AlertCircle, Eye } from 'lucide-react';

export const AdminVentasPedidos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { pedidos } = await ordersApi.list();
      setItems(pedidos);
    } catch {
      setError('No se pudieron cargar los pedidos');
      toast.error('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPedidos();
  }, []);

  const filteredPedidos = items.filter(p =>
    p.cliente.toLowerCase().includes(search.toLowerCase()) ||
    p.asesor.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Ventas y Pedidos</h1>
          <p className={s.pageSubtitle}>Resumen de ventas y pedidos</p>
        </div>
        <Button onClick={fetchPedidos}>
          Actualizar
        </Button>
      </div>

      <div className={s.toolbar}>
        <SearchInput
          placeholder="Buscar pedidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
          debounceMs={100}
          minChars={0}
        />
      </div>

      <div className={s.tableWrapper}>
        {loading && (
          <div className={s.loadingRow}>
            <Loader2 size={18} className={s.spin} />
            <span>Cargando pedidos...</span>
          </div>
        )}
        {error && !loading && (
          <div className={s.errorRow}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && (
          <table className={s.table}>
            <thead>
              <tr>
                <th>ID</th>
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
              {filteredPedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td className={s.tdMono}>{pedido.id}</td>
                  <td className={s.tdPrimary}>{pedido.cliente}</td>
                  <td>{pedido.asesor}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.items}</td>
                  <td>{pedido.total}</td>
                  <td>
                    <span className={`${s.badge} ${s[`badge_${pedido.estado.toLowerCase().replace(/\s+/g, '_')}`] || s.badge_default}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.actionBtn} title="Ver detalle">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPedidos.length === 0 && (
                <tr>
                  <td colSpan={8} className={s.emptyRow}>Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};