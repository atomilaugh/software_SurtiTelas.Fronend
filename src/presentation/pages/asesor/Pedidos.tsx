import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import s from '../admin/Pedidos.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Pedido {
  id: string;
  cliente: string;
  fecha: string;
  items: number;
  total: string;
  estado: 'Nuevo' | 'En producción' | 'Listo' | 'Despachado' | 'Entregado' | 'Cancelado';
}

const misPedidos: Pedido[] = [
  { id: '#PD-2401', cliente: 'Almacén El Sol', fecha: '08 Jun 2026', items: 24, total: '$2.480.000', estado: 'En producción' },
  { id: '#PD-2398', cliente: 'Moda Express SAS', fecha: '06 Jun 2026', items: 12, total: '$1.340.000', estado: 'Entregado' },
  { id: '#PD-2395', cliente: 'Boutique Moda+', fecha: '04 Jun 2026', items: 8, total: '$980.000', estado: 'Listo' },
  { id: '#PD-2390', cliente: 'Textiles del Norte', fecha: '01 Jun 2026', items: 18, total: '$1.870.000', estado: 'Despachado' },
  { id: '#PD-2385', cliente: 'Confecciones Zuluaga', fecha: '28 May 2026', items: 5, total: '$620.000', estado: 'Nuevo' },
];

const orderStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'default',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

export const AsesorPedidos: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredPedidos = misPedidos.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Pedidos</h1>
          <p className={s.pageSubtitle}>Gestión de tus pedidos</p>
        </div>
        <Button>
          <Plus size={16} />
          Nuevo Pedido
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
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
                <td>{pedido.fecha}</td>
                <td>{pedido.items}</td>
                <td>{pedido.total}</td>
                <td>
                  <Badge variant={orderStatuses[pedido.estado]}>
                    {pedido.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn}>Ver</button>
                    <button className={s.actionBtn}>Editar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};