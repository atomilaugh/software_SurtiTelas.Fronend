import React from 'react';
import { StatCard } from '../admin/StatCard';
import s from './Dashboard.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Users, ShoppingBag, BadgeDollarSign, Target } from 'lucide-react';
import { useAppStore } from '@/core/stores';

const orderStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'default',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

export const AsesorDashboard: React.FC = () => {
  const pedidos = useAppStore(s => s.pedidos);
  const clientes = useAppStore(s => s.clientes);

  const misPedidos = pedidos.filter(p => p.asesor === 'Camila Torres' || p.asesor === 'Luis Herrera');
  const misClientes = clientes.filter(c => c.asesor === 'Camila Torres' || c.asesor === 'Luis Herrera');

  const totalPedidos = misPedidos.length;
  const totalClientes = misClientes.length;
  const ingresosTotales = misPedidos
    .filter(p => p.estado === 'Entregado')
    .reduce((sum, p) => sum + (parseInt(p.total.replace(/[^0-9]/g, ''), 10) || 0), 0);

  const stats = [
    { label: 'Mis Clientes', value: String(totalClientes), trend: '+3 este mes', trendUp: true, Icon: Users, color: 'accent' as const },
    { label: 'Pedidos del Mes', value: String(totalPedidos), trend: '+5 vs mes ant.', trendUp: true, Icon: ShoppingBag, color: 'success' as const },
    { label: 'Comisión Acumulada', value: `$${(ingresosTotales * 0.05).toLocaleString()}`, trend: '+18%', trendUp: true, Icon: BadgeDollarSign, color: 'warning' as const },
    { label: 'Meta del Mes', value: '74%', trend: 'Meta: $5.000.000', trendUp: true, Icon: Target, color: 'info' as const },
  ];

  const actividad = [
    { tipo: 'accent', texto: `Nuevo pedido creado — ${misPedidos[0]?.cliente || 'Sin pedidos'}`, tiempo: 'hace 20 min' },
    { tipo: 'success', texto: `Pedido ${misPedidos[1]?.id || 'N/A'} marcado como Listo`, tiempo: 'hace 1 h' },
    { tipo: 'info', texto: 'Cliente nuevo registrado', tiempo: 'hace 3 h' },
    { tipo: 'warning', texto: 'Pedido requiere confirmación', tiempo: 'ayer' },
  ];

  return (
    <div>
      <h1 className={s.pageTitle}>Dashboard</h1>
      <p className={s.pageSubtitle}>Métricas de tus ventas</p>

      <div className={s.statsGrid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className={s.middleGrid}>
        <div className={s.tableSection}>
          <h2 className={s.sectionTitle}>Mis pedidos recientes</h2>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {misPedidos.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                      No hay pedidos
                    </td>
                  </tr>
                ) : (
                  misPedidos.map((order) => (
                    <tr key={order.id}>
                      <td className={s.tdMono}>{order.id}</td>
                      <td className={s.tdPrimary}>{order.cliente}</td>
                      <td>{order.fecha}</td>
                      <td>{order.items}</td>
                      <td>{order.total}</td>
                      <td>
                        <Badge variant={orderStatuses[order.estado]}>
                          {order.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.metaCard}>
          <div className={s.metaHeader}>
            <span className={s.metaTitle}>Meta mensual de ventas</span>
            <span className={s.metaPercent}>74%</span>
          </div>
          <div className={s.progressTrack}>
            <div className={s.progressFill} style={{ width: '74%' }} />
          </div>
          <div className={s.metaDetail}>
            <span>Ventas logradas: <strong>$3.2M</strong></span>
            <span>Restan: <strong>15 días</strong></span>
          </div>
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.tableSection}>
          <h2 className={s.sectionTitle}>Mis clientes recientes</h2>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Pedidos</th>
                  <th>Última Compra</th>
                </tr>
              </thead>
              <tbody>
                {misClientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                      No hay clientes
                    </td>
                  </tr>
                ) : (
                  misClientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className={s.tdMono}>{cliente.id}</td>
                      <td className={s.tdPrimary}>{cliente.nombre}</td>
                      <td>{cliente.ciudad}</td>
                      <td>{cliente.pedidos}</td>
                      <td>05 Jun 2026</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.tableSection}>
          <h2 className={s.sectionTitle}>Actividad reciente</h2>
          <div className={s.activityList}>
            {actividad.map((a, i) => (
              <div key={i} className={s.activityItem}>
                <div className={`${s.activityDot} ${a.tipo === 'accent' ? s.activityDotAccent : a.tipo === 'success' ? s.activityDotSuccess : a.tipo === 'info' ? s.activityDotInfo : s.activityDotWarning}`} />
                <span className={s.activityText}>{a.texto}</span>
                <span className={s.activityTime}>{a.tiempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};