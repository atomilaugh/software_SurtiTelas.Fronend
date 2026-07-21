import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { BarChart, LineChart, PieChart, TopProducts } from './Chart';
import s from './Dashboard.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { Users, ShoppingBag, Factory, DollarSign } from 'lucide-react';
import { api } from '@/infrastructure/api/httpClient';
import { ORDER_STATUS_COLORS } from '@/shared/constants/options';
import { adminContent } from '@/shared/config/adminContent';

interface DashboardMetrics {
  totalOrders: number;
  totalCustomers: number;
  totalSales: number;
  ordersByStatus: { estado: string; cantidad: number }[];
  recentOrders: Array<{
    id: string;
    numero: string;
    clienteNombre: string;
    asesorNombre: string;
    total: number;
    estado: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{ id: string; ref: string; nombre: string; cantidadStock: number }>;
}

const formatoCOP = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

const formatoMes = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dashboardContent = adminContent.dashboard;

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<DashboardMetrics>('/orders/dashboard');
        setMetrics(data);
      } catch {
        setError(dashboardContent.error);
      } finally {
        setLoading(false);
      }
    };
    void fetchMetrics();
  }, []);

  const stats = metrics
    ? [
        { label: dashboardContent.stats.totalCustomers, value: metrics.totalCustomers.toLocaleString('es-CO'), trend: '', trendUp: true, Icon: Users, color: 'accent' as const },
        { label: dashboardContent.stats.totalOrders, value: metrics.totalOrders.toLocaleString('es-CO'), trend: '', trendUp: true, Icon: ShoppingBag, color: 'success' as const },
        { label: dashboardContent.stats.activeProduction, value: (metrics.ordersByStatus.find(o => o.estado === 'En producción')?.cantidad ?? 0).toLocaleString('es-CO'), trend: '', trendUp: true, Icon: Factory, color: 'info' as const },
        { label: dashboardContent.stats.totalSales, value: formatoCOP(metrics.totalSales), trend: '', trendUp: true, Icon: DollarSign, color: 'warning' as const },
      ]
    : [];

  const recentOrders = metrics?.recentOrders ?? [];

  return (
    <div>
      <h1 className={s.pageTitle}>{dashboardContent.title}</h1>
      <p className={s.pageSubtitle}>{dashboardContent.subtitle}</p>

      {loading && <p className={s.pageSubtitle}>{dashboardContent.loading}</p>}
      {error && <p className={s.pageSubtitle}>{error}</p>}

      {metrics && (
        <>
          <div className={s.statsGrid}>
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          <div className={s.chartsGrid}>
            <BarChart data={recentOrders.slice(0, 6).map((o, i) => ({ label: `#${i + 1}`, value: o.total }))} title={dashboardContent.charts.salesByOrder} />
            <PieChart data={metrics.ordersByStatus.map(o => ({ label: o.estado, value: o.cantidad }))} title={dashboardContent.charts.orderStatus} />
            <LineChart data={metrics.ordersByStatus.map(o => ({ label: o.estado.slice(0, 3), value: o.cantidad }))} title={dashboardContent.charts.trendOrders} />
            <TopProducts data={metrics.lowStockProducts.slice(0, 5).map((p, i) => ({ rank: i + 1, name: p.nombre, sales: `${p.cantidadStock} uds` }))} title={dashboardContent.charts.lowStock} />
          </div>

          <div className={s.bottomGrid}>
            <div className={s.tableSection}>
              <h2 className={s.sectionTitle}>{dashboardContent.tables.recentOrders}</h2>
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
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.5)' }}>
                          {dashboardContent.tables.empty}
                        </td>
                      </tr>
                    ) : (
                       recentOrders.map((order) => (
                         <tr key={order.id}>
                           <td className={s.tdMono}>{order.numero}</td>
                           <td className={s.tdPrimary}>{order.clienteNombre}</td>
                           <td>{order.asesorNombre}</td>
                           <td>{formatoCOP(order.total)}</td>
                           <td>
                              <Badge variant={ORDER_STATUS_COLORS[order.estado] ?? 'default'}>
                               {order.estado}
                             </Badge>
                           </td>
                           <td>{formatoMes(order.createdAt)}</td>
                         </tr>
                       ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={s.activitySection}>
              <h2 className={s.sectionTitle}>{dashboardContent.tables.recentActivity}</h2>
              <div className={s.activityList}>
                {recentOrders.length === 0 ? (
                  <div className={s.activityItem}>
                    <span className={s.activityText}>{dashboardContent.tables.noActivity}</span>
                  </div>
                ) : (
                     recentOrders.slice(0, 4).map((order) => (
                       <div className={s.activityItem} key={order.id}>
                         <span className={s.activityTime}>{formatoMes(order.createdAt)}</span>
                         <span className={s.activityText}>Pedido {order.numero} · {order.clienteNombre}</span>
                       </div>
                     ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
