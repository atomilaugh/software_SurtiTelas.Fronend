import React, { useState } from 'react';
import { Search } from 'lucide-react';
import s from './Catalogo.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface Producto {
  ref: string;
  nombre: string;
  tela: string;
  colores: string[];
  tallas: string[];
  precio: number;
  stock: 'OK' | 'Bajo stock' | 'Agotado';
}

const catalogo: Producto[] = [
  { ref: 'REF-001', nombre: 'Camiseta Básica Hombre', tela: 'Algodón 180gr', colores: ['Blanco', 'Negro', 'Gris'], tallas: ['S', 'M', 'L', 'XL'], precio: 28000, stock: 'OK' },
  { ref: 'REF-002', nombre: 'Blusa Campesina Mujer', tela: 'Lino', colores: ['Beige', 'Terracota'], tallas: ['XS', 'S', 'M', 'L'], precio: 42000, stock: 'OK' },
  { ref: 'REF-003', nombre: 'Pantalón Cargo Hombre', tela: 'Denim 12oz', colores: ['Azul', 'Negro'], tallas: ['28', '30', '32', '34'], precio: 78000, stock: 'Bajo stock' },
  { ref: 'REF-004', nombre: 'Vestido Casual Mujer', tela: 'Viscosa', colores: ['Rojo', 'Azul', 'Verde'], tallas: ['XS', 'S', 'M'], precio: 65000, stock: 'OK' },
  { ref: 'REF-005', nombre: 'Sudadera con Capucha', tela: 'Fleece', colores: ['Gris', 'Negro', 'Navy'], tallas: ['S', 'M', 'L', 'XL'], precio: 92000, stock: 'Agotado' },
];

export const AsesorCatalogo: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = catalogo.filter(p =>
    p.ref.toLowerCase().includes(search.toLowerCase()) ||
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className={s.pageTitle}>Catálogo</h1>
      <p className={s.pageSubtitle}>Referencias disponibles para tus pedidos</p>

      <div className={s.catalogoHeader}>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
        
        <div className={s.filters}>
          <select className={s.filterSelect}>
            <option>Todas las telas</option>
            <option>Algodón</option>
            <option>Lino</option>
            <option>Denim</option>
          </select>
        </div>
      </div>

      <div className={s.grid}>
        {filtered.map(producto => (
          <div key={producto.ref} className={s.productCard}>
            <div className={s.productImage}>
              <span>{producto.ref.split('-')[1]}</span>
              <div className={s.stockTag}>
                <Badge variant={producto.stock === 'OK' ? 'success' : producto.stock === 'Bajo stock' ? 'warning' : 'danger'}>
                  {producto.stock}
                </Badge>
              </div>
            </div>
            <div className={s.productBody}>
              <div className={s.productRef}>{producto.ref}</div>
              <div className={s.productName}>{producto.nombre}</div>
              <div className={s.productMeta}>
                {producto.tallas.map(t => (
                  <span key={t} className={s.productChip}>{t}</span>
                ))}
              </div>
              <div className={s.productPrice}>
                <span className={s.priceValue}>${producto.precio.toLocaleString()}</span>
                <span className={s.priceLabel}>C/u</span>
              </div>
            </div>
            <div className={s.productFooter}>
              <Button size="sm" style={{ flex: 1 }}>Ver detalle</Button>
              <Button variant="secondary" size="sm" style={{ flex: 1 }} disabled={producto.stock === 'Agotado'}>
                Agregar a pedido
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};