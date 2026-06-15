import React, { useState } from 'react';
import { Search, Download, Factory, CheckCircle, Clock, Package, BarChart3, TrendingUp } from 'lucide-react';
import s from './ReportesProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface ProduccionData {
  mes: string;
  ordenes: number;
  completadas: number;
  pendientes: number;
}

interface ProduccionRep {
  id: string;
  taller: string;
  ordenesCompletadas: number;
  ordenesPendientes: number;
  eficiencia: number;
  prendasProducidas: number;
  valorProduccion: number;
  promedioDias: number;
}

const produccionMensual: ProduccionData[] = [
  { mes: 'Ene', ordenes: 12, completadas: 10, pendientes: 2 },
  { mes: 'Feb', ordenes: 15, completadas: 13, pendientes: 2 },
  { mes: 'Mar', ordenes: 18, completadas: 16, pendientes: 2 },
  { mes: 'Abr', ordenes: 14, completadas: 12, pendientes: 2 },
  { mes: 'May', ordenes: 20, completadas: 18, pendientes: 2 },
  { mes: 'Jun', ordenes: 22, completadas: 19, pendientes: 3 },
];

const mockReportes: ProduccionRep[] = [
  { id: 'R-001', taller: 'Taller Textil El Progreso', ordenesCompletadas: 45, ordenesPendientes: 3, eficiencia: 92, prendasProducidas: 8500, valorProduccion: 425000000, promedioDias: 4.2 },
  { id: 'R-002', taller: 'Confección Martínez', ordenesCompletadas: 38, ordenesPendientes: 5, eficiencia: 85, prendasProducidas: 6200, valorProduccion: 310000000, promedioDias: 5.1 },
  { id: 'R-003', taller: 'Taller San José', ordenesCompletadas: 52, ordenesPendientes: 2, eficiencia: 96, prendasProducidas: 9800, valorProduccion: 490000000, promedioDias: 3.5 },
  { id: 'R-004', taller: 'Artesanías del Valle', ordenesCompletadas: 28, ordenesPendientes: 4, eficiencia: 78, prendasProducidas: 4100, valorProduccion: 205000000, promedioDias: 6.8 },
  { id: 'R-005', taller: 'Taller Rápido', ordenesCompletadas: 15, ordenesPendientes: 8,eficiencia: 65, prendasProducidas: 2200, valorProduccion: 110000000, promedioDias: 8.2 },
];

export const AdminReportesProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEficiencia, setFiltroEficiencia] = useState<string>('Todos');

  const maxOrdenes = Math.max(...produccionMensual.map(d => d.ordenes));
  // unused removed

  const reportesFiltrados = mockReportes.filter(r =>
    (filtroEficiencia === 'Todos' ||
      (filtroEficiencia === 'Alta' && r.eficiencia >= 90) ||
      (filtroEficiencia === 'Media' && r.eficiencia >= 75 && r.eficiencia < 90) ||
      (filtroEficiencia === 'Baja' && r.eficiencia < 75)) &&
    (r.taller.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    totalTalleres: mockReportes.length,
    ordenesCompletadas: mockReportes.reduce((sum, r) => sum + r.ordenesCompletadas, 0),
    ordenesPendientes: mockReportes.reduce((sum, r) => sum + r.ordenesPendientes, 0),
    eficienciaPromedio: Math.round(mockReportes.reduce((sum, r) => sum + r.eficiencia, 0) / mockReportes.length),
    prendasTotales: mockReportes.reduce((sum, r) => sum + r.prendasProducidas, 0),
    valorTotal: mockReportes.reduce((sum, r) => sum + r.valorProduccion, 0),
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  const getEficienciaColor = (eficiencia: number) => {
    if (eficiencia >= 90) return s.eficienciaAlta;
    if (eficiencia >= 75) return s.eficienciaMedia;
    return s.eficienciaBaja;
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Reportes de Producción</h1>
          <p className={s.pageSubtitle}>Análisis de producción</p>
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
          <Factory size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{stats.totalTalleres}</div>
            <div className={s.statLabel}>Talleres Activos</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardSuccess}`}>
          <CheckCircle size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{stats.ordenesCompletadas}</div>
            <div className={s.statLabel}>Órdenes Completadas</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardWarning}`}>
          <Clock size={20} className={s.statIconWarning} />
          <div>
            <div className={s.statValue}>{stats.ordenesPendientes}</div>
            <div className={s.statLabel}>Órdenes Pendientes</div>
          </div>
        </div>
        <div className={s.statCard}>
          <TrendingUp size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{stats.eficienciaPromedio}%</div>
            <div className={s.statLabel}>Eficiencia Promedio</div>
          </div>
        </div>
        <div className={s.statCard}>
          <Package size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{stats.prendasTotales.toLocaleString('es-CO')}</div>
            <div className={s.statLabel}>Prendas Producidas</div>
          </div>
        </div>
      </div>

      <div className={s.chartSection}>
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3 className={s.chartTitle}>
              <BarChart3 size={18} className={s.chartIcon} />
              Producción Mensual (Órdenes Completadas vs Pendientes)
            </h3>
          </div>
          <div className={s.barChartContainer}>
            <div className={s.barChartYAxis}>
              <span>25</span>
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>
            <div className={s.barChart}>
              {produccionMensual.map(d => (
                <div key={d.mes} className={s.barGroup}>
                  <div className={s.barStacked}>
                    <div
                      className={`${s.barFill} ${s.barCompletadas}`}
                      style={{ height: `${(d.completadas / maxOrdenes) * 100}%` }}
                    />
                    <div
                      className={`${s.barFill} ${s.barPendientes}`}
                      style={{ height: `${(d.pendientes / maxOrdenes) * 100}%` }}
                    />
                  </div>
                  <div className={s.barLabelBottom}>
                    <span className={s.barMes}>{d.mes}</span>
                    <span className={s.barTotal}>{d.ordenes} órds</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={s.chartLegend}>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendCompletadas}`} />
              <span>Completadas</span>
            </div>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} ${s.legendPendientes}`} />
              <span>Pendientes</span>
            </div>
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3 className={s.chartTitle}>
              <Factory size={18} className={s.chartIcon} />
              Producción por Taller (Prendas Producidas)
            </h3>
          </div>
          <div className={s.tallerChart}>
            {(() => {
              const maxPrendas = Math.max(...mockReportes.map(r => r.prendasProducidas));
              return mockReportes.map(r => (
                <div key={r.id} className={s.tallerBarRow}>
                  <div className={s.tallerName}>{r.taller}</div>
                  <div className={s.tallerBarTrack}>
                    <div
                      className={s.tallerBarFill}
                      style={{ width: `${(r.prendasProducidas / maxPrendas) * 100}%` }}
                    />
                  </div>
                  <div className={s.tallerBarValue}>
                    {(r.prendasProducidas / 1000).toFixed(1)}K
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      <div className={s.tableSection}>
        <div className={s.tableHeader}>
          <h3 className={s.tableTitle}>Reporte por Taller</h3>
          <div className={s.tableFilters}>
            <div className={s.filterGroup}>
              {['Todos', 'Alta (>=90)', 'Media (75-89)', 'Baja (<75)'].map(f => (
                <button
                  key={f}
                  className={`${s.filterBtn} ${filtroEficiencia === f ? s.filterBtnActive : ''}`}
                  onClick={() => setFiltroEficiencia(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className={s.searchBox}>
              <Search size={16} className={s.searchIcon} />
              <input
                type="text"
                placeholder="Buscar taller..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={s.searchInput}
              />
            </div>
          </div>
        </div>

        <DataTable<ProduccionRep>
          data={reportesFiltrados}
          pageSize={10}
          emptyMessage="No se encontraron reportes"
          maxVisibleColumns={5}
          detailPanel={{
            title: (r) => r.taller,
            render: (r) => (
              <div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Rendimiento del taller</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Completadas</span><span className={s.tdSuccess}>{r.ordenesCompletadas}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Pendientes</span><span>{r.ordenesPendientes}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Eficiencia</span><span>{r.eficiencia}%</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Prendas</span><span>{r.prendasProducidas.toLocaleString('es-CO')}</span></div>
                  </div>
                </div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Financiero</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Valor Producción</span><span className={s.tdBold}>{formatCurrency(r.valorProduccion)}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Promedio Días</span><span>{r.promedioDias} días</span></div>
                  </div>
                </div>
              </div>
            ),
          }}
          columns={[
            { key: 'taller', header: 'Taller', sortable: true, render: (r) => <span className={s.tdPrimary}>{r.taller}</span> },
            { key: 'ordenesCompletadas', header: 'Completadas', width: '120px', sortable: true, render: (r) => (
              <span className={`${s.tdCenter} ${s.tdSuccess}`}>{r.ordenesCompletadas}</span>
            )},
            { key: 'eficiencia', header: 'Eficiencia', width: '140px', sortable: true, render: (r) => (
              <div className={s.eficienciaCell}>
                <div className={s.eficienciaBar}>
                  <div
                    className={`${s.eficienciaFill} ${getEficienciaColor(r.eficiencia)}`}
                    style={{ width: `${r.eficiencia}%` }}
                  />
                </div>
                <span className={`${s.eficienciaText} ${getEficienciaColor(r.eficiencia)}`}>
                  {r.eficiencia}%
                </span>
              </div>
            )},
            { key: 'prendasProducidas', header: 'Prendas', width: '110px', sortable: true, render: (r) => (
              <span className={s.tdCenter}>{r.prendasProducidas.toLocaleString('es-CO')}</span>
            )},
            { key: 'valorProduccion', header: 'Valor Prod.', width: '140px', sortable: true, render: (r) => (
              <span className={`${s.tdRight} ${s.tdBold}`}>{formatCurrency(r.valorProduccion)}</span>
            )},
          ]}
        />
      </div>
    </div>
  );
}

