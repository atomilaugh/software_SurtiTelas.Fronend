import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import s from './MisEntregas.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Entrega {
  id: string;
  pedido: string;
  cliente: string;
  direccion: string;
  ciudad: string;
  barrio: string;
  horaEstimada: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado' | 'Fallido';
}

const entregasHoy: Entrega[] = [
  { id: 'ENT-043', pedido: '#PD-2401', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', ciudad: 'Bogotá', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', pedido: '#PD-2402', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', ciudad: 'Bogotá', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', pedido: '#PD-2403', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', ciudad: 'Bogotá', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', pedido: '#PD-2404', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', ciudad: 'Bogotá', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
];

const deliveryStatuses: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  'Pendiente': 'warning',
  'En camino': 'info',
  'Entregado': 'success',
  'Fallido': 'danger',
};

export const DomiciliarioEntregas: React.FC = () => {
  return (
    <div>
      <h1 className={s.pageTitle}>Entregas de Hoy</h1>
      <p className={s.pageSubtitle}>Gestión de tus entregas del día</p>

      <div className={s.filterBar}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className={`${s.filterBtn} ${s.filterBtnActive}`}>
            <span>Todas</span>
            <span className={s.filterCount}>9</span>
          </button>
          <button className={s.filterBtn}>
            <span>Pendientes</span>
            <span className={s.filterCount}>5</span>
          </button>
          <button className={s.filterBtn}>
            <span>En camino</span>
            <span className={s.filterCount}>1</span>
          </button>
          <button className={s.filterBtn}>
            <span>Entregadas</span>
            <span className={s.filterCount}>3</span>
          </button>
        </div>
        <div className={s.viewToggle}>
          <button className={`${s.viewToggleBtn} ${s.viewToggleBtnActive}`}>
            ⊡
          </button>
          <button className={s.viewToggleBtn}>
            ☰
          </button>
        </div>
      </div>

      <div className={s.entregasGrid}>
        {entregasHoy.map((entrega) => (
          <div key={entrega.id} className={`${s.entregaCard} ${entrega.estado === 'Entregado' ? s.entregaCardEntregado : entrega.estado === 'En camino' ? s.entregaCardEncamino : entrega.estado === 'Fallido' ? s.entregaCardFallido : s.entregaCardPendiente}`}>
            <div className={s.entregaCardHeader}>
              <div className={s.entregaNumero}>
                <div className={s.entregaNumeroCircle}>{entrega.id.split('-')[1]}</div>
              </div>
              <Badge variant={deliveryStatuses[entrega.estado]}>
                {entrega.estado}
              </Badge>
            </div>
            <div className={s.entregaCardBody}>
              <div className={s.entregaCliente}>{entrega.cliente}</div>
              <div className={s.entregaDireccion}>{entrega.direccion} - {entrega.barrio}</div>
              <div className={s.entregaMetaRow}>
                <div className={s.entregaMeta}>
                  <div className={s.entregaMetaLabel}>Pedido</div>
                  <div className={s.entregaMetaValue}>{entrega.pedido}</div>
                </div>
                <div className={s.entregaMeta}>
                  <div className={s.entregaMetaLabel}>Hora</div>
                  <div className={s.entregaMetaValue}>{entrega.horaEstimada}</div>
                </div>
              </div>
            </div>
            <div className={s.entregaCardFooter}>
              <Button size="sm" style={{ flex: 1 }}>
                <Eye size={14} />
                Ver detalle
              </Button>
              {entrega.estado !== 'Entregado' && (
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                  <CheckCircle2 size={14} />
                  Cambiar estado
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};