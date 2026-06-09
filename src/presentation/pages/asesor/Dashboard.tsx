import React from 'react';
import { StatCard } from '../admin/StatCard';
import s from './Dashboard.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Users, ShoppingBag, BadgeDollarSign, Target } from 'lucide-react';

const stats = [
  { label: 'Mis Clientes', value: '43', trend: '+3 este mes', trendUp: true, Icon: Users, color: 'accent' as const },
  { label: 'Pedidos del Mes', value: '28', trend: '+5 vs mes ant.', trendUp: true, Icon: ShoppingBag, color: 'success' as const },
  { label: 'Comisión Acumulada', value: '$1.240.000', trend: '+18%', trendUp: true, Icon: BadgeDollarSign, color: 'warning' as const },
  { label: 'Meta del Mes', value: '74%', trend: 'Meta: $5.000.000', trendUp: true, Icon: Target, color: 'info' as const },
];

const misPedidos = [
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

const actividad = [
  { tipo: 'accent', texto: 'Nuevo pedido creado — Almacén El Sol', tiempo: 'hace 20 min' },
  { tipo: 'success', texto: 'Pedido #PD-2398 marcado como Listo', tiempo: 'hace 1 h' },
  { tipo: 'info', texto: 'Cliente nuevo registrado — Moda Express', tiempo: 'hace 3 h' },
  { tipo: 'warning', texto: 'Pedido #PD-2391 requiere confirmación', tiempo: 'ayer' },
  { tipo: 'accent', texto: 'Comisión de Mayo liquidada — $980.000', tiempo: 'hace 2 días' },
];

export const AsesorDashboard: React.FC = () => {
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
                {misPedidos.map((order) => (
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
                ))}
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
                <tr>
                  <td className={s.tdMono}>CL-001</td>
                  <td className={s.tdPrimary}>Almacén El Sol</td>
                  <td>Bogotá</td>
                  <td>34</td>
                  <td>05 Jun 2026</td>
                </tr>
                <tr>
                  <td className={s.tdMono}>CL-008</td>
                  <td className={s.tdPrimary}>Moda Express SAS</td>
                  <td>Cali</td>
                  <td>22</td>
                  <td>03 Jun 2026</td>
                </tr>
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