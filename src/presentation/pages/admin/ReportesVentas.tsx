import React, { useState } from 'react';
import { Search, Download, ShoppingBag, Users, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import s from './ReportesVentas.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface VentaMensual {
  mes: string;
  ventas: number;
  pedidos: number;
  clientes: number;
}

interface VentaRep {
  id: string;
  asesor: string;
  ventasMes: number;
  pedidosMes: number;
  clientesNuevos: number;
  cumplimiento: number;
  ticketPromedio: number;
  comision: number;
}

const ventasMensuales: VentaMensual[] = [
  { mes: 'Ene', ventas: 28500000, pedidos: 45, clientes: 12 },
  { mes: 'Feb', ventas: 32000000, pedidos: 52, clientes: 15 },
  { mes: 'Mar', ventas: 29800000, pedidos: 48, clientes: 10 },
  { mes: 'Abr', ventas: 35000000, pedidos: 58, clientes: 18 },
  { mes: 'May', ventas: 41000000, pedidos: 67, clientes: 22 },
  { mes: 'Jun', ventas: 38500000, pedidos: 61, clientes: 19 },
];

const mockReportes: VentaRep[] = [
  { id: 'R-001', asesor: 'Juan Pérez', ventasMes: 18500000, pedidosMes: 32, clientesNuevos: 8, cumplimiento: 95, ticketPromedio: 578125, comision: 925000 },
  { id: 'R-002', asesor: 'María Gómez', ventasMes: 15200000, pedidosMes: 25, clientesNuevos: 6, cumplimiento: 88, ticketPromedio: 608000, comision: 760000 },
  { id: 'R-003', asesor: 'Carlos Ruiz', ventasMes: 12800000, pedidosMes: 22, clientesNuevos: 4, cumplimiento: 78, ticketPromedio: 581818, comision: 640000 },
  { id: 'R-004', asesor: 'Ana López', ventasMes: 21000000, pedidosMes: 35, clientesNuevos: 10, cumplimiento: 102, ticketPromedio: 600000, comision: 1050000 },
  { id: 'R-005', asesor: 'Pedro Díaz', ventasMes: 9500000, pedidosMes: 18, clientesNuevos: 3, cumplimiento: 65, ticketPromedio: 527778, comision: 475000 },
];

export const AdminReportesVentas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroCumplimiento, setFiltroCumplimiento] = useState<string>('Todos');

  const maxVentas = Math.max(...ventasMensuales.map(d => d.ventas));
  const chartHeight = 220;
  const chartPadding = { top: 20, right: 20, bottom: 30, left: 50 };

  const puntos = ventasMensuales.map((d, i) => ({
    x: chartPadding.left + (i / (ventasMensuales.length - 1)) * (400 - chartPadding.left - chartPadding.right),
    y: chartPadding.top + (1 - d.ventas / maxVentas) * (chartHeight - chartPadding.top - chartPadding.bottom),
  }));

  const pathD = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${puntos[puntos.length - 1].x} ${chartHeight - chartPadding.bottom} L ${puntos[0].x} ${chartHeight - chartPadding.bottom} Z`;

  const reportesFiltrados = mockReportes.filter(r =>
    (filtroCumplimiento === 'Todos' ||
     (filtroCumplimiento === 'Alto' && r.cumplimiento >= 90) ||
     (filtroCumplimiento === 'Medio' && r.cumplimiento >= 75 && r.cumplimiento < 90) ||
     (filtroCumplimiento === 'Bajo' && r.cumplimiento < 75)) &&
    (r.asesor.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    ventasTotales: ventasMensuales.reduce((sum, v) => sum + v.ventas, 0),
    pedidosTotales: ventasMensuales.reduce((sum, v) => sum + v.pedidos, 0),
    clientesNuevos: ventasMensuales.reduce((sum, v) => sum + v.clientes, 0),
    ticketPromedio: Math.round(ventasMensuales.reduce((sum, v) => sum + v.ventas, 0) / ventasMensuales.reduce((sum, v) => sum + v.pedidos, 0)),
    cumplimientoPromedio: Math.round(mockReportes.reduce((sum, r) => sum + r.cumplimiento, 0) / mockReportes.length),
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  const yAxisValues = [0, Math.round(maxVentas * 0.25 / 1000000), Math.round(maxVentas * 0.5 / 1000000), Math.round(maxVentas * 0.75 / 1000000), Math.round(maxVentas / 1000000)];

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Reportes de Ventas</h1>
          <p className={s.pageSubtitle}>Análisis de ventas</p>
        </div>
        <div className={s.headerActions}>
          <select className={s.periodoSelect} defaultValue="ultimos_6_meses">
            <option value="ultimos_6_meses">Últimos 6 meses</option>
            <option value="ultimo_ano">Último año</option>
            <option value="todo">Todo el historial</option>
          </select>
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <DollarSign size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.ventasTotales)}</div>
            <div className={s.statLabel}>Ventas Totales</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardSuccess}`}>
          <ShoppingBag size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{stats.pedidosTotales}</div>
            <div className={s.statLabel}>Pedidos</div>
          </div>
        </div>
        <div className={s.statCard}>
          <Users size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{stats.clientesNuevos}</div>
            <div className={s.statLabel}>Clientes Nuevos</div>
          </div>
        </div>
        <div className={s.statCard}>
          <TrendingUp size={20} className={s.statIconAccent} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.ticketPromedio)}</div>
            <div className={s.statLabel}>Ticket Promedio</div>
          </div>
        </div>
      </div>

      <div className={s.chartSection}>
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3 className={s.chartTitle}>Tendencia de Ventas Mensuales</h3>
          </div>
          <div className={s.lineChartContainer}>
            <div className={s.lineChartYAxis}>
              {yAxisValues.map((v, i) => (
                <span key={i}>${v}M</span>
              ))}
            </div>
            <svg className={s.lineChartSvg} viewBox={`0 0 400 ${chartHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#areaGradient)" />
              <path d={pathD} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {puntos.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4.5" fill="var(--color-bg-surface)" stroke="var(--color-accent)" strokeWidth="2.5" />
                  <circle cx={p.x} cy={p.y} r="2.5" fill="var(--color-accent)" />
                </g>
              ))}
              {puntos.map((p, i) => (
                <text key={`label-${i}`} x={p.x} y={chartHeight - 6} textAnchor="middle" className={s.chartXLabel}>
                  {ventasMensuales[i].mes}
                </text>
              ))}
            </svg>
          </div>
          <div className={s.chartLegend}>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendLine}`} />
              <span>Ventas mensuales</span>
            </div>
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3 className={s.chartTitle}>Pedidos y Clientes por Mes</h3>
          </div>
          <div className={s.metricsChart}>
            {ventasMensuales.map((d, i) => {
              const maxPedidos = Math.max(...ventasMensuales.map(v => v.pedidos));
              const maxClientes = Math.max(...ventasMensuales.map(v => v.clientes));
  const yAxisValues = [0, Math.round(maxVentas * 0.25 / 1000000), Math.round(maxVentas * 0.5 / 1000000), Math.round(maxVentas * 0.75 / 1000000), Math.round(maxVentas / 1000000)];

  return (
                <div key={d.mes} className={s.metricGroup}>
                  <div className={s.metricBars}>
                    <div className={s.metricBarWrapper}>
                      <div
                        className={`${s.metricBar} ${s.metricBarPedidos}`}
                        style={{ height: `${(d.pedidos / maxPedidos) * 100}%` }}
                      />
                    </div>
                    <div className={s.metricBarWrapper}>
                      <div
                        className={`${s.metricBar} ${s.metricBarClientes}`}
                        style={{ height: `${(d.clientes / maxClientes) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={s.metricLabels}>
                    <span className={`${s.metricLabel} ${s.metricLabelPedidos}`}>{d.pedidos}</span>
                    <span className={`${s.metricLabel} ${s.metricLabelClientes}`}>{d.clientes}</span>
                  </div>
                  <div className={s.metricMonth}>{d.mes}</div>
                </div>
              );
            })}
          </div>
          <div className={s.chartLegend}>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendPedidos}`} />
              <span>Pedidos</span>
            </div>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendClientes}`} />
              <span>Clientes nuevos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.tableSection}>
        <div className={s.tableHeader}>
          <h3 className={s.tableTitle}>Reporte por Asesor</h3>
          <div className={s.tableFilters}>
            <div className={s.filterGroup}>
              {['Todos', 'Alto (>=90)', 'Medio (75-89)', 'Bajo (<75)'].map(f => (
                <button
                  key={f}
                  className={`${s.filterBtn} ${filtroCumplimiento === f ? s.filterBtnActive : ''}`}
                  onClick={() => setFiltroCumplimiento(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className={s.searchBox}>
              <Search size={16} className={s.searchIcon} />
              <input
                type="text"
                placeholder="Buscar asesor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={s.searchInput}
              />
            </div>
          </div>
        </div>

        <DataTable<VentaRep>
          data={reportesFiltrados}
          pageSize={10}
          emptyMessage="No se encontraron reportes"
          maxVisibleColumns={5}
          detailPanel={{
            title: (r) => r.asesor,
            render: (r) => (
              <div className={s.detailPanel}>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Rendimiento del asesor</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Ventas del mes</span><span className={s.tdBold}>{formatCurrency(r.ventasMes)}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Pedidos</span><span>{r.pedidosMes}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Clientes nuevos</span><span>{r.clientesNuevos}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Cumplimiento</span><span>{r.cumplimiento}%</span></div>
                  </div>
                </div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Financiero</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Ticket promedio</span><span>{formatCurrency(r.ticketPromedio)}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Comisión</span><span className={s.tdSuccess}>{formatCurrency(r.comision)}</span></div>
                  </div>
                </div>
              </div>
            ),
          }}
          columns={[
            { key: 'asesor', header: 'Asesor', sortable: true, render: (r) => <span className={s.tdPrimary}>{r.asesor}</span> },
            { key: 'ventasMes', header: 'Ventas', width: '140px', sortable: true, render: (r) => (
              <span className={`${s.tdRight} ${s.tdBold}`}>{formatCurrency(r.ventasMes)}</span>
            )},
            { key: 'pedidosMes', header: 'Pedidos', width: '90px', sortable: true, render: (r) => <span className={s.tdCenter}>{r.pedidosMes}</span> },
            { key: 'cumplimiento', header: 'Cumplimiento', width: '150px', sortable: true, render: (r) => (
              <div className={s.cumplimientoCell}>
                <div className={s.cumplimientoBar}>
                  <div
                    className={`${s.cumplimientoFill} ${r.cumplimiento >= 90 ? s.cumplimientoAlto : r.cumplimiento >= 75 ? s.cumplimientoMedio : s.cumplimientoBajo}`}
                    style={{ width: `${Math.min(r.cumplimiento, 100)}%` }}
                  />
                </div>
                <span className={`${s.cumplimientoText} ${r.cumplimiento >= 90 ? s.cumplimientoAlto : r.cumplimiento >= 75 ? s.cumplimientoMedio : s.cumplimientoBajo}`}>
                  {r.cumplimiento}%
                </span>
              </div>
            )},
            { key: 'ticketPromedio', header: 'Ticket Prom.', width: '140px', sortable: true, render: (r) => (
              <span className={s.tdRight}>{formatCurrency(r.ticketPromedio)}</span>
            )},
          ]}
        />
      </div>
    </div>
  );
}

