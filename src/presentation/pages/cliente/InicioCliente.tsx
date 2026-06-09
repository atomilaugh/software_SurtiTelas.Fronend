import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../admin/StatCard';
import { ShoppingBag, Clock, CheckCircle2, DollarSign, ArrowRight, Package, User, MapPin } from 'lucide-react';
import s from './InicioCliente.module.css';
import { Badge } from '@/shared/ui/Badge';

const stats = [
  { label: 'Pedidos Realizados', value: '24', trend: 'Total histórico', trendUp: true, Icon: ShoppingBag, color: 'accent' as const },
  { label: 'En Proceso', value: '2', trend: 'Activos ahora', trendUp: true, Icon: Clock, color: 'warning' as const },
  { label: 'Entregados', value: '21', trend: '87% completados', trendUp: true, Icon: CheckCircle2, color: 'success' as const },
  { label: 'Total Comprado', value: '$8.4M', trend: 'Acumulado', trendUp: true, Icon: DollarSign, color: 'info' as const },
];

const pedidoActivo = {
  id: '#PD-2401',
  fecha: '05 Jun 2026',
  items: 24,
  total: '$2.480.000',
  estado: 'En producción',
  tracking: [
    { label: 'Pedido recibido', desc: 'Tu pedido fue registrado', time: '05 Jun, 10:30', done: true, active: false },
    { label: 'En producción', desc: 'Estamos confeccionando', time: '06 Jun, 08:15', done: false, active: true },
    { label: 'Listo para envío', desc: 'Empacado y listo', time: '', done: false, active: false },
    { label: 'En camino', desc: 'Domiciliario en ruta', time: '', done: false, active: false },
    { label: 'Entregado', desc: 'Recibido en tu dirección', time: '', done: false, active: false },
  ],
};

const asesorAsignado = {
  nombre: 'Camila Torres',
  iniciales: 'CT',
  email: 'camila.torres@surtitelas.com',
  telefono: '310 234 5678',
  whatsapp: '310 234 5678',
};

const ultimosPedidos = [
  { id: '#PD-2402', fecha: '08 Jun 2026', estado: 'Listo', total: '$1.200.000' },
  { id: '#PD-2400', fecha: '02 Jun 2026', estado: 'Entregado', total: '$850.000' },
  { id: '#PD-2395', fecha: '28 May 2026', estado: 'Entregado', total: '$1.870.000' },
  { id: '#PD-2390', fecha: '20 May 2026', estado: 'Entregado', total: '$620.000' },
];

export const InicioCliente: React.FC = () => {
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
            <Badge variant="info">{pedidoActivo.estado}</Badge>
          </div>
          <div className={s.pedidoActivoBody}>
            <div className={s.pedidoActivoId}>
              {pedidoActivo.id} • {pedidoActivo.fecha} • {pedidoActivo.items} artículos • Total: {pedidoActivo.total}
            </div>

            <div className={s.trackingTimeline}>
              {pedidoActivo.tracking.map((step, idx) => (
                <div key={idx} className={s.trackingStep}>
                  <div className={s.trackingLeft}>
                    <div className={`${s.trackingDot} ${step.done ? s['trackingDot--done'] : step.active ? s['trackingDot--active'] : s['trackingDot--pending']}`}>
                      {step.done ? '✓' : step.active ? '●' : ''}
                    </div>
                    <div className={`${s.trackingLine} ${step.done ? s['trackingLine--done'] : s['trackingLine--pending']}`} />
                  </div>
                  <div className={s.trackingContent}>
                    <div className={`${s.trackingLabel} ${!step.done && !step.active ? s.trackingLabelPending : ''}`}>
                      {step.label}
                    </div>
                    <div className={s.trackingDesc}>{step.desc}</div>
                    {step.time && <div className={s.trackingTime}>— {step.time}</div>}
                  </div>
                </div>
              ))}
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
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.quickAccessGrid}>
          <Link to="/cliente/catalogo" className={s.quickAccessCard} style={{ textDecoration: 'none' }}>
            <div className={`${s.quickAccessIcon} ${s.quickAccessIconAccent}`}>
              <Package size={22} />
            </div>
            <div className={s.quickAccessLabel}>Ver Catálogo</div>
            <div className={s.quickAccessDesc}>Explora nuestras referencias disponibles</div>
            <ArrowRight size={16} className={s.quickAccessArrow} />
          </Link>

          <Link to="/cliente/pedidos" className={s.quickAccessCard} style={{ textDecoration: 'none' }}>
            <div className={`${s.quickAccessIcon} ${s.quickAccessIconSuccess}`}>
              <ShoppingBag size={22} />
            </div>
            <div className={s.quickAccessLabel}>Mis Pedidos</div>
            <div className={s.quickAccessDesc}>Seguimiento de tus compras</div>
            <ArrowRight size={16} className={s.quickAccessArrow} />
          </Link>

          <Link to="/cliente/perfil" className={s.quickAccessCard} style={{ textDecoration: 'none' }}>
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
            {ultimosPedidos.map((pedido) => (
              <div key={pedido.id} className={s.historialItem}>
                <div>
                  <div className={s.historialId}>{pedido.id}</div>
                  <div className={s.historialMeta}>{pedido.fecha} • {pedido.estado}</div>
                </div>
                <div className={s.historialTotal}>{pedido.total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};