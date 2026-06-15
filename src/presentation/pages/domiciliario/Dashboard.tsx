import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { StatCard } from '../admin/StatCard';
import s from './Dashboard.module.css';
import { PackageCheck, CheckCircle2, Clock, XCircle, MapPin } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { DetailModal } from '@/shared/ui/DetailModal';

interface Entrega {
  id: string;
  cliente: string;
  direccion: string;
  barrio: string;
  horaEstimada: string;
  estado: 'Entregado' | 'En camino' | 'Pendiente' | 'Fallido';
}

const entregasSeed: Entrega[] = [
  { id: 'ENT-043', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
  { id: 'ENT-047', cliente: 'La Casa del Denim', direccion: 'Cl 127 #20-33', barrio: 'Cedritos', horaEstimada: '12:30', estado: 'Pendiente' },
];

const actividadSeed = [
  { tipo: 'success', texto: 'Entrega #ENT-041 confirmada — Juan Pérez', tiempo: 'hace 45 min' },
  { tipo: 'success', texto: 'Entrega #ENT-040 confirmada — Moda Express', tiempo: 'hace 1 h' },
  { tipo: 'info', texto: 'Ruta del día asignada — 9 entregas', tiempo: 'hace 3 h' },
  { tipo: 'warning', texto: 'Entrega #ENT-038 reprogramada para mañana', tiempo: 'ayer' },
  { tipo: 'error', texto: 'Entrega #ENT-035 fallida — cliente ausente', tiempo: 'hace 2 días' },
];

const statusVariant = (estado: Entrega['estado']) => {
  if (estado === 'Entregado') return 'success';
  if (estado === 'En camino') return 'info';
  if (estado === 'Fallido') return 'danger';
  return 'warning';
};

export const DomiciliarioDashboard: React.FC = () => {
  const [entregas, setEntregas] = useState<Entrega[]>(entregasSeed);
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);

  const completed = entregas.filter(e => e.estado === 'Entregado').length;
  const enCamino = entregas.filter(e => e.estado === 'En camino').length;
  const pendientes = entregas.filter(e => e.estado === 'Pendiente').length;
  const fallidas = entregas.filter(e => e.estado === 'Fallido').length;
  const nextEntrega = entregas.find(e => e.estado === 'Pendiente') || entregas.find(e => e.estado === 'En camino') || null;

  const stats = useMemo(() => [
    { label: 'Entregas Hoy', value: String(entregas.length), trend: 'Jornada actual', trendUp: true, Icon: PackageCheck, color: 'info' as const },
    { label: 'Completadas', value: String(completed), trend: `${Math.round((completed / entregas.length) * 100)}% del día`, trendUp: true, Icon: CheckCircle2, color: 'success' as const },
    { label: 'Pendientes', value: String(pendientes), trend: nextEntrega ? `Próxima ${nextEntrega.horaEstimada}` : 'Sin pendientes', trendUp: pendientes === 0, Icon: Clock, color: 'warning' as const },
    { label: 'Fallidas', value: String(fallidas), trend: fallidas === 0 ? 'Sin novedades' : 'Requiere atención', trendUp: fallidas === 0, Icon: XCircle, color: 'accent' as const },
  ], [entregas.length, completed, pendientes, fallidas, nextEntrega]);

  const actividad = useMemo(() => {
    const latest = nextEntrega ? [{ tipo: 'info' as const, texto: `Próxima entrega: ${nextEntrega.cliente}`, tiempo: 'ahora' }] : [];
    return [...latest, ...actividadSeed];
  }, [nextEntrega]);

  const marcarSiguiente = () => {
    if (!nextEntrega) {
      toast.info('No hay entregas pendientes para marcar');
      return;
    }
    const nuevoEstado: Entrega['estado'] = nextEntrega.estado === 'Pendiente' ? 'En camino' : 'Entregado';
    setEntregas(prev => prev.map(entrega => entrega.id === nextEntrega.id ? { ...entrega, estado: nuevoEstado } : entrega));
    toast.success(`${nextEntrega.id} marcada como ${nuevoEstado}`);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Dashboard</h1>
      <p className={s.pageSubtitle}>Métricas de tu jornada</p>

      <div className={s.statsGrid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className={s.mainGrid}>
        <div className={s.nextDeliveryCard}>
          <div className={s.nextDeliveryLabel}>Próxima entrega</div>
          <div className={s.nextDeliveryName}>{nextEntrega?.cliente || 'Sin entregas pendientes'}</div>
          <div className={s.nextDeliveryAddress}>{nextEntrega ? `${nextEntrega.direccion}, ${nextEntrega.barrio}` : 'Tu jornada está completa'}</div>
          <div className={s.nextDeliveryMeta}>
            <div className={s.nextDeliveryMetaItem}>
              <div className={s.nextDeliveryMetaLabel}>Entrega</div>
              <div className={s.nextDeliveryMetaValue}>{nextEntrega?.id || '—'}</div>
            </div>
            <div className={s.nextDeliveryMetaItem}>
              <div className={s.nextDeliveryMetaLabel}>Hora estimada</div>
              <div className={s.nextDeliveryMetaValue}>{nextEntrega?.horaEstimada || '—'}</div>
            </div>
          </div>
          <button style={{
            width: '100%',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: nextEntrega?.estado === 'En camino' ? 'var(--color-success)' : 'var(--color-info)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: nextEntrega ? 'pointer' : 'not-allowed',
          }} disabled={!nextEntrega} onClick={marcarSiguiente}>
            {nextEntrega?.estado === 'En camino' ? 'Marcar como Entregada' : 'Marcar como En camino'}
          </button>
        </div>

        <div className={s.dayProgressCard}>
          <div className={s.dayProgressTitle}>Progreso del día</div>
          <div className={s.progressRing}>
            <svg className={s.progressRing} viewBox="0 0 100 100">
              <circle className={s.progressRingCircle} cx="50" cy="50" r="42" />
            </svg>
            <div className={s.progressRingText}>
              <span className={s.progressRingPercent}>{Math.round((completed / entregas.length) * 100)}%</span>
              <span className={s.progressRingLabel}>Completado</span>
            </div>
          </div>
          <div className={s.dayBreakdown}>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-success)' }} />
                Completadas
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{completed}</span>
            </div>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-info)' }} />
                En camino
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{enCamino}</span>
            </div>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-warning)' }} />
                Pendientes
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{pendientes}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.deliveryList}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Entregas del día
          </div>
          {entregas.map((entrega, i) => (
            <button type="button" key={entrega.id} className={s.deliveryItem} onClick={() => setSelectedEntrega(entrega)}>
              <div className={`${s.deliveryNumber} ${entrega.estado === 'Entregado' ? s.deliveryNumberDone : entrega.estado === 'En camino' ? s.deliveryNumberActive : ''}`}>
                {i + 1}
              </div>
              <div className={s.deliveryInfo}>
                <div className={s.deliveryClientName}>{entrega.cliente}</div>
                <div className={s.deliveryAddress}>{entrega.direccion} - {entrega.barrio}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div className={s.deliveryTime}>{entrega.horaEstimada}</div>
                <Badge variant={statusVariant(entrega.estado)}>{entrega.estado}</Badge>
              </div>
            </button>
          ))}
        </div>

        <div className={s.deliveryList}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Actividad reciente
          </div>
          {actividad.map((a, i) => (
            <div key={i} className={s.activityItem}>
              <div className={`${s.activityDot} ${a.tipo === 'accent' ? s.activityDotAccent : a.tipo === 'success' ? s.activityDotSuccess : a.tipo === 'info' ? s.activityDotInfo : a.tipo === 'warning' ? s.activityDotWarning : s.activityDotError}`} />
              <span className={s.activityText}>{a.texto}</span>
              <span className={s.activityTime}>{a.tiempo}</span>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        children={null}
        open={Boolean(selectedEntrega)}
        onClose={() => setSelectedEntrega(null)}
        title={selectedEntrega ? `Entrega ${selectedEntrega.id}` : 'Entrega'}
        subtitle={selectedEntrega?.horaEstimada}
        header={{
          icon: <MapPin size={18} />,
          status: selectedEntrega ? <Badge variant={statusVariant(selectedEntrega.estado)}>{selectedEntrega.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Ubicación',
            fields: [
              { label: 'Cliente', value: selectedEntrega?.cliente, icon: <MapPin size={16} /> },
              { label: 'Dirección', value: selectedEntrega?.direccion, icon: <MapPin size={16} /> },
              { label: 'Barrio', value: selectedEntrega?.barrio, icon: <MapPin size={16} /> },
              { label: 'Hora estimada', value: selectedEntrega?.horaEstimada, icon: <Clock size={16} /> },
            ],
          },
        ]}
        footer={
          <div className="flex justify-end gap-3">
            <ButtonVariantSecondary onClick={() => setSelectedEntrega(null)}>Cerrar</ButtonVariantSecondary>
            {selectedEntrega && selectedEntrega.estado !== 'Entregado' && (
              <button type="button" className="inline-flex h-8 items-center justify-center rounded-xl bg-[var(--btn-primary-bg)] px-4 text-sm font-medium text-[var(--btn-primary-text)]" onClick={() => {
                setEntregas(prev => prev.map(entrega => entrega.id === selectedEntrega.id ? { ...entrega, estado: selectedEntrega.estado === 'Pendiente' ? 'En camino' : 'Entregado' } : entrega));
                toast.success(`${selectedEntrega.id} actualizada`);
                setSelectedEntrega(null);
              }}>
                Marcar avance
              </button>
            )}
          </div>
        }
      />
    </div>
  );
};

const ButtonVariantSecondary = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className="inline-flex h-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-transparent px-4 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-elevated)]" {...props}>
    {children}
  </button>
);
