import { api } from './httpClient';
import { type ProductDTO, toProducto } from './catalogApi';

export interface ProductTerminadoDTO {
  id: string;
  codigo?: string;
  nombre: string;
  categoria?: string;
  subcategoria?: string;
  tela?: string;
  tallas?: string[];
  colores?: string[];
  cantidadStock: number;
  precio: number;
  imagenPrincipal?: string;
  estado?: 'Activo' | 'Inactivo';
  createdAt?: string;
  fechaCreacion?: string;
}

export interface ProductTerminado {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  talla: string;
  color: string;
  stock: number;
  precio: number;
  fechaCreacion: string;
  estado: 'Activo' | 'Inactivo';
}

export function toProductTerminado(dto: ProductDTO | ProductTerminadoDTO): ProductTerminado {
  if ('ref' in dto) {
    const p = toProducto(dto);
    return {
      id: p.id ?? p.ref,
      codigo: p.codigo ?? p.ref,
      nombre: p.nombre,
      categoria: p.categoria ?? 'Sin categoría',
      talla: p.tallas.length > 0 ? p.tallas[0] : 'Única',
      color: p.colores.length > 0 ? p.colores[0] : 'Sin especificar',
      stock: p.cantidadStock ?? 0,
      precio: Number(p.precio) || 0,
      fechaCreacion: new Date().toISOString().slice(0, 10),
      estado: (p.estado ?? 'Activo') as 'Activo' | 'Inactivo',
    };
  }
  const d = dto;
  return {
    id: d.id,
    codigo: d.codigo ?? d.id,
    nombre: d.nombre,
    categoria: d.categoria ?? 'Sin categoría',
    talla: Array.isArray(d.tallas) && d.tallas.length > 0 ? d.tallas[0] : 'Única',
    color: Array.isArray(d.colores) && d.colores.length > 0 ? d.colores[0] : 'Sin especificar',
    stock: d.cantidadStock ?? 0,
    precio: Number(d.precio) || 0,
    fechaCreacion: d.fechaCreacion ?? new Date().toISOString().slice(0, 10),
    estado: (d.estado ?? 'Activo') as 'Activo' | 'Inactivo',
  };
}

export const productsApi = {
  async list(): Promise<ProductTerminado[]> {
    try {
      const response = await api.get<{ data: ProductDTO[]; meta: Record<string, unknown> }>('/catalog/products', { auth: false });
      const data = response?.data ?? [];
      return data.map(d => toProductTerminado(d));
    } catch {
      return [];
    }
  },
};

export default productsApi;
