import React, { useState } from 'react';
import { Search, Download, Users, UserPlus, Activity, Mail, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import s from './ReportesUsuarios.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface UsuarioData {
  mes: string;
  nuevos: number;
  activos: number;
}

interface UsuarioRep {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'asesor' | 'domiciliario' | 'cliente';
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  fechaRegistro: string;
  pedidosRealizados: number;
}

const usuariosMensuales: UsuarioData[] = [
  { mes: 'Ene', nuevos: 12, activos: 85 },
  { mes: 'Feb', nuevos: 15, activos: 92 },
  { mes: 'Mar', nuevos: 10, activos: 98 },
  { mes: 'Abr', nuevos: 18, activos: 105 },
  { mes: 'May', nuevos: 22, activos: 118 },
  { mes: 'Jun', nuevos: 20, activos: 125 },
];

const mockUsuarios: UsuarioRep[] = [
  { id: 'U-001', nombre: 'Admin User', email: 'admin@surtitelas.com', rol: 'admin', estado: 'Activo', fechaRegistro: '2023-01-15', pedidosRealizados: 0 },
  { id: 'U-002', nombre: 'Juan Pérez', email: 'juan@asesor.com', rol: 'asesor', estado: 'Activo', fechaRegistro: '2023-06-20', pedidosRealizados: 145 },
  { id: 'U-003', nombre: 'María Gómez', email: 'maria@asesor.com', rol: 'asesor', estado: 'Activo', fechaRegistro: '2023-08-10', pedidosRealizados: 132 },
  { id: 'U-004', nombre: 'Carlos Ruiz', email: 'carlos@domiciliario.com', rol: 'domiciliario', estado: 'Activo', fechaRegistro: '2024-01-05', pedidosRealizados: 0 },
  { id: 'U-005', nombre: 'Tienda La Esquina', email: 'contacto@laesquina.com', rol: 'cliente', estado: 'Activo', fechaRegistro: '2023-03-12', pedidosRealizados: 45 },
  { id: 'U-006', nombre: 'Distribuidora Norte', email: 'pedidos@delnorte.com', rol: 'cliente', estado: 'Activo', fechaRegistro: '2023-05-18', pedidosRealizados: 38 },
  { id: 'U-007', nombre: 'Ana López', email: 'ana@asesor.com', rol: 'asesor', estado: 'Inactivo', fechaRegistro: '2023-09-22', pedidosRealizados: 89 },
  { id: 'U-008', nombre: 'Pedro Díaz', email: 'pedro@asesor.com', rol: 'asesor', estado: 'Pendiente', fechaRegistro: '2024-05-01', pedidosRealizados: 12 },
];

const rolData = [
  { rol: 'Administradores', cantidad: mockUsuarios.filter(u => u.rol === 'admin').length, color: '#f59e0b' },
  { rol: 'Asesores', cantidad: mockUsuarios.filter(u => u.rol === 'asesor').length, color: '#3b82f6' },
  { rol: 'Domiciliarios', cantidad: mockUsuarios.filter(u => u.rol === 'domiciliario').length, color: '#8b5cf6' },
  { rol: 'Clientes', cantidad: mockUsuarios.filter(u => u.rol === 'cliente').length, color: '#10b981' },
];

const estadoData = [
  { estado: 'Activos', cantidad: mockUsuarios.filter(u => u.estado === 'Activo').length, color: '#10b981' },
  { estado: 'Inactivos', cantidad: mockUsuarios.filter(u => u.estado === 'Inactivo').length, color: '#ef4444' },
  { estado: 'Pendientes', cantidad: mockUsuarios.filter(u => u.estado === 'Pendiente').length, color: '#f59e0b' },
];

const DONUT_CX = 90;
const DONUT_CY = 90;
const DONUT_RADIUS = 54;
const DONUT_STROKE = 18;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_GAP = 1.2;

interface DonutChartProps {
  data: { label: string; cantidad: number; color: string }[];
  centerValue?: number | string;
  centerLabel?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, centerValue, centerLabel }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum: number, d: { cantidad: number }) => sum + d.cantidad, 0);

  const segments = data.map((item: { label: string; cantidad: number; color: string }) => {
    const segmentLen = total > 0 ? (item.cantidad / total) * 2 * Math.PI * 54 : 0;
    const drawLen = Math.max(0, segmentLen - 1.2);
    return {
      color: item.color,
      drawLen,
      pct: total > 0 ? (item.cantidad / total) * 100 : 0,
    };
  });

  let accumulated = 0;

  return (
    <div className={s.pieContainer}>
      <svg width={180} height={180} viewBox="0 0 180 180" className={s.pieSvg}>
        <g transform="rotate(-90 90 90)">
          <circle cx={90} cy={90} r={54} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={18} />
          {segments.map((seg: { color: string; drawLen: number; pct: number }, i: number) => {
            const offset = -accumulated;
            accumulated += (seg.drawLen + DONUT_GAP);

            return (
              <circle
                key={i}
                cx={DONUT_CX}
                cy={DONUT_CY}
                r={DONUT_RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={DONUT_STROKE}
                strokeDasharray={`${seg.drawLen} ${DONUT_CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={s.pieSlice}
                style={{
                  transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, filter 0.3s ease',
                  opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.25 : 1,
                  filter: hoveredIndex === i ? 'drop-shadow(0 0 12px rgba(255,255,255,0.28))' : 'none',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </g>
        <text x={DONUT_CX} y={DONUT_CY - 5} textAnchor="middle" className={s.pieNum}>
          {centerValue ?? total}
        </text>
        <text x={DONUT_CX} y={DONUT_CY + 14} textAnchor="middle" className={s.pieTxt}>
          {centerLabel}
        </text>
      </svg>
      <div className={s.legendCol}>
        {data.map((item, i) => (
          <div key={i} className={s.legendRow}>
            <div className={s.legendSwatch} style={{ background: item.color }} />
            <div className={s.legendInfo}>
              <span className={s.legendName}>{item.label}</span>
              <span className={s.legendMeta}>
                {item.cantidad} · {segments[i]?.pct.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsuarioDetailPanel: React.FC<{ item: UsuarioRep }> = ({ item }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-semibold text-lg">
        {item.nombre.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{item.nombre}</h3>
        <p className="text-sm text-[var(--color-text-muted)]">{item.id}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3">
      <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
        <Mail size={16} className="text-[var(--color-text-muted)]" />
        <div className="flex-1">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Email</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
        <Calendar size={16} className="text-[var(--color-text-muted)]" />
        <div className="flex-1">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Fecha Registro</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{new Date(item.fechaRegistro).toLocaleDateString('es-CO')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
        <ShoppingBag size={16} className="text-[var(--color-text-muted)]" />
        <div className="flex-1">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Pedidos</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.pedidosRealizados} pedidos realizados</p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Estado</span>
      <Badge variant={item.estado === 'Activo' ? 'success' : item.estado === 'Pendiente' ? 'warning' : 'default'} dot>
        {item.estado}
      </Badge>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Rol</span>
      <Badge variant={item.rol === 'admin' ? 'warning' : item.rol === 'asesor' ? 'primary' : item.rol === 'domiciliario' ? 'purple' : 'success'}>
        {item.rol}
      </Badge>
    </div>
  </div>
);

export const AdminReportesUsuarios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroRol, setFiltroRol] = useState<string>('Todos');

  const total = mockUsuarios.length;
  const activos = mockUsuarios.filter(u => u.estado === 'Activo').length;
  const nuevosMes = usuariosMensuales[usuariosMensuales.length - 1].nuevos;
  const crecimiento = ((usuariosMensuales[usuariosMensuales.length - 1].activos - usuariosMensuales[usuariosMensuales.length - 2].activos) / usuariosMensuales[usuariosMensuales.length - 2].activos * 100).toFixed(1);

  const filtrados = mockUsuarios.filter(u =>
    (filtroRol === 'Todos' || u.rol === filtroRol) &&
    (u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const maxNuevos = Math.max(...usuariosMensuales.map(d => d.nuevos));

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Reportes de Usuarios</h1>
          <p className={s.pageSubtitle}>Análisis de usuarios</p>
        </div>
        <div className={s.headerActions}>
          <Button variant="secondary" leftIcon={<Download size={16} />}>Exportar</Button>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <Users size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{total}</div>
            <div className={s.statLabel}>Total Usuarios</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardSuccess}`}>
          <Activity size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{activos}</div>
            <div className={s.statLabel}>Activos</div>
          </div>
        </div>
        <div className={s.statCard}>
          <UserPlus size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>+{nuevosMes}</div>
            <div className={s.statLabel}>Nuevos este mes</div>
          </div>
        </div>
        <div className={s.statCard}>
          <TrendingUp size={20} className={s.statIconAccent} />
          <div>
            <div className={s.statValue}>+{crecimiento}%</div>
            <div className={s.statLabel}>Crecimiento</div>
          </div>
        </div>
      </div>

      <div className={s.chartsRow}>
        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Distribución por Rol</h3>
          <DonutChart data={rolData.map(d => ({ label: d.rol, cantidad: d.cantidad, color: d.color }))} centerValue={total} centerLabel="Usuarios" />
        </div>

        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Estado de Usuarios</h3>
          <DonutChart data={estadoData.map(d => ({ label: d.estado, cantidad: d.cantidad, color: d.color }))} centerValue={activos} centerLabel="Activos" />
        </div>
      </div>

      <div className={s.chartSection}>
        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Usuarios Nuevos por Mes</h3>
          <div className={s.miniChart}>
            {usuariosMensuales.map((d) => (
              <div key={d.mes} className={s.miniBarGroup}>
                <div className={s.miniBarCol}>
                  <div className={s.miniBarTrack}>
                    <div className={s.miniBarFill} style={{ height: `${(d.nuevos / Math.max(maxNuevos, 1)) * 100}%` }} />
                  </div>
                </div>
                <div className={s.miniBarLabel}>{d.mes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Resumen</h3>
          <div className={s.summaryGrid}>
            <div className={s.summaryItem}>
              <div className={s.summaryVal}>{mockUsuarios.filter(u => u.rol === 'asesor').length}</div>
              <div className={s.summaryLbl}>Asesores</div>
            </div>
            <div className={s.summaryItem}>
              <div className={s.summaryVal}>{mockUsuarios.filter(u => u.rol === 'cliente').length}</div>
              <div className={s.summaryLbl}>Clientes</div>
            </div>
            <div className={s.summaryItem}>
              <div className={s.summaryVal}>{mockUsuarios.filter(u => u.estado === 'Inactivo').length}</div>
              <div className={s.summaryLbl}>Inactivos</div>
            </div>
            <div className={s.summaryItem}>
              <div className={s.summaryVal}>{mockUsuarios.filter(u => u.rol === 'domiciliario').length}</div>
              <div className={s.summaryLbl}>Domiciliarios</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.tableSection}>
        <div className={s.tableHeader}>
          <h3 className={s.tableTitle}>Usuarios Registrados</h3>
          <div className={s.tableFilters}>
            <div className={s.filterGroup}>
              {['Todos', 'admin', 'asesor', 'domiciliario', 'cliente'].map(rol => (
                <button key={rol} className={`${s.filterBtn} ${filtroRol === rol ? s.filterBtnActive : ''}`} onClick={() => setFiltroRol(rol)}>
                  {rol === 'Todos' ? 'Todos' : rol.charAt(0).toUpperCase() + rol.slice(1)}
                </button>
              ))}
            </div>
            <div className={s.searchBox}>
              <Search size={16} className={s.searchIcon} />
              <input type="text" placeholder="Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)} className={s.searchInput} />
            </div>
          </div>
        </div>
        <DataTable<UsuarioRep>
          data={filtrados}
          pageSize={10}
          emptyMessage="No se encontraron usuarios"
          enableSorting
          enableColumnFilters
          enableRowSelection
          enableExport
          exportFileName="reportes_usuarios"
          maxVisibleColumns={5}
          detailPanel={{
            title: (item) => item.nombre,
            render: (item) => (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-semibold text-lg">
                    {item.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{item.nombre}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
                    <Mail size={16} className="text-[var(--color-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
                    <Calendar size={16} className="text-[var(--color-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Fecha Registro</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{new Date(item.fechaRegistro).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
                    <ShoppingBag size={16} className="text-[var(--color-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Pedidos</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.pedidosRealizados} pedidos realizados</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Estado</span>
                  <Badge variant={item.estado === 'Activo' ? 'success' : item.estado === 'Pendiente' ? 'warning' : 'default'} dot>
                    {item.estado}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Rol</span>
                  <Badge variant={item.rol === 'admin' ? 'warning' : item.rol === 'asesor' ? 'primary' : item.rol === 'domiciliario' ? 'purple' : 'success'}>
                    {item.rol}
                  </Badge>
                </div>
              </div>
            ),
          }}
          columns={[
            { key: 'id', header: 'ID', width: '80px', sortable: true, filterable: true, render: (u) => <span className={s.tdMono}>{u.id}</span> },
            { key: 'nombre', header: 'Nombre', sortable: true, filterable: true, render: (u) => (
              <div className="flex flex-col">
                <span className={s.tdPrimary}>{u.nombre}</span>
                <span className={s.tdMuted}>{u.email}</span>
              </div>
            )},
            { key: 'rol', header: 'Rol', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
              { value: 'admin', label: 'Admin' },
              { value: 'asesor', label: 'Asesor' },
              { value: 'domiciliario', label: 'Domiciliario' },
              { value: 'cliente', label: 'Cliente' },
            ], render: (u) => (
              <Badge variant={u.rol === 'admin' ? 'warning' : u.rol === 'asesor' ? 'primary' : u.rol === 'domiciliario' ? 'purple' : 'success'}>
                {u.rol}
              </Badge>
            )},
            { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
              { value: 'Activo', label: 'Activo' },
              { value: 'Inactivo', label: 'Inactivo' },
              { value: 'Pendiente', label: 'Pendiente' },
            ], render: (u) => (
              <div className="flex items-center gap-1.5">
                {u.estado === 'Activo' ? <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" /> :
                 u.estado === 'Pendiente' ? <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" /> :
                 <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)]" />}
                <Badge variant={u.estado === 'Activo' ? 'success' : u.estado === 'Pendiente' ? 'warning' : 'default'}>
                  {u.estado}
                </Badge>
              </div>
            )},
            { key: 'fechaRegistro', header: 'Registro', width: '110px', sortable: true, render: (u) => (
              <span className={s.tdMuted}>{new Date(u.fechaRegistro).toLocaleDateString('es-CO')}</span>
            )},
          ]}
        />
      </div>
    </div>
  );
};

