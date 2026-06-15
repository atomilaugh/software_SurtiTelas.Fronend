import React, { useState } from 'react';
import { Search, TrendingDown, Package, AlertTriangle, BarChart3, Download, ChevronDown } from 'lucide-react';
import s from './ReportesInventario.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';
import { DetailModal } from '@/shared/ui/DetailModal';
import { Info } from 'lucide-react';

interface ProductoReporte {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoUnitario: number;
  precioVenta: number;
  rotacion: 'Alta' | 'Media' | 'Baja';
  valorInventario: number;
  ultimaEntrada: string;
}

const mockProductos: ProductoReporte[] = [
  { id: 'P001', nombre: 'Tela Algodón Premium', categoria: 'Telas', stockActual: 450, stockMinimo: 100, stockMaximo: 800, costoUnitario: 12000, precioVenta: 18000, rotacion: 'Alta', valorInventario: 5400000, ultimaEntrada: '2024-06-01' },
  { id: 'P002', nombre: 'Hilo Cosido #100', categoria: 'Insumos', stockActual: 25, stockMinimo: 50, stockMaximo: 200, costoUnitario: 2500, precioVenta: 4000, rotacion: 'Media', valorInventario: 62500, ultimaEntrada: '2024-05-28' },
  { id: 'P003', nombre: 'Botón Negro 18mm', categoria: 'Accesorios', stockActual: 800, stockMinimo: 200, stockMaximo: 1000, costoUnitario: 300, precioVenta: 500, rotacion: 'Alta', valorInventario: 240000, ultimaEntrada: '2024-06-05' },
  { id: 'P004', nombre: 'Tela Licra Negra', categoria: 'Telas', stockActual: 0, stockMinimo: 80, stockMaximo: 300, costoUnitario: 15000, precioVenta: 22000, rotacion: 'Baja', valorInventario: 0, ultimaEntrada: '2024-04-15' },
  { id: 'P005', nombre: 'Cierre YKK #8', categoria: 'Accesorios', stockActual: 320, stockMinimo: 100, stockMaximo: 500, costoUnitario: 800, precioVenta: 1200, rotacion: 'Alta', valorInventario: 256000, ultimaEntrada: '2024-06-08' },
  { id: 'P006', nombre: 'Elástico 2cm Blanco', categoria: 'Insumos', stockActual: 15, stockMinimo: 40, stockMaximo: 150, costoUnitario: 600, precioVenta: 900, rotacion: 'Media', valorInventario: 9000, ultimaEntrada: '2024-05-20' },
  { id: 'P007', nombre: 'Tela Jean Indigo', categoria: 'Telas', stockActual: 120, stockMinimo: 50, stockMaximo: 250, costoUnitario: 18000, precioVenta: 26000, rotacion: 'Alta', valorInventario: 2160000, ultimaEntrada: '2024-06-03' },
  { id: 'P008', nombre: 'Aguja Industrial 16x231', categoria: 'Insumos', stockActual: 5, stockMinimo: 30, stockMaximo: 100, costoUnitario: 1200, precioVenta: 1800, rotacion: 'Baja', valorInventario: 6000, ultimaEntrada: '2024-03-10' },
];

export const AdminReportesInventario: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');
  const [filtroRotacion, setFiltroRotacion] = useState<string>('Todos');
  const [periodo, setPeriodo] = useState<string>('ultimo_mes');

  const categorias = Array.from(new Set(mockProductos.map(p => p.categoria)));
  // unused removed

  const productosFiltrados = mockProductos.filter(p =>
    (filtroCategoria === 'Todos' || p.categoria === filtroCategoria) &&
    (filtroRotacion === 'Todos' || p.rotacion === filtroRotacion) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) ||
     p.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    valorTotal: mockProductos.reduce((sum, p) => sum + p.valorInventario, 0),
    productosActivos: mockProductos.filter(p => p.stockActual > 0).length,
    productosBajos: mockProductos.filter(p => p.stockActual > 0 && p.stockActual < p.stockMinimo).length,
    productosSinStock: mockProductos.filter(p => p.stockActual === 0).length,
  };

  const topValor = [...mockProductos].sort((a, b) => b.valorInventario - a.valorInventario).slice(0, 5);
  const maxValor = topValor[0]?.valorInventario || 1;

  const rotacionStats = {
    alta: mockProductos.filter(p => p.rotacion === 'Alta').length,
    media: mockProductos.filter(p => p.rotacion === 'Media').length,
    baja: mockProductos.filter(p => p.rotacion === 'Baja').length,
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
  };

  const getRotacionBadge = (rotacion: string) => {
    switch (rotacion) {
      case 'Alta': return 'success';
      case 'Media': return 'warning';
      case 'Baja': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Reportes de Inventario</h1>
          <p className={s.pageSubtitle}>Análisis de stock</p>
        </div>
        <div className={s.headerActions}>
          <div className={s.periodoSelect}>
            <select className={s.select} value={periodo} onChange={e => setPeriodo(e.target.value)}>
              <option value="ultimo_mes">Último mes</option>
              <option value="ultimo_trimestre">Último trimestre</option>
              <option value="ultimo_ano">Último año</option>
            </select>
            <ChevronDown size={16} className={s.selectIcon} />
          </div>
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <BarChart3 size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{formatCurrency(stats.valorTotal)}</div>
            <div className={s.statLabel}>Valor Total Inventario</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardSuccess}`}>
          <Package size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{stats.productosActivos}</div>
            <div className={s.statLabel}>Productos Activos</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardWarning}`}>
          <AlertTriangle size={20} className={s.statIconWarning} />
          <div>
            <div className={s.statValue}>{stats.productosBajos}</div>
            <div className={s.statLabel}>Stock Bajo</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardDanger}`}>
          <TrendingDown size={20} className={s.statIconDanger} />
          <div>
            <div className={s.statValue}>{stats.productosSinStock}</div>
            <div className={s.statLabel}>Sin Stock</div>
          </div>
        </div>
      </div>

      <div className={s.chartsRow}>
        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Top 5 Productos por Valor de Inventario</h3>
          <div className={s.barChart}>
            {topValor.map((p, i) => (
              <div key={p.id} className={s.barRow}>
                <div className={s.barLabel}>
                  <span className={s.barName}>{p.nombre}</span>
                  <span className={s.barAmount}>{formatCurrency(p.valorInventario)}</span>
                </div>
                <div className={s.barTrack}>
                  <div
                    className={`${s.barFill} ${i === 0 ? s.barFillPrimary : i === 1 ? s.barFillAccent : s.barFillDefault}`}
                    style={{ width: `${(p.valorInventario / maxValor) * 100}%` }}
                  />
                </div>
                <span className={s.barPercent}>{Math.round((p.valorInventario / maxValor) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.chartCard}>
          <h3 className={s.chartTitle}>Rotación de Inventario</h3>
          <div className={s.rotacionChart}>
            <div className={s.rotacionItem}>
              <div className={`${s.rotacionDot} ${s.rotacionDotAlta}`} />
              <div className={s.rotacionData}>
                <div className={s.rotacionValue}>{rotacionStats.alta}</div>
                <div className={s.rotacionLabel}>Alta Rotación</div>
              </div>
            </div>
            <div className={s.rotacionItem}>
              <div className={`${s.rotacionDot} ${s.rotacionDotMedia}`} />
              <div className={s.rotacionData}>
                <div className={s.rotacionValue}>{rotacionStats.media}</div>
                <div className={s.rotacionLabel}>Media Rotación</div>
              </div>
            </div>
            <div className={s.rotacionItem}>
              <div className={`${s.rotacionDot} ${s.rotacionDotBaja}`} />
              <div className={s.rotacionData}>
                <div className={s.rotacionValue}>{rotacionStats.baja}</div>
                <div className={s.rotacionLabel}>Baja Rotación</div>
              </div>
            </div>
          </div>
          <div className={s.rotacionBars}>
            <div className={s.rotacionBarRow}>
              <span className={s.rotacionBarLabel}>Alta</span>
              <div className={s.rotacionBarTrack}>
                <div className={s.rotacionBarFillAlta} style={{ width: `${(rotacionStats.alta / mockProductos.length) * 100}%` }} />
              </div>
              <span className={s.rotacionBarPercent}>{Math.round((rotacionStats.alta / mockProductos.length) * 100)}%</span>
            </div>
            <div className={s.rotacionBarRow}>
              <span className={s.rotacionBarLabel}>Media</span>
              <div className={s.rotacionBarTrack}>
                <div className={s.rotacionBarFillMedia} style={{ width: `${(rotacionStats.media / mockProductos.length) * 100}%` }} />
              </div>
              <span className={s.rotacionBarPercent}>{Math.round((rotacionStats.media / mockProductos.length) * 100)}%</span>
            </div>
            <div className={s.rotacionBarRow}>
              <span className={s.rotacionBarLabel}>Baja</span>
              <div className={s.rotacionBarTrack}>
                <div className={s.rotacionBarFillBaja} style={{ width: `${(rotacionStats.baja / mockProductos.length) * 100}%` }} />
              </div>
              <span className={s.rotacionBarPercent}>{Math.round((rotacionStats.baja / mockProductos.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.tableSection}>
        <div className={s.tableHeader}>
          <h3 className={s.tableTitle}>Detalle de Productos</h3>
          <div className={s.tableFilters}>
            <div className={s.filterGroup}>
              {['Todos', ...categorias].map(cat => (
                <button
                  key={cat}
                  className={`${s.filterBtn} ${filtroCategoria === cat ? s.filterBtnActive : ''}`}
                  onClick={() => setFiltroCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={s.searchBox}>
              <Search size={16} className={s.searchIcon} />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={s.searchInput}
              />
            </div>
          </div>
        </div>

        <DataTable<ProductoReporte>
          data={productosFiltrados}
          pageSize={10}
          emptyMessage="No se encontraron productos"
          maxVisibleColumns={5}
          detailPanel={{
            title: (p) => p.nombre,
            render: (p) => (
              <div className={s.detailPanel}>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Información del producto</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Categoría</span><span><Badge variant="default">{p.categoria}</Badge></span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Stock actual</span><span>{p.stockActual}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Stock mínimo</span><span>{p.stockMinimo}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Stock máximo</span><span>{p.stockMaximo}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Costo unitario</span><span>{formatCurrency(p.costoUnitario)}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Precio venta</span><span>{formatCurrency(p.precioVenta)}</span></div>
                  </div>
                </div>
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Valores y rotación</h4>
                  <div className={s.detailGrid}>
                    <div className={s.detailItem}><span className={s.detailLabel}>Valor inventario</span><span className={s.tdBold}>{formatCurrency(p.valorInventario)}</span></div>
                    <div className={s.detailItem}><span className={s.detailLabel}>Rotación</span><span><Badge variant={getRotacionBadge(p.rotacion)}>{p.rotacion}</Badge></span></div>
                    <div className={s.detailItemFull}><span className={s.detailLabel}>Última entrada</span><span>{p.ultimaEntrada}</span></div>
                  </div>
                </div>
              </div>
            ),
          }}
          columns={[
            { key: 'nombre', header: 'Producto', sortable: true, render: (p) => <span className={s.tdPrimary}>{p.nombre}</span> },
            { key: 'stockActual', header: 'Stock', width: '100px', sortable: true, align: 'center', render: (p) => {
              const porcentajeStock = Math.min((p.stockActual / p.stockMaximo) * 100, 100);
              return (
                <div className={s.tdCenter}>
                  <div className={s.stockCell}>
                    <span className={s.stockValue}>{p.stockActual}</span>
                    <div className={s.stockBar}>
                      <div
                        className={`${s.stockFill} ${porcentajeStock < 25 ? s.stockFillDanger : porcentajeStock < 50 ? s.stockFillWarning : s.stockFillSuccess}`}
                        style={{ width: `${porcentajeStock}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            }},
            { key: 'rotacion', header: 'Rotación', width: '100px', sortable: true, render: (p) => (
              <Badge variant={getRotacionBadge(p.rotacion)}>{p.rotacion}</Badge>
            )},
            { key: 'precioVenta', header: 'Precio', width: '110px', sortable: true, align: 'right', render: (p) => <span className={s.tdRight}>{formatCurrency(p.precioVenta)}</span> },
            { key: 'ultimaEntrada', header: 'Última Entrada', width: '110px', sortable: true, render: (p) => (
              <span className={s.tdMuted}>{p.ultimaEntrada}</span>
            )},
          ]}
        />
      </div>
    </div>
  );
};


