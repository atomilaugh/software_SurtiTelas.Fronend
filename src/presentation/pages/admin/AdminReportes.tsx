import React, { useState } from 'react';
import { Search, Download, Calendar, BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react';
import s from './AdminReportes.module.css';
import { StatCard } from './StatCard';
import { Badge } from '../../../shared/ui/Badge';
import { BarChart, LineChart as LineChartComp, PieChart as PieChartComp, TopProducts } from './Chart';

const reportStats = [
  { label: 'Ventas Totales', value: '$128M', trend: '+15%', trendUp: true, Icon: BarChart3, color: 'accent' as const },
  { label: 'Pedidos Completados', value: '1,847', trend: '+8%', trendUp: true, Icon: TrendingUp, color: 'success' as const },
  { label: 'Clientes Nuevos', value: '128', trend: '+22%', trendUp: true, Icon: PieChart, color: 'info' as const },
  { label: 'Comisiones Pagadas', value: '$8.4M', trend: '-3%', trendUp: false, Icon: LineChart, color: 'warning' as const },
];

interface Reporte {
  id: string;
  tipo: string;
  periodo: string;
  generado: string;
  estado: 'Disponible' | 'Procesando' | 'Error';
}

const mockReportes: Reporte[] = [
  { id: 'RPT-001', tipo: 'Ventas por Periodo', periodo: 'Junio 2026', generado: 'Hace 2 horas', estado: 'Disponible' },
  { id: 'RPT-002', tipo: 'Rendimiento de Asesores', periodo: 'Mayo 2026', generado: 'Hace 1 día', estado: 'Disponible' },
  { id: 'RPT-003', tipo: 'Productos Más Vendidos', periodo: 'Junio 2026', generado: 'Hace 3 horas', estado: 'Disponible' },
  { id: 'RPT-004', tipo: 'Inventario por Categoría', periodo: 'Junio 2026', generado: 'Hace 5 horas', estado: 'Procesando' },
  { id: 'RPT-005', tipo: 'Clientes por Asesor', periodo: 'Mayo 2026', generado: 'Ayer', estado: 'Disponible' },
  { id: 'RPT-006', tipo: 'Reporte de Devoluciones', periodo: 'Junio 2026', generado: 'Hace 1 hora', estado: 'Error' },
];

const reportStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default' | null> = {
  Disponible: 'success',
  Procesando: 'warning',
  Error: 'danger',
};

const ventasPorCategoria = [
  { label: 'Algodón', value: 42 },
  { label: 'Lino', value: 28 },
  { label: 'Seda', value: 18 },
  { label: 'Poliéster', value: 12 },
];

const tendenciaMensual = [
  { label: 'Ene', value: 25 },
  { label: 'Feb', value: 32 },
  { label: 'Mar', value: 28 },
  { label: 'Abr', value: 35 },
  { label: 'May', value: 42 },
  { label: 'Jun', value: 48 },
];

const rankingAsesores = [
  { label: 'Camila', value: 248 },
  { label: 'Luis', value: 192 },
  { label: 'Pedro', value: 156 },
  { label: 'María', value: 94 },
];

const productosTop = [
  { rank: 1, name: 'Tela Algodón Premium', sales: '$18.2M' },
  { rank: 2, name: 'Lino Egipcio', sales: '$12.5M' },
  { rank: 3, name: 'Poliéster Soft', sales: '$8.9M' },
];

export const AdminReportes: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredReportes = mockReportes.filter(r =>
    r.tipo.toLowerCase().includes(search.toLowerCase()) ||
    r.periodo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Reportes</h1>
          <p className={s.pageSubtitle}>Análisis y reportes del sistema</p>
        </div>
      </div>

      <div className={s.statsGrid}>
        {reportStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className={s.toolbar}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar reportes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
        <button className={s.filterBtn}>
          <Calendar size={14} />
          Filtrar por fecha
        </button>
      </div>

      <div className={s.reportGrid}>
        <div className={s.chartCard}>
          <PieChartComp data={ventasPorCategoria} title="Ventas por Categoría" />
        </div>
        <div className={s.chartCard}>
          <LineChartComp data={tendenciaMensual} title="Tendencia Mensual" />
        </div>
        <div className={s.chartCard}>
          <BarChart data={rankingAsesores} title="Ranking de Asesores" />
        </div>
        <div className={s.chartCard}>
          <TopProducts data={productosTop} title="Productos Top" />
        </div>
      </div>

      <div className={s.tableSection}>
        <h2 className={s.sectionTitle}>Reportes Generados</h2>
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Periodo</th>
                <th>Generado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReportes.map(reporte => (
                <tr key={reporte.id}>
                  <td className={s.tdMono}>{reporte.id}</td>
                  <td className={s.tdPrimary}>{reporte.tipo}</td>
                  <td>{reporte.periodo}</td>
                  <td>{reporte.generado}</td>
                  <td>
                    <Badge variant={reportStatuses[reporte.estado]}>
                      {reporte.estado}
                    </Badge>
                  </td>
                  <td>
                    <button className={s.downloadBtn} disabled={reporte.estado !== 'Disponible'}>
                      <Download size={14} />
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};