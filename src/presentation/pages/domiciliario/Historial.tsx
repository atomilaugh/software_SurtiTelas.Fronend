import React from 'react';
import { Eye } from 'lucide-react';
import s from './Historial.module.css';
import { Badge } from '@/shared/ui/Badge';

interface Entrega {
  id: string;
  pedido: string;
  cliente: string;
  direccion: string;
  fecha: string;
  hora: string;
  estado: 'Entregado' | 'Fallido';
  observaciones: string;
}

const historialEntregas: Record<string, Entrega[]> = {
  'Hoy - 08 Jun 2026': [
    { id: 'ENT-043', pedido: '#PD-2401', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', fecha: '08 Jun 2026', hora: '09:48', estado: 'Entregado', observaciones: '' },
    { id: 'ENT-044', pedido: '#PD-2402', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', fecha: '08 Jun 2026', hora: '10:31', estado: 'Entregado', observaciones: '' },
  ],
  'Ayer - 07 Jun 2026': [
    { id: 'ENT-039', pedido: '#PD-2397', cliente: 'Moda Casual SAS', direccion: 'Av 68 #34-10', fecha: '07 Jun 2026', hora: '09:15', estado: 'Entregado', observaciones: '' },
    { id: 'ENT-040', pedido: '#PD-2398', cliente: 'Textiles Andina', direccion: 'Cra 7 #120-45', fecha: '07 Jun 2026', hora: '10:52', estado: 'Entregado', observaciones: '' },
    { id: 'ENT-041', pedido: '#PD-2399', cliente: 'La Tienda Norte', direccion: 'Cl 127 #20-33', fecha: '07 Jun 2026', hora: '12:08', estado: 'Fallido', observaciones: 'Cliente no atendió' },
  ],
};

const rendimiento = [
  { value: '187', label: 'Total Entregas', sub: 'Desde inicio', color: 'default' },
  { value: '94%', label: 'Tasa de Éxito', sub: '176 exitosas', color: 'success' },
  { value: '11', label: 'Fallidas Total', sub: '6% del total', color: 'error' },
  { value: '4.8', label: 'Calificación', sub: 'Promedio clientes', color: 'default' },
];

export const DomiciliarioHistorial: React.FC = () => {
  return (
    <div>
      <h1 className={s.pageTitle}>Historial</h1>
      <p className={s.pageSubtitle}>Registro de todas tus entregas</p>

      <div className={s.rendimientoGrid}>
        {rendimiento.map((r, i) => (
          <div key={i} className={s.rendimientoCard}>
            <div className={`${s.rendimientoValue} ${r.color === 'success' ? s.rendimientoValueSuccess : r.color === 'error' ? s.rendimientoValueError : ''}`}>
              {r.value}
            </div>
            <div className={s.rendimientoLabel}>{r.label}</div>
            <div className={s.rendimientoSub}>{r.sub}</div>
          </div>
        ))}
      </div>

      <div className={s.historialFilters}>
        <div className={s.dateRangeGroup}>
          <span className={s.dateRangeLabel}>Desde:</span>
          <input type="date" className={s.dateInput} defaultValue="2026-06-01" />
        </div>
        <div className={s.dateRangeGroup}>
          <span className={s.dateRangeLabel}>Hasta:</span>
          <input type="date" className={s.dateInput} defaultValue="2026-06-08" />
        </div>
      </div>

      {Object.entries(historialEntregas).map(([date, entregas]) => (
        <div key={date} className={s.dayGroup}>
          <div className={s.dayGroupHeader}>
            <span className={s.dayGroupDate}>{date}</span>
            <div className={s.dayGroupLine} />
            <span className={s.dayGroupCount}>{entregas.length} entregas</span>
          </div>
          {entregas.map((entrega) => (
            <div key={entrega.id} className={s.historialRow}>
              <span className={s.historialRowId}>{entrega.id}</span>
              <span style={{ flex: 0.8 }}>{entrega.pedido}</span>
              <div className={s.historialRowCliente}>
                <div className={s.historialRowClienteName}>{entrega.cliente}</div>
                <div className={s.historialRowAddress}>{entrega.direccion}</div>
              </div>
              <span className={s.historialRowHora}>{entrega.hora}</span>
              <Badge variant={entrega.estado === 'Entregado' ? 'success' : 'danger'}>
                {entrega.estado}
              </Badge>
              <span className={s.historialRowObs}>{entrega.observaciones || '-'}</span>
              <button style={{
                padding: '6px 10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}>
                <Eye size={14} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};