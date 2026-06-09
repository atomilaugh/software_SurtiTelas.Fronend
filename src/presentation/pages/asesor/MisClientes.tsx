import React, { useState } from 'react';
import { Search, Plus, Eye, Edit } from 'lucide-react';
import s from '../admin/Clientes.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Cliente {
  id: string;
  nombre: string;
  ciudad: string;
  tel: string;
  pedidos: number;
  ultimaCompra: string;
  estado: 'Activo' | 'Inactivo';
}

const misClientes: Cliente[] = [
  { id: 'CL-001', nombre: 'Almacén El Sol', ciudad: 'Bogotá', tel: '310 234 5678', pedidos: 34, ultimaCompra: '05 Jun 2026', estado: 'Activo' },
  { id: 'CL-002', nombre: 'Boutique Moda+', ciudad: 'Medellín', tel: '311 345 6789', pedidos: 18, ultimaCompra: '04 Jun 2026', estado: 'Activo' },
  { id: 'CL-003', nombre: 'Textiles del Norte', ciudad: 'Barranquilla', tel: '312 456 7890', pedidos: 9, ultimaCompra: '01 Jun 2026', estado: 'Activo' },
  { id: 'CL-004', nombre: 'Moda Express SAS', ciudad: 'Cali', tel: '313 567 8901', pedidos: 22, ultimaCompra: '03 Jun 2026', estado: 'Activo' },
  { id: 'CL-005', nombre: 'Confecciones Zuluaga', ciudad: 'Pereira', tel: '314 678 9012', pedidos: 7, ultimaCompra: '28 May 2026', estado: 'Inactivo' },
  { id: 'CL-006', nombre: 'Telas Premium', ciudad: 'Bogotá', tel: '315 567 8903', pedidos: 41, ultimaCompra: '02 Jun 2026', estado: 'Activo' },
  { id: 'CL-007', nombre: 'Moda Express', ciudad: 'Medellín', tel: '316 567 8904', pedidos: 15, ultimaCompra: '30 May 2026', estado: 'Activo' },
  { id: 'CL-008', nombre: 'Estilo Único', ciudad: 'Cartagena', tel: '317 567 8905', pedidos: 22, ultimaCompra: '29 May 2026', estado: 'Activo' },
  { id: 'CL-009', nombre: 'Confección Moderna', ciudad: 'Bogotá', tel: '319 567 8907', pedidos: 33, ultimaCompra: '25 May 2026', estado: 'Activo' },
  { id: 'CL-010', nombre: 'Ropa Casual', ciudad: 'Medellín', tel: '320 567 8908', pedidos: 12, ultimaCompra: '20 May 2026', estado: 'Activo' },
];

export const AsesorClientes: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredClientes = misClientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Mis Clientes</h1>
          <p className={s.pageSubtitle}>Clientes asignados a tu cartera</p>
        </div>
        <Button>
          <Plus size={16} />
          Nuevo Cliente
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar clientes..."
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Teléfono</th>
              <th>Pedidos</th>
              <th>Última Compra</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map(cliente => (
              <tr key={cliente.id}>
                <td className={s.tdMono}>{cliente.id}</td>
                <td className={s.tdPrimary}>{cliente.nombre}</td>
                <td>{cliente.ciudad}</td>
                <td>{cliente.tel}</td>
                <td>{cliente.pedidos}</td>
                <td>{cliente.ultimaCompra}</td>
                <td>
                  <Badge variant={cliente.estado === 'Activo' ? 'success' : 'default'}>
                    {cliente.estado}
                  </Badge>
                </td>
                <td>
                  <div className={s.actions}>
                    <button className={s.actionBtn} title="Ver">
                      <Eye size={14} />
                    </button>
                    <button className={s.actionBtn} title="Editar">
                      <Edit size={14} />
                    </button>
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