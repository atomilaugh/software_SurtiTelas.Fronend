import React, { useMemo, useState } from 'react';
import { FileText, Eye, Download, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import s from './Comisiones.module.css';
import { DetailModal } from '@/shared/ui/DetailModal';
import { InfoModal } from '@/shared/ui/InfoModal';
import { Badge } from '@/shared/ui/Badge';
import { Tooltip } from '@/shared/components/Tooltip';

interface Comision {
  mes: string;
  pedidos: number;
  ventas: string;
  porcentaje: string;
  comision: string;
  estado: 'Pagado' | 'Pendiente';
  comprobante: string | null;
}

const historialComisiones: Comision[] = [
  { mes: 'Junio 2026', pedidos: 28, ventas: '$12.400.000', porcentaje: '10%', comision: '$1.240.000', estado: 'Pendiente', comprobante: null },
  { mes: 'Mayo 2026', pedidos: 31, ventas: '$9.800.000', porcentaje: '10%', comision: '$980.000', estado: 'Pagado', comprobante: 'COMP-2026-05' },
  { mes: 'Abril 2026', pedidos: 24, ventas: '$8.200.000', porcentaje: '10%', comision: '$820.000', estado: 'Pagado', comprobante: 'COMP-2026-04' },
  { mes: 'Marzo 2026', pedidos: 19, ventas: '$7.600.000', porcentaje: '10%', comision: '$760.000', estado: 'Pagado', comprobante: 'COMP-2026-03' },
  { mes: 'Febrero 2026', pedidos: 22, ventas: '$8.900.000', porcentaje: '10%', comision: '$890.000', estado: 'Pagado', comprobante: 'COMP-2026-02' },
  { mes: 'Enero 2026', pedidos: 17, ventas: '$7.100.000', porcentaje: '10%', comision: '$710.000', estado: 'Pagado', comprobante: 'COMP-2026-01' },
];

const resumen = [
  { label: 'Comisión Este Mes', value: '$1.240.000', sub: '28 pedidos cerrados', color: 'accent' },
  { label: 'Total Año 2026', value: '$8.720.000', sub: 'Acumulado enero–junio', color: 'default' },
  { label: 'Última Liquidación', value: '$980.000', sub: 'Pagado — Mayo 2026', color: 'success' },
];

const parseCurrency = (value: string) => Number(String(value).replace(/[^0-9]/g, '')) || 0;

export const AsesorComisiones: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [selectedComision, setSelectedComision] = useState<Comision | null>(null);
  const [voucherComision, setVoucherComision] = useState<Comision | null>(null);

  const comisionesFiltradas = useMemo(() => {
    return selectedMonth === 'Todos' ? historialComisiones : historialComisiones.filter(item => item.mes === selectedMonth);
  }, [selectedMonth]);

  const totalMes = comisionesFiltradas.reduce((sum, item) => sum + parseCurrency(item.comision), 0);

  const openDetail = (item: Comision) => {
    setSelectedComision(item);
    setSelectedMonth(item.mes);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Mis Comisiones</h1>
      <p className={s.pageSubtitle}>Historial de comisiones generadas</p>

      <div className={s.resumenGrid}>
        {resumen.map((r, i) => (
          <div key={i} className={s.resumenCard}>
            <div className={s.resumenLabel}>{r.label}</div>
            <div className={`${s.resumenValue} ${r.color === 'accent' ? s.resumenValueAccent : r.color === 'success' ? s.resumenValueSuccess : ''}`}>
              {r.value}
            </div>
            <div className={s.resumenSub}>{r.sub}</div>
          </div>
        ))}
      </div>

      <div className={s.historialSection}>
        <div className={s.historialHeader}>
          <div className={s.historialTitle}>Historial de comisiones</div>
          <div className={s.monthFilter}>
            {['Todos', 'Junio 2026', 'Mayo 2026', 'Abril 2026'].map(month => (
              <button
                key={month}
                className={`${s.monthBtn} ${selectedMonth === month ? s.monthBtnActive : ''}`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Pedidos</th>
                <th>Ventas Totales</th>
                <th>% Comisión</th>
                <th>Comisión Generada</th>
                <th>Estado</th>
                <th>Comprobante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comisionesFiltradas.map((item, i) => (
                <tr key={i}>
                  <td className={s.tdPrimary}>{item.mes}</td>
                  <td>{item.pedidos}</td>
                  <td>{item.ventas}</td>
                  <td>{item.porcentaje}</td>
                  <td className={s.tdMono}>{item.comision}</td>
                  <td>
                    <Badge variant={item.estado === 'Pagado' ? 'success' : 'warning'}>{item.estado}</Badge>
                  </td>
                  <td>
                    {item.comprobante ? (
                      <button type="button" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-accent)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setVoucherComision(item)}>
                        <FileText size={14} />
                        {item.comprobante}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <Tooltip title="Ver detalle"><button type="button" className={s.actionBtn} onClick={() => openDetail(item)}>
                      <Eye size={14} />
                    </button></Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          <span>Mostrando {comisionesFiltradas.length} registros</span>
          <strong>Total filtrado: ${totalMes.toLocaleString()}</strong>
        </div>
      </div>

      <DetailModal
        children={null}
        open={Boolean(selectedComision)}
        onClose={() => setSelectedComision(null)}
        title={selectedComision ? `Comisión ${selectedComision.mes}` : 'Comisión'}
        subtitle="Resumen de liquidación mensual"
        size="lg"
        header={{
          icon: <TrendingUp size={18} />,
          status: selectedComision ? <Badge variant={selectedComision.estado === 'Pagado' ? 'success' : 'warning'}>{selectedComision.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Liquidación',
            fields: [
              { label: 'Mes', value: selectedComision?.mes, icon: <Calendar size={16} /> },
              { label: 'Pedidos cerrados', value: selectedComision?.pedidos, icon: <TrendingUp size={16} /> },
              { label: 'Ventas totales', value: selectedComision?.ventas, icon: <CreditCard size={16} /> },
              { label: 'Porcentaje', value: selectedComision?.porcentaje, icon: <TrendingUp size={16} /> },
              { label: 'Comisión generada', value: selectedComision?.comision, icon: <CreditCard size={16} /> },
            ],
          },
        ]}
        footer={
          <div className="flex justify-end gap-3">
            <button type="button" className="inline-flex h-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-transparent px-3 text-sm font-medium text-[var(--color-text-primary)]" onClick={() => { if (selectedComision?.comprobante) setVoucherComision(selectedComision); }}>
              <Download size={14} style={{ marginRight: 6 }} />
              Descargar comprobante
            </button>
            <button type="button" className="inline-flex h-8 items-center justify-center rounded-xl bg-[var(--btn-primary-bg)] px-4 text-sm font-medium text-[var(--btn-primary-text)]" onClick={() => setSelectedComision(null)}>
              Cerrar
            </button>
          </div>
        }
      />

      <InfoModal
        children={null}
        open={Boolean(voucherComision)}
        onClose={() => setVoucherComision(null)}
        title="Comprobante de pago"
        description={`Código ${voucherComision?.comprobante || 'pendiente'}`}
        sections={voucherComision ? [
          { label: 'Mes', value: voucherComision.mes },
          { label: 'Comprobante', value: voucherComision.comprobante || 'Pendiente de generación' },
          { label: 'Comisión pagada', value: voucherComision.comision },
          { label: 'Estado', value: <Badge variant="success">Pagado</Badge> },
        ] : []}
      />
    </div>
  );
};
