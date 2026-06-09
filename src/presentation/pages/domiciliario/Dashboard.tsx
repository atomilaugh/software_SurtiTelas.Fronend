import React from 'react';
import { StatCard } from '../admin/StatCard';
import s from './Dashboard.module.css';
import { PackageCheck, CheckCircle2, Clock, XCircle } from 'lucide-react';

const stats = [
  { label: 'Entregas Hoy', value: '9', trend: 'Jornada actual', trendUp: true, Icon: PackageCheck, color: 'info' as const },
  { label: 'Completadas', value: '3', trend: '33% del día', trendUp: true, Icon: CheckCircle2, color: 'success' as const },
  { label: 'Pendientes', value: '6', trend: 'Próxima en 15 min', trendUp: false, Icon: Clock, color: 'warning' as const },
  { label: 'Fallidas', value: '0', trend: 'Sin novedades', trendUp: true, Icon: XCircle, color: 'accent' as const },
];

const entregasHoy = [
  { id: 'ENT-043', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
  { id: 'ENT-047', cliente: 'La Casa del Denim', direccion: 'Cl 127 #20-33', barrio: 'Cedritos', horaEstimada: '12:30', estado: 'Pendiente' },
];

const actividad = [
  { tipo: 'success', texto: 'Entrega #ENT-041 confirmada — Juan Pérez', tiempo: 'hace 45 min' },
  { tipo: 'success', texto: 'Entrega #ENT-040 confirmada — Moda Express', tiempo: 'hace 1 h' },
  { tipo: 'info', texto: 'Ruta del día asignada — 9 entregas', tiempo: 'hace 3 h' },
  { tipo: 'warning', texto: 'Entrega #ENT-038 reprogramada para mañana', tiempo: 'ayer' },
  { tipo: 'error', texto: 'Entrega #ENT-035 fallida — cliente ausente', tiempo: 'hace 2 días' },
];

export const DomiciliarioDashboard: React.FC = () => {
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
          <div className={s.nextDeliveryName}>Moda Express SAS</div>
          <div className={s.nextDeliveryAddress}>Av 68 #34-10, Teusaquillo</div>
          <div className={s.nextDeliveryMeta}>
            <div className={s.nextDeliveryMetaItem}>
              <div className={s.nextDeliveryMetaLabel}>Pedido</div>
              <div className={s.nextDeliveryMetaValue}>#PD-2403</div>
            </div>
            <div className={s.nextDeliveryMetaItem}>
              <div className={s.nextDeliveryMetaLabel}>Hora estimada</div>
              <div className={s.nextDeliveryMetaValue}>11:00</div>
            </div>
          </div>
          <button style={{
            width: '100%',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--color-info)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            Marcar como En camino
          </button>
        </div>
        
        <div className={s.dayProgressCard}>
          <div className={s.dayProgressTitle}>Progreso del día</div>
          <div className={s.progressRing}>
            <svg className={s.progressRing} viewBox="0 0 100 100">
              <circle className={s.progressRingCircle} cx="50" cy="50" r="42" />
            </svg>
            <div className={s.progressRingText}>
              <span className={s.progressRingPercent}>33%</span>
              <span className={s.progressRingLabel}>Completado</span>
            </div>
          </div>
          <div className={s.dayBreakdown}>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-success)' }} />
                Completadas
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>3</span>
            </div>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-info)' }} />
                En camino
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>1</span>
            </div>
            <div className={s.dayBreakdownItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={s.dayBreakdownDot} style={{ background: 'var(--color-warning)' }} />
                Pendientes
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>5</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={s.bottomGrid}>
        <div className={s.deliveryList}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Entregas del día
          </div>
          {entregasHoy.map((entrega, i) => (
            <div key={entrega.id} className={s.deliveryItem}>
              <div className={`${s.deliveryNumber} ${entrega.estado === 'Entregado' ? s.deliveryNumberDone : entrega.estado === 'En camino' ? s.deliveryNumberActive : ''}`}>
                {i + 1}
              </div>
              <div className={s.deliveryInfo}>
                <div className={s.deliveryClientName}>{entrega.cliente}</div>
                <div className={s.deliveryAddress}>{entrega.direccion} - {entrega.barrio}</div>
              </div>
              <div className={s.deliveryTime}>{entrega.horaEstimada}</div>
            </div>
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
    </div>
  );
};