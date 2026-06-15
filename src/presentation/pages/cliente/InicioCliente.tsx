import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { StatCard } from '../admin/StatCard';
import { ShoppingBag, Clock, CheckCircle2, DollarSign, ArrowRight, Package, User, MapPin, MessageCircle, Archive } from 'lucide-react';
import s from './InicioCliente.module.css';
import { Badge } from '@/shared/ui/Badge';
import { useAppStore, usePedidos } from '@/core/stores';
import { DetailModal } from '@/shared/ui/DetailModal';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import type { Pedido } from '@/core/types';

const asesorAsignado = {
  nombre: 'Camila Torres',
  iniciales: 'CT',
  email: 'camila.torres@surtitelas.com',
  telefono: '310 234 5678',
  whatsapp: '310 234 5678',
};

const statusVariant = (estado: Pedido['estado']) => {
  if (estado === 'Entregado') return 'success';
  if (estado === 'En producción' || estado === 'Despachado' || estado === 'En camino') return 'info';
  if (estado === 'Listo') return 'warning';
  if (estado === 'Cancelado') return 'danger';
  return 'default';
};

export const InicioCliente: React.FC = () => {
  const pedidos = usePedidos().pedidos;
  const [pedidoActivoState, setPedidoActivoState] = useState<Pedido | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const addNotificacion = useAppStore(s => s.addNotificacion);

  const pedidoActivo = pedidos.find(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado') || pedidos[0] || null;
  const totalPedidos = pedidos.length;
  const pedidosEnProceso = pedidos.filter(p => p.estado === 'En producción' || p.estado === 'Listo' || p.estado === 'Despachado' || p.estado === 'En camino').length;
  const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length;

  const stats = [
    { label: 'Pedidos Realizados', value: String(totalPedidos), trend: 'Total histórico', trendUp: true, Icon: ShoppingBag, color: 'accent' as const },
    { label: 'En Proceso', value: String(pedidosEnProceso), trend: 'Activos ahora', trendUp: true, Icon: Clock, color: 'warning' as const },
    { label: 'Entregados', value: String(pedidosEntregados), trend: 'Completados', trendUp: true, Icon: CheckCircle2, color: 'success' as const },
    { label: 'Total Comprado', value: '$8.4M', trend: 'Acumulado', trendUp: true, Icon: DollarSign, color: 'info' as const },
  ];

  const ultimosPedidos = pedidos.slice(0, 5);

  const enviarMensaje = () => {
    if (!chatMessage.trim()) {
      toast.error('Escribe un mensaje para tu asesor');
      return;
    }
    addNotificacion({
      tipo: 'info',
      titulo: 'Mensaje a asesor',
      mensaje: chatMessage,
    });
    toast.success('Mensaje enviado a tu asesor');
    setChatMessage('');
    setChatOpen(false);
  };

  const openPedido = (pedido: Pedido) => setPedidoActivoState(pedido);

  return (
    <div className={s.inicioLayout}>
      <h1 className={s.pageTitle}>Dashboard</h1>
      <p className={s.pageSubtitle}>Resumen de tu experiencia de compra</p>

      <div className={s.welcomeBanner}>
        <div className={s.welcomeText}>
          <div className={s.welcomeGreeting}>¡Bienvenido de vuelta!</div>
          <div className={s.welcomeName}>
            Juan Martínez <span>▸ Almacén El Sol</span>
          </div>
          <div className={s.welcomeDesc}>
            Consulta nuestro catálogo de productos, haz seguimiento a tus pedidos y gestiona tu perfil desde un solo lugar.
          </div>
          <div className={s.welcomeActions}>
            <Link to="/cliente/catalogo" className="inline-flex">
              <button className="btn btn--primary btn--sm">Ver catálogo</button>
            </Link>
            <Link to="/cliente/pedidos" className="inline-flex">
              <button className="btn btn--secondary btn--sm">Mis pedidos</button>
            </Link>
          </div>
        </div>
        <div className={s.welcomeIllustration}>
          <ShoppingBag size={64} />
        </div>
      </div>

      <div className={s.statsGrid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className={s.mainGrid}>
        <div className={s.pedidoActivoCard}>
          <div className={s.pedidoActivoHeader}>
            <div className={s.pedidoActivoTitle}>Pedido activo</div>
            <Badge variant={pedidoActivo ? statusVariant(pedidoActivo.estado) : 'default'}>{pedidoActivo?.estado || 'Sin pedido'}</Badge>
          </div>
          <div className={s.pedidoActivoBody}>
            <div className={s.pedidoActivoId}>
              {pedidoActivo ? `${pedidoActivo.id} • ${pedidoActivo.fecha} • ${pedidoActivo.items} artículos • Total: ${pedidoActivo.total}` : 'No tienes pedidos activos'}
            </div>

            <div className={s.trackingTimeline}>
              <div className={s.trackingStep}>
                <div className={s.trackingLeft}>
                  <div className={`${s.trackingDot} ${s['trackingDot--done']}`}>✓</div>
                  <div className={`${s.trackingLine} ${s['trackingLine--done']}`} />
                </div>
                <div className={s.trackingContent}>
                  <div className={s.trackingLabel}>Pedido recibido</div>
                  <div className={s.trackingDesc}>Tu pedido fue registrado</div>
                </div>
              </div>
              <div className={s.trackingStep}>
                <div className={s.trackingLeft}>
                  <div className={`${s.trackingDot} ${pedidoActivo?.estado === 'En producción' ? s['trackingDot--active'] : s['trackingDot--done']}`}>
                    {pedidoActivo?.estado === 'En producción' ? '●' : '✓'}
                  </div>
                  <div className={`${s.trackingLine} ${pedidoActivo && ['En producción', 'Listo', 'Despachado', 'En camino', 'Entregado'].includes(pedidoActivo.estado) ? s['trackingLine--done'] : s['trackingLine--pending']}`} />
                </div>
                <div className={s.trackingContent}>
                  <div className={s.trackingLabel}>En producción</div>
                  <div className={s.trackingDesc}>Estamos confeccionando</div>
                </div>
              </div>
              <div className={s.trackingStep}>
                <div className={s.trackingLeft}>
                  <div className={`${s.trackingDot} ${pedidoActivo?.estado === 'Listo' ? s['trackingDot--done'] : s['trackingDot--pending']}`}>
                    {pedidoActivo?.estado === 'Listo' ? '✓' : ''}
                  </div>
                  <div className={`${s.trackingLine} ${pedidoActivo && ['Listo', 'Despachado', 'En camino', 'Entregado'].includes(pedidoActivo.estado) ? s['trackingLine--done'] : s['trackingLine--pending']}`} />
                </div>
                <div className={s.trackingContent}>
                  <div className={s.trackingLabel}>Listo para envío</div>
                  <div className={s.trackingDesc}>Empacado y listo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.asesorCard}>
          <div className={s.asesorCardTitle}>Asesor asignado</div>
          <div className={s.asesorProfile}>
            <div className={s.asesorAvatarLg}>{asesorAsignado.iniciales}</div>
            <div>
              <div className={s.asesorName}>{asesorAsignado.nombre}</div>
              <div className={s.asesorContact}>Asesor de Ventas</div>
            </div>
          </div>
          <div className={s.asesorContactRow}>
            <MapPin size={14} className={s.asesorContactIcon} />
            {asesorAsignado.telefono}
          </div>
          <div className={s.asesorContactRow}>
            <User size={14} className={s.asesorContactIcon} />
            {asesorAsignado.email}
          </div>
          <button className={s.asesorChatBtn} type="button" onClick={() => setChatOpen(true)}>
            💬 Chatear con {asesorAsignado.nombre.split(' ')[0]}
          </button>
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.quickAccessGrid}>
          <Link to="/cliente/catalogo" className={s.quickAccessCard} style={{ textDecoration: 'none' }} onClick={() => toast.info('Navegando al catálogo')}>
            <div className={`${s.quickAccessIcon} ${s.quickAccessIconAccent}`}>
              <Package size={22} />
            </div>
            <div className={s.quickAccessLabel}>Ver Catálogo</div>
            <div className={s.quickAccessDesc}>Explora nuestras referencias disponibles</div>
            <ArrowRight size={16} className={s.quickAccessArrow} />
          </Link>

          <Link to="/cliente/pedidos" className={s.quickAccessCard} style={{ textDecoration: 'none' }} onClick={() => toast.info('Navegando a mis pedidos')}>
            <div className={`${s.quickAccessIcon} ${s.quickAccessIconSuccess}`}>
              <ShoppingBag size={22} />
            </div>
            <div className={s.quickAccessLabel}>Mis Pedidos</div>
            <div className={s.quickAccessDesc}>Seguimiento de tus compras</div>
            <ArrowRight size={16} className={s.quickAccessArrow} />
          </Link>

          <Link to="/cliente/perfil" className={s.quickAccessCard} style={{ textDecoration: 'none' }} onClick={() => toast.info('Navegando a mi perfil')}>
            <div className={`${s.quickAccessIcon} ${s.quickAccessIconInfo}`}>
              <User size={22} />
            </div>
            <div className={s.quickAccessLabel}>Mi Perfil</div>
            <div className={s.quickAccessDesc}>Datos personales y direcciones</div>
            <ArrowRight size={16} className={s.quickAccessArrow} />
          </Link>
        </div>

        <div className={s.historialCard}>
          <div className={s.historialHeader}>
            <div className={s.historialTitle}>Últimos pedidos</div>
          </div>
          <div className={s.historialList}>
            {ultimosPedidos.length === 0 ? (
              <div style={{ padding: '20px', color: 'var(--color-text-secondary)' }}>No hay pedidos</div>
            ) : (
              ultimosPedidos.map((pedido) => (
                <button type="button" key={pedido.id} className={s.historialItem} onClick={() => openPedido(pedido)}>
                  <div>
                    <div className={s.historialId}>{pedido.id}</div>
                    <div className={s.historialMeta}>{pedido.fecha} • {pedido.estado}</div>
                  </div>
                  <div className={s.historialTotal}>{pedido.total}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <DetailModal
        children={null}
        open={Boolean(pedidoActivoState)}
        onClose={() => setPedidoActivoState(null)}
        title={pedidoActivoState ? `Pedido ${pedidoActivoState.id}` : 'Pedido'}
        subtitle={pedidoActivoState?.fecha}
        size="lg"
        header={{
          icon: <Archive size={18} />,
          status: pedidoActivoState ? <Badge variant={statusVariant(pedidoActivoState.estado)}>{pedidoActivoState.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Seguimiento',
            fields: [
              { label: 'Cliente', value: pedidoActivoState?.cliente, icon: <User size={16} /> },
              { label: 'Total', value: pedidoActivoState?.total, icon: <DollarSign size={16} /> },
              { label: 'Artículos', value: pedidoActivoState?.items, icon: <Package size={16} /> },
              { label: 'Observaciones', value: pedidoActivoState?.observaciones || 'Sin observaciones', fullWidth: true, icon: <MessageCircle size={16} /> },
            ],
          },
          {
            title: 'Artículos',
            children: (
              <div className="grid gap-2">
                {(pedidoActivoState?.itemsList || []).map((item, index) => (
                  <div key={`${item.nombre}-${index}`} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-[var(--color-text-primary)]">{item.nombre}</div>
                      <div className="text-sm text-[var(--color-text-muted)]">x{item.cantidad}</div>
                    </div>
                  </div>
                ))}
                {(!(pedidoActivoState?.itemsList || []).length) && <div className="text-sm text-[var(--color-text-muted)]">Sin detalle de artículos registrado.</div>}
              </div>
            ),
          },
        ]}
      />

      <Modal open={chatOpen} onClose={() => setChatOpen(false)} title={`Chatear con ${asesorAsignado.nombre.split(' ')[0]}`} size="sm">
        <div className="grid gap-4">
          <textarea className="min-h-28 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" placeholder="Escribe tu consulta..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setChatOpen(false)}>Cancelar</Button>
            <Button onClick={enviarMensaje}><MessageCircle size={14} /> Enviar mensaje</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
