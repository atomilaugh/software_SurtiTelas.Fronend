import type { Producto } from '@/core/types';

/* ──────────────────────────────────────────────
   TIPOS DE RESPUESTA (simulación de API)
   ────────────────────────────────────────────── */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/* ──────────────────────────────────────────────
   productService — métodos mock simulando API REST
   Preparado para reemplazar llamadas sin acoplar
   la lógica a los componentes.
   ────────────────────────────────────────────── */

export const productService = {
  async getAll(): Promise<ApiResponse<Producto[]>> {
    await delay(150);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: true, data: [] };
    try {
      const parsed = JSON.parse(stored) as Producto[];
      return { success: true, data: parsed };
    } catch {
      return { success: false, error: 'Error parsing stored products' };
    }
  },

  async getById(ref: string): Promise<ApiResponse<Producto | undefined>> {
    await delay(100);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: false, error: 'No products found' };
    try {
      const parsed = JSON.parse(stored) as Producto[];
      const found = parsed.find(p => p.ref === ref);
      return { success: !!found, data: found, error: found ? undefined : 'Product not found' };
    } catch {
      return { success: false, error: 'Error parsing stored products' };
    }
  },

  async create(data: Omit<Producto, 'ref'>): Promise<ApiResponse<Producto>> {
    await delay(200);
    const stored = localStorage.getItem('surti_productos');
    let products: Producto[] = [];
    if (stored) {
      try { products = JSON.parse(stored) as Producto[]; } catch { /* ignore */ }
    }
    const newRef = `REF-${String(products.length + 1).padStart(3, '0')}`;
    const codigo = data.codigo || `PROD-${String(products.length + 1).padStart(3, '0')}`;
    const nuevo: Producto = {
      ref: newRef,
      codigo,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      descripcionCorta: data.descripcionCorta || data.descripcion || data.nombre,
      categoria: data.categoria || 'General',
      subcategoria: data.subcategoria || '',
      marca: data.marca || 'SurtiTelas',
      precio: data.precio,
      precioAnterior: data.precioAnterior ?? data.precio,
      descuento: data.descuento ?? 0,
      stock: data.stock,
      cantidadStock: data.cantidadStock,
      estado: data.estado || 'Activo',
      imagenes: data.imagenes,
      imagenPrincipal: data.imagenPrincipal || (data.imagenes?.[0]) || '',
      publicado: false,
      destacado: data.destacado ?? false,
      oferta: data.oferta ?? false,
      nuevo: data.nuevo ?? false,
      masVendido: data.masVendido ?? false,
      tela: data.tela,
      colores: data.colores,
      tallas: data.tallas,
    };
    products = [...products, nuevo];
    localStorage.setItem('surti_productos', JSON.stringify(products));
    return { success: true, data: nuevo, message: 'Producto creado exitosamente' };
  },

  async update(ref: string, data: Partial<Producto>): Promise<ApiResponse<Producto | undefined>> {
    await delay(180);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: false, error: 'No products found' };
    try {
      const products = JSON.parse(stored) as Producto[];
      const idx = products.findIndex(p => p.ref === ref);
      if (idx === -1) return { success: false, error: 'Product not found' };
      const updated: Producto = { ...products[idx], ...data };
      products[idx] = updated;
      localStorage.setItem('surti_productos', JSON.stringify(products));
      return { success: true, data: updated, message: 'Producto actualizado' };
    } catch {
      return { success: false, error: 'Error updating product' };
    }
  },

  async delete(ref: string): Promise<ApiResponse<boolean>> {
    await delay(150);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: false, error: 'No products found' };
    try {
      const products = JSON.parse(stored) as Producto[];
      const filtered = products.filter(p => p.ref !== ref);
      if (filtered.length === products.length) return { success: false, error: 'Product not found' };
      localStorage.setItem('surti_productos', JSON.stringify(filtered));
      return { success: true, data: true, message: 'Producto eliminado' };
    } catch {
      return { success: false, error: 'Error deleting product' };
    }
  },

  async publish(ref: string): Promise<ApiResponse<Producto | undefined>> {
    await delay(200);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: false, error: 'No products found' };
    try {
      const products = JSON.parse(stored) as Producto[];
      const idx = products.findIndex(p => p.ref === ref);
      if (idx === -1) return { success: false, error: 'Product not found' };
      const product = products[idx];
      if (!product.nombre?.trim()) return { success: false, error: 'El nombre es obligatorio para publicar' };
      if (!product.categoria?.trim()) return { success: false, error: 'La categoría es obligatoria para publicar' };
      if (!product.precio || product.precio <= 0) return { success: false, error: 'El precio debe ser mayor a 0' };
      const hasImage = (product.imagenPrincipal && product.imagenPrincipal.trim() !== '') ||
                       (product.imagenes && product.imagenes.length > 0);
      if (!hasImage) return { success: false, error: 'Debe tener al menos una imagen principal' };
      const now = new Date().toISOString();
      products[idx] = {
        ...product,
        publicado: true,
        fechaPublicacion: product.fechaPublicacion || now,
      };
      localStorage.setItem('surti_productos', JSON.stringify(products));
      return { success: true, data: products[idx], message: 'Producto publicado correctamente' };
    } catch {
      return { success: false, error: 'Error publishing product' };
    }
  },

  async unpublish(ref: string): Promise<ApiResponse<Producto | undefined>> {
    await delay(180);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: false, error: 'No products found' };
    try {
      const products = JSON.parse(stored) as Producto[];
      const idx = products.findIndex(p => p.ref === ref);
      if (idx === -1) return { success: false, error: 'Product not found' };
      products[idx] = { ...products[idx], publicado: false };
      localStorage.setItem('surti_productos', JSON.stringify(products));
      return { success: true, data: products[idx], message: 'Producto despublicado' };
    } catch {
      return { success: false, error: 'Error unpublishing product' };
    }
  },
};

/* ──────────────────────────────────────────────
   catalogService — métodos para Catálogo Digital
   ────────────────────────────────────────────── */

export const catalogService = {
  async getPublishedProducts(): Promise<ApiResponse<Producto[]>> {
    await delay(120);
    const stored = localStorage.getItem('surti_productos');
    if (!stored) return { success: true, data: [] };
    try {
      const parsed = JSON.parse(stored) as Producto[];
      const published = parsed.filter(p => p.publicado === true && p.estado !== 'Inactivo');
      return { success: true, data: published };
    } catch {
      return { success: false, error: 'Error fetching catalog' };
    }
  },

  async getFeaturedProducts(): Promise<ApiResponse<Producto[]>> {
    await delay(100);
    const result = await catalogService.getPublishedProducts();
    if (!result.success || !result.data) return result;
    const featured = result.data.filter(p => p.destacado === true || p.nuevo === true);
    return { success: true, data: featured };
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
