import { Product, type ProductData } from '@/domain/entities/Product';
import type { ProductRepository } from '@/domain/repositories/ProductRepository';
import { ProductMapper, type ProductDTO } from '@/infrastructure/mappers/ProductMapper';

const PRODUCTS_STORAGE_KEY = 'surti_productos';

export class LocalStorageProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    return this.readAll().map(ProductMapper.toDomain);
  }

  async getById(id: string): Promise<Product | null> {
    const product = this.readAll().find(item => item.id === id);
    return product ? ProductMapper.toDomain(product) : null;
  }

  async getByRef(ref: string): Promise<Product | null> {
    const product = this.readAll().find(item => item.ref === ref);
    return product ? ProductMapper.toDomain(product) : null;
  }

  async create(input: Omit<ProductData, 'ref'> & { ref?: string }): Promise<Product> {
    const products = this.readAll();
    const product = new Product({
      ...input,
      ref: input.ref ?? this.generateRef(products),
      codigo: input.codigo ?? `PROD-${String(products.length + 1).padStart(3, '0')}`,
      descripcion: input.descripcion || '',
      descripcionCorta: input.descripcionCorta || input.descripcion || input.nombre || 'Sin descripción',
      categoria: input.categoria || 'General',
      subcategoria: input.subcategoria || '',
      marca: input.marca || 'SurtiTelas',
      precioAnterior: input.precioAnterior ?? 0,
      descuento: input.descuento ?? 0,
      estado: input.estado || 'Activo',
      imagenes: input.imagenes ?? [],
      imagenPrincipal: input.imagenPrincipal || input.imagenes?.[0] || '',
      publicado: false,
      destacado: input.destacado ?? false,
      oferta: input.oferta ?? false,
      nuevo: input.nuevo ?? false,
      masVendido: input.masVendido ?? false,
      colores: input.colores ?? [],
      tallas: input.tallas ?? [],
    });

    this.writeAll([ProductMapper.toDTO(product), ...products]);

    return product;
  }

  async update(ref: string, changes: Partial<ProductData>): Promise<Product> {
    const products = this.readAll();
    const currentProduct = products.find(item => item.ref === ref);

    if (!currentProduct) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = ProductMapper.toDomain(currentProduct).withChanges(changes);
    const nextProducts = products.map(product =>
      product.ref === ref ? ProductMapper.toDTO(updatedProduct) : product
    );

    this.writeAll(nextProducts);

    return updatedProduct;
  }

  async delete(ref: string): Promise<void> {
    const products = this.readAll();
    const exists = products.some(product => product.ref === ref);

    if (!exists) {
      throw new Error('Producto no encontrado');
    }

    this.writeAll(products.filter(product => product.ref !== ref));
  }

  private readAll(): ProductDTO[] {
    try {
      const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);

      if (!raw) return [];

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed as ProductDTO[] : [];
    } catch {
      return [];
    }
  }

  private writeAll(products: ProductDTO[]): void {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      return;
    }
  }

  private generateRef(products: ProductDTO[]): string {
    const max = products.reduce((currentMax, product) => {
      const match = product.ref.match(/\d+/);

      if (!match) return currentMax;

      return Math.max(currentMax, Number.parseInt(match[0], 10));
    }, 0);

    return `REF-${String(max + 1).padStart(3, '0')}`;
  }
}
