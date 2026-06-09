import React, { useState } from 'react';
import { ChevronDown, MapPin, Truck } from 'lucide-react';
import s from './MisPedidos.module.css';
import { Badge } from '@/shared/ui/Badge';

interface ItemPedido {
  ref: string;
  nombre: string;
  detalle: string;
  cantidad: number;
  precioUnit: number;
}

interface Pedido {
  id: string;
  fecha: string;
  items: ItemPedido[];
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  estado: string;
  estadoTracking: number;
  direccionEntrega: string;
  domiciliario: string | null;
}

const misPedidos: Pedido[] = [
  {
    id: '#PD-2401',
    fecha: '05 Jun 2026',
    items: [
      { ref: 'CAM-001', nombre: 'Camiseta Básica Unisex', detalle: 'Talla M / Color Negro', cantidad: 12, precioUnit: 28000 },
      { ref: 'BLU-001', nombre: 'Blusa Campesina Bordada', detalle: 'Talla S / Color Beige', cantidad: 8, precioUnit: 48000 },
      { ref: 'PAN-001', nombre: 'Pantalón Cargo Hombre', detalle: 'Talla 32 / Color Azul', cantidad: 4, precioUnit: 82000 },
    ],
    subtotal: 1112000,
    descuento: 80000,
    iva: 0,
    total: 1032000,
    estado: 'En producción',
    estadoTracking: 1,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: null,
  },
  {
    id: '#PD-2395',
    fecha: '28 May 2026',
    items: [
      { ref: 'VES-001', nombre: 'Vestido Casual Verano', detalle: 'Talla M / Color Coral', cantidad: 6, precioUnit: 68000 },
      { ref: 'CAM-002', nombre: 'Camiseta Polo Piqué', detalle: 'Talla L / Color Blanco', cantidad: 10, precioUnit: 42000 },
    ],
    subtotal: 828000,
    descuento: 0,
    iva: 0,
    total: 828000,
    estado: 'Listo',
    estadoTracking: 2,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'Carlos Ruiz',
  },
  {
    id: '#PD-2390',
    fecha: '20 May 2026',
    items: [
      { ref: 'SUD-001', nombre: 'Sudadera Premium con Capucha', detalle: 'Talla L / Color Gris', cantidad: 4, precioUnit: 96000 },
    ],
    subtotal: 384000,
    descuento: 38400,
    iva: 0,
    total: 345600,
    estado: 'En camino',
    estadoTracking: 3,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'Carlos Ruiz',
  },
  {
    id: '#PD-2385',
    fecha: '15 May 2026',
    items: [
      { ref: 'CAM-001', nombre: 'Camiseta Básica Unisex', detalle: 'Talla S / Color Blanco', cantidad: 20, precioUnit: 28000 },
    ],
    subtotal: 560000,
    descuento: 56000,
    iva: 0,
    total: 504000,
    estado: 'Entregado',
    estadoTracking: 4,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'Carlos Ruiz',
  },
  {
    id: '#PD-2380',
    fecha: '10 May 2026',
    items: [
      { ref: 'BLU-001', nombre: 'Blusa Campesina Bordada', detalle: 'Talla XS / Color Terracota', cantidad: 6, precioUnit: 48000 },
    ],
    subtotal: 288000,
    descuento: 0,
    iva: 0,
    total: 288000,
    estado: 'Entregado',
    estadoTracking: 4,
    direccionEntrega: 'Cl 80 #20-15, Suba, Bogotá',
    domiciliario: 'María López',
  },
  {
    id: '#PD-2375',
    fecha: '05 May 2026',
    items: [
      { ref: 'PAN-001', nombre: 'Pantalón Cargo Hombre', detalle: 'Talla 30 / Color Negro', cantidad: 8, precioUnit: 82000 },
      { ref: 'CAM-002', nombre: 'Camiseta Polo Piqué', detalle: 'Talla M / Color Rojo', cantidad: 10, precioUnit: 42000 },
    ],
    subtotal: 1028000,
    descuento: 0,
    iva: 0,
    total: 1028000,
    estado: 'Entregado',
    estadoTracking: 4,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'Carlos Ruiz',
  },
  {
    id: '#PD-2370',
    fecha: '01 May 2026',
    items: [
      { ref: 'VES-001', nombre: 'Vestido Casual Verano', detalle: 'Talla S / Color Azul cielo', cantidad: 5, precioUnit: 68000 },
    ],
    subtotal: 340000,
    descuento: 0,
    iva: 0,
    total: 340000,
    estado: 'Entregado',
    estadoTracking: 4,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'María López',
  },
  {
    id: '#PD-2365',
    fecha: '28 Abr 2026',
    items: [
      { ref: 'CAM-001', nombre: 'Camiseta Básica Unisex', detalle: 'Talla L / Color Gris', cantidad: 15, precioUnit: 28000 },
    ],
    subtotal: 420000,
    descuento: 42000,
    iva: 0,
    total: 378000,
    estado: 'Entregado',
    estadoTracking: 4,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: 'Carlos Ruiz',
  },
  {
    id: '#PD-2360',
    fecha: '20 Abr 2026',
    items: [
      { ref: 'SUD-001', nombre: 'Sudadera Premium con Capucha', detalle: 'Talla XL / Color Navy', cantidad: 3, precioUnit: 96000 },
    ],
    subtotal: 288000,
    descuento: 0,
    iva: 0,
    total: 288000,
    estado: 'Cancelado',
    estadoTracking: 0,
    direccionEntrega: 'Cra 15 #45-23, Chapinero, Bogotá',
    domiciliario: null,
  },
];

const filtrosEstado = [
  { label: 'Todos', key: 'todos', count: 24 },
  { label: 'Nuevo', key: 'nuevo', count: 0 },
  { label: 'En producción', key: 'produccion', count: 1 },
  { label: 'Listo', key: 'listo', count: 1 },
  { label: 'Despachado', key: 'despachado', count: 0 },
  { label: 'En camino', key: 'camino', count: 0 },
  { label: 'Entregado', key: 'entregado', count: 21 },
  { label: 'Cancelado', key: 'cancelado', count: 1 },
];

export const MisPedidos: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [expandedPedido, setExpandedPedido] = useState<string | null>(null);

  const filteredPedidos = misPedidos.filter(p =>
    activeFilter === 'todos' || p.estado.toLowerCase().replace(' ', '') === activeFilter
  );

  const trackingSteps = ['Pedido recibido', 'En producción', 'Listo para envío', 'En camino', 'Entregado'];

  return (
    <div className={s.pedidosLayout}>
      <h1 className={s.pageTitle}>Mis Pedidos</h1>
      <p className={s.pageSubtitle}>Historial y seguimiento de tus compras</p>

      <div className={s.infoBanner}>
        <MapPin size={18} className={s.infoBannerIcon} />
        <span className={s.infoBannerText}>
          Para realizar un nuevo pedido o hacer cambios en uno existente, comunícate con tu asesor asignado Camila Torres al <strong>310 234 5678</strong>.
        </span>
      </div>

      <div className={s.estadoTabs}>
        {filtrosEstado.map(filtro => (
          <button
            key={filtro.key}
            className={`${s.estadoTab} ${activeFilter === filtro.key ? s.estadoTabActive : ''}`}
            onClick={() => setActiveFilter(filtro.key)}
          >
            {filtro.label}
            <span className={s.estadoBubble}>{filtro.count}</span>
          </button>
        ))}
      </div>

      <div>
        {filteredPedidos.map((pedido) => (
          <div key={pedido.id} className={`${s.pedidoCard} ${expandedPedido === pedido.id ? s.pedidoCardExpanded : ''}`}>
            <div
              className={s.pedidoCardHeader}
              onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
            >
              <div className={s.pedidoId}>{pedido.id}</div>

              <div className={s.pedidoMeta}>
                <div className={s.pedidoMetaItem}>
                  <span className={s.pedidoMetaLabel}>Fecha</span>
                  <span className={s.pedidoMetaValue}>{pedido.fecha}</span>
                </div>
                <div className={s.pedidoMetaItem}>
                  <span className={s.pedidoMetaLabel}>Items</span>
                  <span className={s.pedidoMetaValue}>{pedido.items.length}</span>
                </div>
                <div className={s.pedidoMetaItem}>
                  <span className={s.pedidoMetaLabel}>Total</span>
                  <span className={`${s.pedidoMetaValue} ${s.pedidoMetaValueStrong}`}>{pedido.total.toLocaleString()}</span>
                </div>
              </div>

              <Badge variant={
                pedido.estado === 'Entregado' ? 'success' :
                pedido.estado === 'En producción' ? 'info' :
                pedido.estado === 'Listo' ? 'warning' :
                pedido.estado === 'Cancelado' ? 'danger' : 'default'
              }>
                {pedido.estado}
              </Badge>

              <ChevronDown
                size={18}
                className={`${s.pedidoChevron} ${expandedPedido === pedido.id ? s.pedidoChevronOpen : ''}`}
              />
            </div>

            {expandedPedido === pedido.id && (
              <div className={s.pedidoExpanded}>
                <div className={s.pedidoExpandedInner}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                      Detalle de artículos
                    </h3>
                    <table className={s.itemsTable}>
                      <thead>
                        <tr>
                          <th>Referencia</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className={s.itemRef}>{item.ref}</td>
                            <td>
                              <div className={s.itemNombre}>{item.nombre}</div>
                              <div className={s.itemDetalle}>{item.detalle}</div>
                            </td>
                            <td>{item.cantidad}</td>
                            <td>${item.precioUnit.toLocaleString()}</td>
                            <td>${(item.cantidad * item.precioUnit).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {pedido.estadoTracking < 4 && (
                      <div className={s.pedidoTracking}>
                        <div className={s.pedidoTrackingTitle}>Seguimiento del pedido</div>
                        <div className={s.trackingStepsRow}>
                          {trackingSteps.map((step, idx) => (
                            <React.Fragment key={step}>
                              <div className={s.trackingStepInline}>
                                <div className={`${s.trackingStepDot} ${idx < pedido.estadoTracking ? s['trackingStepDot--done'] : idx === pedido.estadoTracking ? s['trackingStepDot--active'] : s['trackingStepDot--pending']}`}>
                                  {idx < pedido.estadoTracking ? '✓' : idx === pedido.estadoTracking ? '●' : ''}
                                </div>
                                <span className={`${s.trackingStepInlineLabel} ${idx === pedido.estadoTracking ? s['trackingStepInlineLabel--active'] : ''} ${idx < pedido.estadoTracking ? s['trackingStepInlineLabel--done'] : ''}`}>
                                  {step}
                                </span>
                              </div>
                              {idx < trackingSteps.length - 1 && (
                                <div className={`${s.trackingConnector} ${idx < pedido.estadoTracking ? s['trackingConnector--done'] : s['trackingConnector--pending']}`} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className={s.pedidoResumen}>
                      <div className={s.resumenRow}>
                        <span>Subtotal</span>
                        <span className={s.resumenValor}>${pedido.subtotal.toLocaleString()}</span>
                      </div>
                      {pedido.descuento > 0 && (
                        <div className={s.resumenRow}>
                          <span>Descuento</span>
                          <span className={s.resumenValor}>-${pedido.descuento.toLocaleString()}</span>
                        </div>
                      )}
                      <div className={s.resumenRow}>
                        <span>IVA</span>
                        <span className={s.resumenValor}>${pedido.iva.toLocaleString()}</span>
                      </div>
                      <div className={s.resumenRow}>
                        <span>Total</span>
                        <span className={s.resumenValor}>${pedido.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={s.entregaInfo}>
                      <Truck size={18} className={s.entregaInfoIcon} />
                      <span>{pedido.direccionEntrega}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};