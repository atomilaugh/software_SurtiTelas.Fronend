import React, { useState } from 'react';
import { Map } from 'lucide-react';
import s from './RutaDelDia.module.css';
import { Button } from '@/shared/ui/Button';

interface Entrega {
  id: string;
  cliente: string;
  direccion: string;
  barrio: string;
  horaEstimada: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado' | 'Fallido';
}

const entregasRuta: Entrega[] = [
  { id: 'ENT-043', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
  { id: 'ENT-047', cliente: 'La Casa del Denim', direccion: 'Cl 127 #20-33', barrio: 'Cedritos', horaEstimada: '12:30', estado: 'Pendiente' },
];

const completed = entregasRuta.filter(e => e.estado === 'Entregado').length;
const pending = entregasRuta.filter(e => e.estado !== 'Entregado').length;

export const RutaDelDia: React.FC = () => {
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(entregasRuta[2]);

  return (
    <div>
      <h1 className={s.pageTitle}>Ruta del Día</h1>
      <p className={s.pageSubtitle}>9 entregas programadas — 125 km totales</p>

      <div className={s.rutaLayout}>
        <div className={s.rutaPanel}>
          <div className={s.rutaPanelHeader}>
            <div className={s.rutaPanelTitle}>Secuencia de paradas</div>
            <div className={s.rutaResumen}>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipTotal}`}>9</span>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipDone}`}>{completed}</span>
              <span className={`${s.rutaResumenChip} ${s.rutaResumenChipPending}`}>{pending}</span>
            </div>
          </div>

          <div className={s.rutaTimeline}>
            {entregasRuta.map((entrega, i) => (
              <div key={entrega.id} className={`${s.rutaStop} ${selectedEntrega?.id === entrega.id ? s.rutaStopActive : ''} ${entrega.estado === 'Entregado' ? s.rutaStopDone : ''}`} onClick={() => setSelectedEntrega(entrega)}>
                <div className={s.rutaStopLeft}>
                  <div className={s.rutaStopNumber}>{i + 1}</div>
                  <div className={s.rutaStopLine} />
                </div>
                <div className={s.rutaStopBody}>
                  <div className={s.rutaStopCliente}>{entrega.cliente}</div>
                  <div className={s.rutaStopDireccion}>{entrega.direccion}, {entrega.barrio}</div>
                  <div className={s.rutaStopFooter}>
                    <span className={s.rutaStopHora}>{entrega.horaEstimada}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.mapPanel}>
          <div className={s.mapHeader}>
            <div className={s.mapTitle}>Mapa de ruta</div>
          </div>
          <div className={s.mapPlaceholder}>
            <div className={s.mapGrid} />
            <div className={s.mapIcon}>
              <Map size={48} />
            </div>
            <div className={s.mapText}>
              Vista de mapa integrada disponible en la app móvil
            </div>

            <div style={{ position: 'absolute', top: '60px', left: '80px' }} className={s.mapPin}>
              <div className={`${s.mapPinDot} ${s.mapPinDotDone}`}><span className={s.mapPinLabel}>1</span></div>
              <div className={s.mapPinShadow} />
            </div>
            <div style={{ position: 'absolute', top: '140px', left: '200px' }} className={s.mapPin}>
              <div className={`${s.mapPinDot} ${s.mapPinDotDone}`}><span className={s.mapPinLabel}>2</span></div>
              <div className={s.mapPinShadow} />
            </div>
            <div style={{ position: 'absolute', top: '220px', left: '150px' }} className={s.mapPin}>
              <div className={`${s.mapPinDot} ${s.mapPinDotActive}`}><span className={s.mapPinLabel}>3</span></div>
              <div className={s.mapPinShadow} />
            </div>

            {selectedEntrega && (
              <div className={s.mapDetailCard}>
                <div className={s.mapDetailInfo}>
                  <div className={s.mapDetailName}>{selectedEntrega.cliente}</div>
                  <div className={s.mapDetailAddress}>{selectedEntrega.direccion}, {selectedEntrega.barrio}</div>
                </div>
                <Button size="sm">Ir a entrega</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};