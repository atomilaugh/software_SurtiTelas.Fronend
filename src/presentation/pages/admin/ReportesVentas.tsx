import React, { useState, useEffect } from 'react';
import { Search, Download, ShoppingBag, Users, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import s from './ReportesVentas.module.css';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { reportsApi } from '@/infrastructure/api/reportsApi';
import { PERIODOS_REPORTE_VENTAS, FILTROS_CUMPLIMIENTO } from '@/shared/constants/options';

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

export const AdminReportesVentas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroCumplimiento, setFiltroCumplimiento] = useState<string>('Todos');
  const [reportes, setReportes] = useState<VentaRep[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await reportsApi.getSalesReport();
        const mapped: VentaRep[] = (data.salesByAsesor || []).map((item, index) => {
          const total = Number(item.total) || 0;
          const cantidad = Number(item.cantidad) || 0;
          const totalSales = Number(data.totalSales) || 0;
          return {
            id: `R-${String(index + 1).padStart(3, '0')}`,
            asesor: item.asesorNombre || item.asesor || `Asesor ${index + 1}`,
            ventasMes: total,
            pedidosMes: cantidad,
            clientesNuevos: 0,
            cumplimiento: total > 0 && totalSales > 0 ? Math.round((total / totalSales) * 100) : 0,
            ticketPromedio: cantidad > 0 ? Math.round(total / cantidad) : 0,
            comision: Math.round(total * 0.05),
          };
        });
        setReportes(mapped);
      } catch {
        setError('No se pudo cargar el reporte de ventas');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const maxVentas = Math.max(...reportes.map(d => d.ventasMes), 1);
  const chartHeight = 220;
  const chartPadding = { top: 20, right: 20, bottom: 30, left: 50 };

  const puntos = reportes.map((d, i) => ({
    x: chartPadding.left + (i / Math.max(reportes.length - 1, 1)) * (400 - chartPadding.left - chartPadding.right),
    y: chartPadding.top + (1 - d.ventasMes / maxVentas) * (chartHeight - chartPadding.top - chartPadding.bottom),
  }));

  const pathD = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = puntos.length > 0 ? `${pathD} L ${puntos[puntos.length - 1].x} ${chartHeight - chartPadding.bottom} L ${puntos[0].x} ${chartHeight - chartPadding.bottom} Z` : '';

  const reportesFiltrados = reportes.filter(r =>
    (FILTROS_CUMPLIMIENTO.find(f => f.value === filtroCumplimiento)?.test(r.cumplimiento) ?? true) &&
    (r.asesor?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    ventasTotales: reportes.reduce((sum, r) => sum + r.ventasMes, 0),
    pedidosTotales: reportes.reduce((sum, r) => sum + r.pedidosMes, 0),
    ticketPromedio: reportes.length > 0 ? Math.round(reportes.reduce((sum, r) => sum + r.ventasMes, 0) / Math.max(reportes.reduce((sum, r) => sum + r.pedidosMes, 0), 1)) : 0,
    cumplimientoPromedio: reportes.length > 0 ? Math.round(reportes.reduce((sum, r) => sum + r.cumplimiento, 0) / reportes.length) : 0,
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
          <div className={s.periodoSelect}>
            <select className={s.select} defaultValue="ultimos_6_meses">
              {PERIODOS_REPORTE_VENTAS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className={s.selectIcon} />
          </div>
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
                   {reportes[i]?.asesor?.charAt(0) || ''}
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
            {reportes.length > 0 ? (
              reportes.map((d) => {
                const maxPedidos = Math.max(...reportes.map(v => v.pedidosMes), 1);

                return (
                  <div key={d.id} className={s.metricGroup}>
                    <div className={s.metricBars}>
                      <div className={s.metricBarWrapper}>
                        <div
                          className={`${s.metricBar} ${s.metricBarPedidos}`}
                          style={{ height: `${(d.pedidosMes / maxPedidos) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={s.metricLabels}>
                      <span className={`${s.metricLabel} ${s.metricLabelPedidos}`}>{d.pedidosMes}</span>
                    </div>
                    <div className={s.metricMonth}>{d.asesor.split(' ')[0]}</div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No hay datos de pedidos disponibles</p>
            )}
          </div>
          <div className={s.chartLegend}>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendPedidos}`} />
              <span>Pedidos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.tableSection}>
        <div className={s.tableHeader}>
          <h3 className={s.tableTitle}>Reporte por Asesor</h3>
          <div className={s.tableFilters}>
            <div className={s.filterGroup}>
              {FILTROS_CUMPLIMIENTO.map(f => (
                <button
                  key={f.value}
                  className={`${s.filterBtn} ${filtroCumplimiento === f.value ? s.filterBtnActive : ''}`}
                  onClick={() => setFiltroCumplimiento(f.value)}
                >
                  {f.label}
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
          emptyMessage="Sin resultados"
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

