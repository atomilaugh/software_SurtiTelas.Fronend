import React, { useState } from 'react';
import { Search, AlertTriangle, Bell, Clock, Calendar, Factory, Package, X, CheckCircle } from 'lucide-react';
import s from './AlertasSeguimientoProduccion.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface AlertaSeguimiento {
  id: string;
  numeroOrden: string;
  prenda: string;
  tallerNombre: string;
  tipo: 'Retraso en entrega' | 'Cancelacion de taller' | 'Calidad baja' | 'Cambio de fecha' | 'Produccion detenida' | 'Material faltante';
  descripcion: string;
  fechaAlerta: string;
  fechaComprometida: string;
  estado: 'Pendiente' | 'Vista' | 'Resuelta';
  prioridad: 'Alta' | 'Media' | 'Baja';
  avance: number;
}

const mockAlertas: AlertaSeguimiento[] = [
  { id: 'AS-001', numeroOrden: 'ORD-2024-013', prenda: 'Camisa manga larga', tallerNombre: 'Taller Textil El Progreso', tipo: 'Retraso en entrega', descripcion: 'Orden con 3 días de retraso. Taller reportó demora en insumos', fechaAlerta: '2024-06-10', fechaComprometida: '2024-06-12', estado: 'Pendiente', prioridad: 'Alta', avance: 45 },
  { id: 'AS-002', numeroOrden: 'ORD-2024-014', prenda: 'Pantalón jean', tallerNombre: 'Confección Martínez', tipo: 'Produccion detenida', descripcion: 'Producción detenida por falla de maquinaria', fechaAlerta: '2024-06-10', fechaComprometida: '2024-06-15', estado: 'Pendiente', prioridad: 'Alta', avance: 30 },
  { id: 'AS-003', numeroOrden: 'ORD-2024-015', prenda: 'Blusa estampada', tallerNombre: 'Taller San José', tipo: 'Cambio de fecha', descripcion: 'Taller solicita extensión de 2 días para entrega', fechaAlerta: '2024-06-09', fechaComprometida: '2024-06-14', estado: 'Vista', prioridad: 'Media', avance: 70 },
  { id: 'AS-004', numeroOrden: 'ORD-2024-016', prenda: 'Vestido casual', tallerNombre: 'Artesanías del Valle', tipo: 'Calidad baja', descripcion: 'Inspección detectó defectos en 15% de prendas', fechaAlerta: '2024-06-08', fechaComprometida: '2024-06-18', estado: 'Pendiente', prioridad: 'Media', avance: 85 },
  { id: 'AS-005', numeroOrden: 'ORD-2024-017', prenda: 'Short deportivo', tallerNombre: 'Taller Rápido', tipo: 'Cancelacion de taller', descripcion: 'Taller canceló orden por sobrecupo. Requiere reasignación', fechaAlerta: '2024-06-07', fechaComprometida: '2024-06-20', estado: 'Resuelta', prioridad: 'Alta', avance: 0 },
  { id: 'AS-006', numeroOrden: 'ORD-2024-018', prenda: 'Chaqueta impermeable', tallerNombre: 'Confección Martínez', tipo: 'Material faltante', descripcion: 'Falta tela impermeable. Orden en espera de insumo', fechaAlerta: '2024-06-10', fechaComprometida: '2024-06-16', estado: 'Pendiente', prioridad: 'Alta', avance: 20 },
];

export const AdminAlertasSeguimientoProduccion: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pendiente' | 'Vista' | 'Resuelta'>('Todos');
  const [filtroTipo] = useState<string>('Todos');
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaSeguimiento | null>(null);
  const [_showFilters] = useState(true);

  const filteredAlertas = mockAlertas.filter(a =>
    (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
    (filtroTipo === 'Todos' || a.tipo === filtroTipo) &&
    (a.numeroOrden.toLowerCase().includes(search.toLowerCase()) ||
     a.prenda.toLowerCase().includes(search.toLowerCase()) ||
     a.tallerNombre.toLowerCase().includes(search.toLowerCase()) ||
     a.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

 // const tiposUnicos = Array.from(new Set(mockAlertas.map(a => a.tipo)));

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'warning';
      case 'Resuelta': return 'success';
      default: return 'default';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Retraso en entrega': return <Clock size={14} />;
      case 'Cancelacion de taller': return <AlertTriangle size={14} />;
      case 'Calidad baja': return <Package size={14} />;
      case 'Cambio de fecha': return <Calendar size={14} />;
      case 'Produccion detenida': return <Factory size={14} />;
      case 'Material faltante': return <Package size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return s.prioridadAlta;
      case 'Media': return s.prioridadMedia;
      case 'Baja': return s.prioridadBaja;
      default: return '';
    }
  };

  const getAvanceColor = (avance: number) => {
    if (avance < 30) return s.avanceBajo;
    if (avance < 70) return s.avanceMedio;
    return s.avanceAlto;
  };

  const stats = {
    pendientes: mockAlertas.filter(a => a.estado === 'Pendiente').length,
    criticas: mockAlertas.filter(a => a.prioridad === 'Alta' && a.estado !== 'Resuelta').length,
    resueltas: mockAlertas.filter(a => a.estado === 'Resuelta').length,
    retrasadas: mockAlertas.filter(a => a.tipo === 'Retraso en entrega' && a.estado !== 'Resuelta').length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Alertas de Seguimiento de Producción</h1>
          <p className={s.pageSubtitle}>Tracking de producción externa</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <Bell size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{stats.pendientes}</div>
              <div className={s.statLabel}>Pendientes</div>
            </div>
          </div>
          <div className={`${s.statCard} ${s.statCardWarning}`}>
            <AlertTriangle size={20} className={s.statIconWarning} />
            <div>
              <div className={s.statValue}>{stats.criticas}</div>
              <div className={s.statLabel}>Críticas</div>
            </div>
          </div>
          <div className={s.statCard}>
            <div className={s.statIconDone}>✓</div>
            <div>
              <div className={s.statValue}>{stats.resueltas}</div>
              <div className={s.statLabel}>Resueltas</div>
            </div>
          </div>
          <div className={s.statCard}>
            <Clock size={20} className={s.statIconWarning} />
            <div>
              <div className={s.statValue}>{stats.retrasadas}</div>
              <div className={s.statLabel}>Con Retraso</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Pendiente', 'Vista', 'Resuelta'].map(estado => (
            <button
              key={estado}
              className={`${s.filterBtn} ${filtroEstado === estado ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroEstado(estado as typeof filtroEstado)}
            >
              {estado}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar alertas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<AlertaSeguimiento>
        data={filteredAlertas}
        pageSize={10}
        emptyMessage="No se encontraron alertas"
        onRowClick={setSelectedAlerta}
        actions={(a) => [
          ...(a.estado !== 'Resuelta' ? [{ label: 'Marcar resuelta', icon: <CheckCircle size={14} />, onClick: () => setSelectedAlerta(a) }] : []),
        ]}
        columns={[
          { key: 'id', header: 'ID', width: '80px', render: (a) => <span className={s.tdMono}>{a.id}</span> },
          { key: 'numeroOrden', header: 'Orden', width: '120px', render: (a) => <span className={s.tdMono}>{a.numeroOrden}</span> },
          { key: 'prenda', header: 'Prenda', render: (a) => a.prenda },
          { key: 'tallerNombre', header: 'Taller', width: '160px', render: (a) => (
            <div className={s.tallerCell}>
              <Factory size={14} />
              {a.tallerNombre}
            </div>
          )},
          { key: 'tipo', header: 'Tipo', width: '170px', render: (a) => (
            <div className={s.tipoCell}>
              {getTipoIcon(a.tipo)}
              <span>{a.tipo}</span>
            </div>
          )},
          { key: 'descripcion', header: 'Descripción', width: '180px', render: (a) => (
            <div className={s.descripcionCell} title={a.descripcion}>{a.descripcion}</div>
          )},
          { key: 'avance', header: 'Avance', width: '120px', render: (a) => (
            <div className={s.avanceCell}>
              <div className={s.avanceBar}>
                <div className={`${s.avanceFill} ${getAvanceColor(a.avance)}`} style={{ width: `${a.avance}%` }} />
              </div>
              <span className={s.avanceText}>{a.avance}%</span>
            </div>
          )},
          { key: 'fechaComprometida', header: 'Fecha límite', width: '120px', render: (a) => (
            <div className={s.fechaCell}>
              <Calendar size={14} />
              {a.fechaComprometida}
            </div>
          )},
          { key: 'prioridad', header: 'Prioridad', width: '100px', render: (a) => (
            <span className={`${s.prioridadBadge} ${getPrioridadColor(a.prioridad)}`}>{a.prioridad}</span>
          )},
          { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Vista', label: 'Vista' },
            { value: 'Resuelta', label: 'Resuelta' },
          ], render: (a) => (
            <Badge variant={getBadgeVariant(a.estado)}>{a.estado}</Badge>
          )},
        ]}
      />

      {selectedAlerta && (
        <div className={s.modalOverlay} onClick={() => setSelectedAlerta(null)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                Detalle de Alerta - {selectedAlerta.id}
              </h2>
              <button className={s.closeBtn} onClick={() => setSelectedAlerta(null)}>
                <X size={16} />
              </button>
            </div>
            <div className={s.modalBody}>
              <div className={s.detailGrid}>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Orden</span>
                  <span className={s.detailValue}>{selectedAlerta.numeroOrden}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Prenda</span>
                  <span className={s.detailValue}>{selectedAlerta.prenda}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Taller</span>
                  <span className={s.detailValue}>{selectedAlerta.tallerNombre}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Tipo</span>
                  <span className={s.detailValue}>{selectedAlerta.tipo}</span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Prioridad</span>
                  <span className={`${s.detailValue} ${getPrioridadColor(selectedAlerta.prioridad)}`}>
                    {selectedAlerta.prioridad}
                  </span>
                </div>
                <div className={s.detailItem}>
                  <span className={s.detailLabel}>Fecha límite</span>
                  <span className={s.detailValue}>{selectedAlerta.fechaComprometida}</span>
                </div>
                <div className={s.detailItemFull}>
                  <span className={s.detailLabel}>Descripción</span>
                  <span className={s.detailValue}>{selectedAlerta.descripcion}</span>
                </div>
                <div className={s.detailItemFull}>
                  <span className={s.detailLabel}>Avance</span>
                  <div className={s.detailAvance}>
                    <div className={s.avanceBarLarge}>
                      <div className={`${s.avanceFillLarge} ${getAvanceColor(selectedAlerta.avance)}`} style={{ width: `${selectedAlerta.avance}%` }} />
                    </div>
                    <span className={s.avanceTextLarge}>{selectedAlerta.avance}%</span>
                  </div>
                </div>
              </div>
              <div className={s.formActions}>
                <Button variant="secondary" onClick={() => setSelectedAlerta(null)}>
                  Cerrar
                </Button>
                {selectedAlerta.estado !== 'Resuelta' && (
                  <Button onClick={() => setSelectedAlerta(null)}>
                    Marcar como resuelta
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

