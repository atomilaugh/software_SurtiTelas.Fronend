import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Eye, CheckCircle2, MapPin, Clock, Package } from 'lucide-react';
import s from './MisEntregas.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DetailModal } from '@/shared/ui/DetailModal';
import { Tooltip } from '@/shared/components/Tooltip';

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

const entregasSeed: Entrega[] = [
  { id: 'ENT-043', pedido: '#PD-2401', cliente: 'Almacén El Sol', direccion: 'Cra 15 #45-23', ciudad: 'Bogotá', barrio: 'Chapinero', horaEstimada: '09:30', estado: 'Entregado' },
  { id: 'ENT-044', pedido: '#PD-2402', cliente: 'Boutique Moda+', direccion: 'Cl 80 #12-67', ciudad: 'Bogotá', barrio: 'Suba', horaEstimada: '10:15', estado: 'Entregado' },
  { id: 'ENT-045', pedido: '#PD-2403', cliente: 'Moda Express SAS', direccion: 'Av 68 #34-10', ciudad: 'Bogotá', barrio: 'Teusaquillo', horaEstimada: '11:00', estado: 'En camino' },
  { id: 'ENT-046', pedido: '#PD-2404', cliente: 'Textiles del Norte', direccion: 'Cra 7 #120-45', ciudad: 'Bogotá', barrio: 'Usaquén', horaEstimada: '11:45', estado: 'Pendiente' },
  { id: 'ENT-047', pedido: '#PD-2405', cliente: 'La Casa del Denim', direccion: 'Cl 127 #20-33', ciudad: 'Bogotá', barrio: 'Cedritos', horaEstimada: '12:30', estado: 'Pendiente' },
];

const deliveryStatuses: Record<Entrega['estado'], 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  'Pendiente': 'warning',
  'En camino': 'info',
  'Entregado': 'success',
  'Fallido': 'danger',
};

export const DomiciliarioEntregas: React.FC = () => {
  const [entregas, setEntregas] = useState<Entrega[]>(entregasSeed);
  const [activeFilter, setActiveFilter] = useState<Entrega['estado'] | 'Todas'>('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);
  const [statusEntrega, setStatusEntrega] = useState<Entrega | null>(null);
  const [nextEstado, setNextEstado] = useState<Entrega['estado']>('Pendiente');

  const filteredEntregas = useMemo(() => {
    if (activeFilter === 'Todas') return entregas;
    return entregas.filter(entrega => entrega.estado === activeFilter);
  }, [entregas, activeFilter]);

  const counts = {
    Todas: entregas.length,
    Pendiente: entregas.filter(e => e.estado === 'Pendiente').length,
    'En camino': entregas.filter(e => e.estado === 'En camino').length,
    Entregado: entregas.filter(e => e.estado === 'Entregado').length,
  };

  const openStatus = (entrega: Entrega) => {
    setStatusEntrega(entrega);
    setNextEstado(entrega.estado === 'Pendiente' ? 'En camino' : entrega.estado === 'En camino' ? 'Entregado' : 'Fallido');
  };

  const saveStatus = () => {
    if (!statusEntrega) return;
    setEntregas(prev => prev.map(entrega => entrega.id === statusEntrega.id ? { ...entrega, estado: nextEstado } : entrega));
    toast.success(`${statusEntrega.id} marcada como ${nextEstado}`);
    setStatusEntrega(null);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Entregas de Hoy</h1>
      <p className={s.pageSubtitle}>Gestión de tus entregas del día</p>

      <div className={s.filterBar}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['Todas', 'Pendiente', 'En camino', 'Entregado'] as const).map(filtro => (
            <button
              key={filtro}
              className={`${s.filterBtn} ${activeFilter === filtro ? s.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(filtro)}
            >
              <span>{filtro}</span>
              <span className={s.filterCount}>{counts[filtro]}</span>
            </button>
          ))}
        </div>
        <div className={s.viewToggle}>
          <Tooltip title="Vista grid"><button className={`${s.viewToggleBtn} ${viewMode === 'grid' ? s.viewToggleBtnActive : ''}`} onClick={() => setViewMode('grid')}>⊡</button></Tooltip>
          <Tooltip title="Vista lista"><button className={`${s.viewToggleBtn} ${viewMode === 'list' ? s.viewToggleBtnActive : ''}`} onClick={() => setViewMode('list')}>☰</button></Tooltip>
        </div>
      </div>

      <div className={`${s.entregasGrid} ${viewMode === 'list' ? s.entregasGridList : ''}`}>
        {filteredEntregas.map((entrega) => (
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
              <Button size="sm" style={{ flex: 1 }} onClick={() => setSelectedEntrega(entrega)}>
                <Eye size={14} />
                Ver detalle
              </Button>
              {entrega.estado !== 'Entregado' && (
                <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={() => openStatus(entrega)}>
                  <CheckCircle2 size={14} />
                  Cambiar estado
                </Button>
              )}
            </div>
          </div>
        ))}
        {filteredEntregas.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
            No hay entregas en este filtro.
          </div>
        )}
      </div>

      <DetailModal
        children={null}
        open={Boolean(selectedEntrega)}
        onClose={() => setSelectedEntrega(null)}
        title={selectedEntrega ? `Entrega ${selectedEntrega.id}` : 'Entrega'}
        subtitle={selectedEntrega?.horaEstimada}
        size="lg"
        header={{
          icon: <MapPin size={18} />,
          status: selectedEntrega ? <Badge variant={deliveryStatuses[selectedEntrega.estado]}>{selectedEntrega.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Información de entrega',
            fields: [
              { label: 'Cliente', value: selectedEntrega?.cliente, icon: <Package size={16} /> },
              { label: 'Pedido', value: selectedEntrega?.pedido, icon: <Package size={16} /> },
              { label: 'Dirección', value: selectedEntrega?.direccion, icon: <MapPin size={16} /> },
              { label: 'Barrio', value: selectedEntrega?.barrio, icon: <MapPin size={16} /> },
              { label: 'Ciudad', value: selectedEntrega?.ciudad, icon: <MapPin size={16} /> },
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
        title="Cambiar estado de entrega"
        subtitle={statusEntrega ? `${statusEntrega.id} - ${statusEntrega.cliente}` : undefined}
        sections={[
          {
            title: 'Nuevo estado',
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
            <Button onClick={saveStatus}>Aplicar estado</Button>
          </div>
        }
      />
    </div>
  );
};
