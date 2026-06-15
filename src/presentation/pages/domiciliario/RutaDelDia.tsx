import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Map, MapPin, Clock, CheckCircle2, Navigation } from 'lucide-react';
import s from './RutaDelDia.module.css';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { DetailModal } from '@/shared/ui/DetailModal';

interface Entrega {
  id: string;
  cliente: string;
  direccion: string;
  barrio: string;
  horaEstimada: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado' | 'Fallido';
}

const entregasSeed: Entrega[] = [
  { id: 'ENT-043', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
  { id: 'ENT-047', cliente: 'La Casa del Denim', direccion: 'Cl 127 #20-33', barrio: 'Cedritos', horaEstimada: '12:30', estado: 'Pendiente' },
];

const statusVariant = (estado: Entrega['estado']) => {
  if (estado === 'Entregado') return 'success';
  if (estado === 'En camino') return 'info';
  if (estado === 'Fallido') return 'danger';
  return 'warning';
};

export const RutaDelDia: React.FC = () => {
  const [entregas, setEntregas] = useState<Entrega[]>(entregasSeed);
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(entregasSeed[2]);
  const [statusEntrega, setStatusEntrega] = useState<Entrega | null>(null);
  const [nextEstado, setNextEstado] = useState<Entrega['estado']>('Pendiente');

  const completed = entregas.filter(e => e.estado === 'Entregado').length;
  const pending = entregas.length - completed;

  const pins = useMemo(() => entregas.slice(0, 5).map((entrega, index) => ({
    entrega,
    index,
    top: 60 + index * 80,
    left: [80, 200, 150, 260, 120][index],
  })), [entregas]);

  const openStatus = (entrega: Entrega) => {
    setStatusEntrega(entrega);
    setNextEstado(entrega.estado === 'Pendiente' ? 'En camino' : entrega.estado === 'En camino' ? 'Entregado' : 'Fallido');
  };

  const saveStatus = () => {
    if (!statusEntrega) return;
    setEntregas(prev => prev.map(entrega => entrega.id === statusEntrega.id ? { ...entrega, estado: nextEstado } : entrega));
    setSelectedEntrega(prev => prev?.id === statusEntrega.id ? { ...prev, estado: nextEstado } : prev);
    toast.success(`${statusEntrega.id} marcada como ${nextEstado}`);
    setStatusEntrega(null);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Ruta del Día</h1>
      <p className={s.pageSubtitle}>{entregas.length} entregas programadas — 125 km totales</p>

      <div className={s.rutaLayout}>
        <div className={s.rutaPanel}>
          <div className={s.rutaPanelHeader}>
            <div className={s.rutaPanelTitle}>Secuencia de paradas</div>
            <div className={s.rutaResumen}>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipTotal}`}>{entregas.length}</span>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipDone}`}>{completed}</span>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipPending}`}>{pending}</span>
            </div>
          </div>

          <div className={s.rutaTimeline}>
            {entregas.map((entrega, i) => (
              <button type="button" key={entrega.id} className={`${s.rutaStop} ${selectedEntrega?.id === entrega.id ? s.rutaStopActive : ''} ${entrega.estado === 'Entregado' ? s.rutaStopDone : ''}`} onClick={() => setSelectedEntrega(entrega)}>
                <div className={s.rutaStopLeft}>
                  <div className={s.rutaStopNumber}>{i + 1}</div>
                  <div className={s.rutaStopLine} />
                </div>
                <div className={s.rutaStopBody}>
                  <div className={s.rutaStopCliente}>{entrega.cliente}</div>
                  <div className={s.rutaStopDireccion}>{entrega.direccion}, {entrega.barrio}</div>
                  <div className={s.rutaStopFooter}>
                    <span className={s.rutaStopHora}>{entrega.horaEstimada}</span>
                    <Badge variant={statusVariant(entrega.estado)}>{entrega.estado}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={s.mapPanel}>
          <div className={s.mapHeader}>
            <div className={s.mapTitle}>Mapa de ruta</div>
            <Button size="sm" variant="secondary" onClick={() => toast.info('Ruta optimizada con las entregas pendientes')}>Optimizar ruta</Button>
          </div>
          <div className={s.mapPlaceholder}>
            <div className={s.mapGrid} />
            <div className={s.mapIcon}>
              <Map size={48} />
            </div>
            <div className={s.mapText}>
              Vista de mapa integrada disponible en la app móvil
            </div>

            {pins.map(({ entrega, index, top, left }) => (
              <button type="button" key={entrega.id} style={{ position: 'absolute', top, left }} className={s.mapPin} onClick={() => setSelectedEntrega(entrega)}>
                <div className={`${s.mapPinDot} ${entrega.estado === 'Entregado' ? s.mapPinDotDone : entrega.estado === 'En camino' ? s.mapPinDotActive : ''}`}><span className={s.mapPinLabel}>{index + 1}</span></div>
                <div className={s.mapPinShadow} />
              </button>
            ))}

            {selectedEntrega && (
              <div className={s.mapDetailCard}>
                <div className={s.mapDetailInfo}>
                  <div className={s.mapDetailName}>{selectedEntrega.cliente}</div>
                  <div className={s.mapDetailAddress}>{selectedEntrega.direccion}, {selectedEntrega.barrio}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast.info(`Navegando a ${selectedEntrega.direccion}, ${selectedEntrega.barrio}`)}>
                    <Navigation size={14} />
                    Ir a entrega
                  </Button>
                  {selectedEntrega.estado !== 'Entregado' && (
                    <Button size="sm" variant="secondary" onClick={() => openStatus(selectedEntrega)}>
                      <CheckCircle2 size={14} />
                      Avanzar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailModal
        children={null}
        open={Boolean(selectedEntrega)}
        onClose={() => setSelectedEntrega(null)}
        title={selectedEntrega ? `Ruta ${selectedEntrega.id}` : 'Ruta'}
        subtitle={selectedEntrega?.horaEstimada}
        header={{
          icon: <MapPin size={18} />,
          status: selectedEntrega ? <Badge variant={statusVariant(selectedEntrega.estado)}>{selectedEntrega.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Parada seleccionada',
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
            <Button variant="secondary" onClick={() => setSelectedEntrega(null)}>Cerrar</Button>
            {selectedEntrega && selectedEntrega.estado !== 'Entregado' && (
              <Button onClick={() => { setSelectedEntrega(null); openStatus(selectedEntrega); }}>Cambiar estado</Button>
            )}
          </div>
        }
      />

      <DetailModal
        children={null}
        open={Boolean(statusEntrega)}
        onClose={() => setStatusEntrega(null)}
        title="Actualizar parada de ruta"
        subtitle={statusEntrega ? `${statusEntrega.id} - ${statusEntrega.cliente}` : undefined}
        sections={[
          {
            title: 'Estado de entrega',
            children: (
              <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Estado
                <select className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={nextEstado} onChange={e => setNextEstado(e.target.value as Entrega['estado'])}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En camino">En camino</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Fallido">Fallido</option>
                </select>
              </label>
            ),
          },
        ]}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusEntrega(null)}>Cancelar</Button>
            <Button onClick={saveStatus}>Guardar avance</Button>
          </div>
        }
      />
    </div>
  );
};
