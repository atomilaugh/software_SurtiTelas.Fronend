import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Eye, MapPin, Clock, Package } from 'lucide-react';
import s from './Historial.module.css';
import { Badge } from '@/shared/ui/Badge';
import { DetailModal } from '@/shared/ui/DetailModal';

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
  const [desde, setDesde] = useState('2026-06-01');
  const [hasta, setHasta] = useState('2026-06-08');
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);

  const filteredHistorial = useMemo(() => {
    const desdeDate = new Date(`${desde}T00:00:00`).getTime();
    const hastaDate = new Date(`${hasta}T23:59:59`).getTime();

    const result: Record<string, Entrega[]> = {};
    Object.entries(historialEntregas).forEach(([date, entregas]) => {
      const fechaParts = date.split('-').map(part => part.trim());
      const monthMap: Record<string, string> = { Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06', Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12' };
      const day = fechaParts[1]?.padStart(2, '0');
      const month = monthMap[fechaParts[0] || ''];
      const year = fechaParts[2];
      if (!day || !month || !year) return;
      const dateValue = new Date(`${year}-${month}-${day}T12:00:00`).getTime();
      if (dateValue >= desdeDate && dateValue <= hastaDate) {
        result[date] = entregas;
      }
    });
    return result;
  }, [desde, hasta]);

  const totalFiltrado = Object.values(filteredHistorial).flat().length;

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
          <input type="date" className={s.dateInput} value={desde} onChange={e => setDesde(e.target.value)} />
        </div>
        <div className={s.dateRangeGroup}>
          <span className={s.dateRangeLabel}>Hasta:</span>
          <input type="date" className={s.dateInput} value={hasta} onChange={e => setHasta(e.target.value)} />
        </div>
      </div>

      {Object.keys(filteredHistorial).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
          No hay entregas en el rango seleccionado.
        </div>
      ) : (
        Object.entries(filteredHistorial).map(([date, entregas]) => (
          <div key={date} className={s.dayGroup}>
            <div className={s.dayGroupHeader}>
              <span className={s.dayGroupDate}>{date}</span>
              <div className={s.dayGroupLine} />
              <span className={s.dayGroupCount}>{entregas.length} entregas</span>
            </div>
            {entregas.map((entrega) => (
              <button type="button" key={entrega.id} className={s.historialRow} onClick={() => setSelectedEntrega(entrega)}>
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
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <Eye size={14} />
                </span>
              </button>
            ))}
          </div>
        ))
      )}

      <div style={{ marginTop: 16, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Mostrando {totalFiltrado} entregas filtradas.
      </div>

      <DetailModal
        children={null}
        open={Boolean(selectedEntrega)}
        onClose={() => setSelectedEntrega(null)}
        title={selectedEntrega ? `Historial ${selectedEntrega.id}` : 'Historial'}
        subtitle={selectedEntrega?.fecha}
        size="lg"
        header={{
          icon: <Eye size={18} />,
          status: selectedEntrega ? <Badge variant={selectedEntrega.estado === 'Entregado' ? 'success' : 'danger'}>{selectedEntrega.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Detalle de entrega',
            fields: [
              { label: 'Pedido', value: selectedEntrega?.pedido, icon: <Package size={16} /> },
              { label: 'Cliente', value: selectedEntrega?.cliente, icon: <Eye size={16} /> },
              { label: 'Dirección', value: selectedEntrega?.direccion, icon: <MapPin size={16} /> },
              { label: 'Fecha', value: selectedEntrega?.fecha, icon: <Clock size={16} /> },
              { label: 'Hora', value: selectedEntrega?.hora, icon: <Clock size={16} /> },
              { label: 'Observaciones', value: selectedEntrega?.observaciones || 'Sin observaciones', fullWidth: true, icon: <Eye size={16} /> },
            ],
          },
        ]}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="inline-flex h-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-transparent px-4 text-sm font-medium text-[var(--color-text-primary)]" onClick={() => {
              toast.info(`Historial ${selectedEntrega?.id} listo para consulta`);
              setSelectedEntrega(null);
            }}>
              Cerrar
            </button>
          </div>
        }
      />
    </div>
  );
};
