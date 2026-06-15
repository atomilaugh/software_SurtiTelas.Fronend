import React from 'react';
import { StatCard } from './StatCard';
import { BarChart, LineChart, PieChart, TopProducts } from './Chart';
import s from './Dashboard.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Users, ShoppingBag, Factory, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Total Clientes', value: '1,284', trend: '+12%', trendUp: true, Icon: Users, color: 'accent' as const },
  { label: 'Pedidos del Mes', value: '348', trend: '+8%', trendUp: true, Icon: ShoppingBag, color: 'success' as const },
  { label: 'Producción Activa', value: '67', trend: '-3%', trendUp: false, Icon: Factory, color: 'info' as const },
  { label: 'Ingresos del Mes', value: '$48.2M', trend: '+22%', trendUp: true, Icon: DollarSign, color: 'warning' as const },
];

const salesData = [
  { label: 'Ene', value: 32 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 38 },
  { label: 'Abr', value: 52 },
  { label: 'May', value: 48 },
  { label: 'Jun', value: 61 },
];

const asesorData = [
  { label: 'Camila Torres', value: 34, color: '#ff6b35' },
  { label: 'Luis Herrera', value: 28, color: '#10b981' },
  { label: 'Pedro Gómez', value: 22, color: '#2563eb' },
  { label: 'María Ruiz', value: 18, color: '#f59e0b' },
];

const trendData = [
  { label: 'Lun', value: 12 },
  { label: 'Mar', value: 18 },
  { label: 'Mié', value: 15 },
  { label: 'Jue', value: 22 },
  { label: 'Vie', value: 19 },
  { label: 'Sáb', value: 14 },
  { label: 'Dom', value: 8 },
];

const topProducts = [
  { rank: 1, name: 'Tela Algodón Premium', sales: '$12.4M' },
  { rank: 2, name: 'Lino Egipcio', sales: '$9.8M' },
  { rank: 3, name: 'Poliéster Soft', sales: '$8.2M' },
  { rank: 4, name: 'Seda Natural', sales: '$6.1M' },
  { rank: 5, name: 'Viscosa Rayón', sales: '$4.5M' },
];

const recentOrders = [
  { id: '#PD-2401', cliente: 'Almacén El Sol', asesor: 'Camila Torres', items: 24, total: '$2.480.000', estado: 'En producción', fecha: '08 Jun 2026' },
  { id: '#PD-2400', cliente: 'Boutique Moda+', asesor: 'Luis Herrera', items: 8, total: '$980.000', estado: 'Listo', fecha: '07 Jun 2026' },
  { id: '#PD-2399', cliente: 'Textiles Andina', asesor: 'Camila Torres', items: 45, total: '$5.120.000', estado: 'Despachado', fecha: '07 Jun 2026' },
  { id: '#PD-2398', cliente: 'Moda Casual SAS', asesor: 'Pedro Gómez', items: 12, total: '$1.340.000', estado: 'Entregado', fecha: '06 Jun 2026' },
  { id: '#PD-2397', cliente: 'La Tienda Norte', asesor: 'Luis Herrera', items: 6, total: '$720.000', estado: 'Cancelado', fecha: '05 Jun 2026' },
];

const orderStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  'Nuevo': 'default',
  'En producción': 'info',
  'Listo': 'warning',
  'Despachado': 'default',
  'Entregado': 'success',
  'Cancelado': 'danger',
};

export const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className={s.pageTitle}>Dashboard</h1>
      <p className={s.pageSubtitle}>Métricas generales del sistema</p>
      
      <div className={s.statsGrid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      
<div className={s.chartsGrid}>
         <BarChart data={salesData} title="Ventas Mensuales" />
         <PieChart data={asesorData} title="Rendimiento de Asesores" />
         <LineChart data={trendData} title="Tendencia Pedidos" />
         <TopProducts data={topProducts} title="Productos Top" />
       </div>
      
      <div className={s.bottomGrid}>
        <div className={s.tableSection}>
          <h2 className={s.sectionTitle}>Últimos pedidos</h2>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Asesor</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={s.tdMono}>{order.id}</td>
                    <td className={s.tdPrimary}>{order.cliente}</td>
                    <td>{order.asesor}</td>
                    <td>{order.total}</td>
                    <td>
                      <Badge variant={orderStatuses[order.estado]}>
                        {order.estado}
                      </Badge>
                    </td>
                    <td>{order.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className={s.activitySection}>
          <h2 className={s.sectionTitle}>Actividad reciente</h2>
          <div className={s.activityList}>
            <div className={s.activityItem}>
              <span className={s.activityTime}>Hace 5 min</span>
              <span className={s.activityText}>Nuevo pedido #PD-2401 creado</span>
            </div>
            <div className={s.activityItem}>
              <span className={s.activityTime}>Hace 12 min</span>
              <span className={s.activityText}>Stock actualizado: Tela Algodón</span>
            </div>
            <div className={s.activityItem}>
              <span className={s.activityTime}>Hace 1h</span>
              <span className={s.activityText}>Pedido #PD-2399 despachado</span>
            </div>
            <div className={s.activityItem}>
              <span className={s.activityTime}>Ayer</span>
              <span className={s.activityText}>Cliente CL-005 marcado como inactivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};