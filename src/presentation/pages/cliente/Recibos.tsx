import React, { useMemo, useState } from 'react';
import { Download, FileText, Calendar, CreditCard, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { usePedidos } from '@/core/stores';
import s from './Recibos.module.css';

type ReciboStatus = 'Aprobado' | 'Pendiente' | 'Rechazado';

interface Recibo {
  id: string;
  fecha: string;
  ordenId: string;
  metodoPago: string;
  monto: number;
  estado: ReciboStatus;
  cliente: string;
  detalle: {
    subtotal: number;
    envio: number;
    impuestos: number;
    total: number;
  };
}

const reciboDemo: Recibo[] = [
  {
    id: '#REC-10023',
    fecha: '2026-06-12T09:30:00',
    ordenId: 'ORD-2024-001',
    metodoPago: 'Transferencia Bancaria',
    monto: 85000,
    estado: 'Aprobado',
    cliente: 'Juan Martínez',
    detalle: { subtotal: 71429, envio: 0, impuestos: 13571, total: 85000 },
  },
  {
    id: '#REC-10024',
    fecha: '2026-06-08T16:15:00',
    ordenId: 'ORD-2024-002',
    metodoPago: 'Tarjeta de Crédito',
    monto: 142000,
    estado: 'Pendiente',
    cliente: 'Juan Martínez',
    detalle: { subtotal: 119328, envio: 15000, impuestos: 7672, total: 142000 },
  },
  {
    id: '#REC-10025',
    fecha: '2026-05-29T11:05:00',
    ordenId: 'ORD-2024-003',
    metodoPago: 'Efectivo',
    monto: 64000,
    estado: 'Rechazado',
    cliente: 'Juan Martínez',
    detalle: { subtotal: 53782, envio: 15000, impuestos: 5218, total: 64000 },
  },
];

const statusVariant = (estado: ReciboStatus) => {
  if (estado === 'Aprobado') return 'success';
  if (estado === 'Pendiente') return 'warning';
  return 'danger';
};

const statusIcon = (estado: ReciboStatus) => {
  if (estado === 'Aprobado') return <CheckCircle2 size={12} />;
  if (estado === 'Pendiente') return <Clock size={12} />;
  return <XCircle size={12} />;
};

const formatCurrency = (value: number) => `$${value.toLocaleString('es-CO')}`;

const formatDate = (value: string) => new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value));

const buildRecibos = (pedidos: { id: string; fecha: string; total: string; estado: string }[]): Recibo[] => {
  const paidOrders = pedidos
    .filter(pedido => ['Despachado', 'En camino', 'Entregado'].includes(pedido.estado))
    .slice(0, 3)
    .map((pedido, index) => {
      const numericTotal = Number.parseInt(pedido.total.replace(/[^0-9]/g, ''), 10) || 0;
      const subtotal = Math.round(numericTotal / 1.19);
      const impuestos = numericTotal - subtotal;

      return {
        id: `#REC-${String(10026 + index).padStart(5, '0')}`,
        fecha: new Date(pedido.fecha).toISOString(),
        ordenId: pedido.id,
        metodoPago: index === 0 ? 'Transferencia Bancaria' : index === 1 ? 'Tarjeta de Crédito' : 'Efectivo',
        monto: numericTotal,
        estado: 'Aprobado' as ReciboStatus,
        cliente: 'Juan Martínez',
        detalle: { subtotal, envio: 0, impuestos, total: numericTotal },
      };
    });

  return [...paidOrders, ...reciboDemo];
};

export const Recibos: React.FC = () => {
  const { pedidos } = usePedidos();
  const [selectedRecibo, setSelectedRecibo] = useState<Recibo | null>(null);

  const recibos = useMemo(() => buildRecibos(pedidos), [pedidos]);
  const totalAprobado = useMemo(() => recibos
    .filter(recibo => recibo.estado === 'Aprobado')
    .reduce((sum, recibo) => sum + recibo.monto, 0), [recibos]);

  const openRecibo = (recibo: Recibo) => setSelectedRecibo(recibo);
  const closeRecibo = () => setSelectedRecibo(null);

  const handleDownload = () => {
    toast.success('Abre la ventana de impresión y selecciona "Guardar como PDF" para descargar tu recibo');
    window.print();
  };

  return (
    <div className={s.recibosPage}>
      <header className={s.pageHeader}>
        <div>
          <p className={s.eyebrow}>Historial de pagos</p>
          <h1 className={s.pageTitle}>Mis Recibos</h1>
          <p className={s.pageSubtitle}>Consulta y descarga el comprobante de tus transacciones monetarias.</p>
        </div>
        <div className={s.headerMetric}>
          <span>Total aprobado</span>
          <strong>{formatCurrency(totalAprobado)}</strong>
        </div>
      </header>

      <section className={s.summaryGrid}>
        <div className={s.summaryCard}>
          <div className={s.summaryIcon}><FileText size={18} /></div>
          <div>
            <span className={s.summaryLabel}>Recibos registrados</span>
            <strong>{recibos.length}</strong>
          </div>
        </div>
        <div className={s.summaryCard}>
          <div className={s.summaryIcon}><CreditCard size={18} /></div>
          <div>
            <span className={s.summaryLabel}>Métodos usados</span>
            <strong>{new Set(recibos.map(recibo => recibo.metodoPago)).size}</strong>
          </div>
        </div>
        <div className={s.summaryCard}>
          <div className={s.summaryIcon}><DollarSign size={18} /></div>
          <div>
            <span className={s.summaryLabel}>Monto total</span>
            <strong>{formatCurrency(recibos.reduce((sum, recibo) => sum + recibo.monto, 0))}</strong>
          </div>
        </div>
      </section>

      <section className={s.tableCard}>
        <div className={s.tableHeader}>
          <div>
            <h2>Recibos de pago</h2>
            <p>Historial completo de transacciones monetarias del cliente.</p>
          </div>
          <Badge variant="outline">{recibos.length} recibos</Badge>
        </div>

        <div className={s.tableWrapper}>
          <table className={s.recibosTable}>
            <thead>
              <tr>
                <th>ID de Pago / Recibo</th>
                <th>Fecha</th>
                <th>Orden Asociada</th>
                <th>Método de Pago</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th className={s.actionColumn}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {recibos.map(recibo => (
                <tr key={recibo.id}>
                  <td>
                    <strong>{recibo.id}</strong>
                  </td>
                  <td className={s.mutedCell}>
                    <Calendar size={14} />
                    <span>{formatDate(recibo.fecha)}</span>
                  </td>
                  <td>{recibo.ordenId}</td>
                  <td>{recibo.metodoPago}</td>
                  <td className={s.amountCell}>{formatCurrency(recibo.monto)}</td>
                  <td>
                    <Badge variant={statusVariant(recibo.estado)} dot>
                      {statusIcon(recibo.estado)}
                      {recibo.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      className={s.downloadButton}
                      onClick={() => openRecibo(recibo)}
                      leftIcon={<Download size={14} />}
                    >
                      Descargar Recibo
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={!!selectedRecibo}
        onClose={closeRecibo}
        title="Detalle del Recibo"
        description={`Comprobante ${selectedRecibo?.id} asociado a ${selectedRecibo?.ordenId}`}
        size="md"
        footer={(
          <div className={s.modalActions}>
            <Button variant="ghost" onClick={closeRecibo}>Cerrar</Button>
            <Button variant="primary" onClick={handleDownload} leftIcon={<Download size={16} />}>
              Descargar Recibo
            </Button>
          </div>
        )}
      >
        {selectedRecibo && (
          <div className={s.receiptDetail}>
            <div className={s.receiptTop}>
              <div className={s.receiptTitle}>
                <FileText size={20} />
                <div>
                  <strong>{selectedRecibo.id}</strong>
                  <span>{selectedRecibo.ordenId}</span>
                </div>
              </div>
              <Badge variant={statusVariant(selectedRecibo.estado)} dot>
                {statusIcon(selectedRecibo.estado)}
                {selectedRecibo.estado}
              </Badge>
            </div>

            <div className={s.receiptInfoGrid}>
              <div>
                <span>Cliente</span>
                <strong>{selectedRecibo.cliente}</strong>
              </div>
              <div>
                <span>Fecha de pago</span>
                <strong>{formatDate(selectedRecibo.fecha)}</strong>
              </div>
              <div>
                <span>Método de pago</span>
                <strong>{selectedRecibo.metodoPago}</strong>
              </div>
              <div>
                <span>Orden asociada</span>
                <strong>{selectedRecibo.ordenId}</strong>
              </div>
            </div>

            <div className={s.breakdown}>
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(selectedRecibo.detalle.subtotal)}</strong>
              </div>
              <div>
                <span>Envío</span>
                <strong>{formatCurrency(selectedRecibo.detalle.envio)}</strong>
              </div>
              <div>
                <span>Impuestos</span>
                <strong>{formatCurrency(selectedRecibo.detalle.impuestos)}</strong>
              </div>
              <div className={s.breakdownTotal}>
                <span>Total pagado</span>
                <strong>{formatCurrency(selectedRecibo.detalle.total)}</strong>
              </div>
            </div>

            <p className={s.legalNote}>
              Este comprobante corresponde a un recibo de pago emitido para control del cliente. No reemplaza la documentación tributaria oficial cuando aplique.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
