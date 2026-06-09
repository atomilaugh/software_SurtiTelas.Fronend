import React, { useState } from 'react';
import s from './Comisiones.module.css';

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

export const AsesorComisiones: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Junio 2026');

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
            {['Junio 2026', 'Mayo 2026', 'Abril 2026'].map(month => (
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
              </tr>
            </thead>
            <tbody>
              {historialComisiones.map((item, i) => (
                <tr key={i}>
                  <td className={s.tdPrimary}>{item.mes}</td>
                  <td>{item.pedidos}</td>
                  <td>{item.ventas}</td>
                  <td>{item.porcentaje}</td>
                  <td className={s.tdMono}>{item.comision}</td>
                  <td>
                    <span className={`${s.liquidadoBadge} ${item.estado === 'Pagado' ? s.liquidadoBadgePagado : s.liquidadoBadgePendiente}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>
                    {item.comprobante ? (
                      <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                        {item.comprobante}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};