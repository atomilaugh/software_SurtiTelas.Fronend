import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Heart, ShoppingBag, X, AlertTriangle, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { useCart } from '@/core/stores/cartStore';
import { useProductos } from '@/core/stores';
import type { Producto } from '@/core/types';
import s from './Favoritos.module.css';

const FAVORITES_STORAGE_KEY = 'surtitelas.favorites';

interface FavoriteSnapshot {
  id: string;
  ref: string;
  nombre: string;
  precio: number;
  imagenPrincipal?: string;
  imagenes: string[];
  categoria?: string;
  stock: Producto['stock'];
  cantidadStock: number;
}

const readFavorites = (): string[] => {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string' && id.trim() !== '') : [];
  } catch {
    return [];
  }
};

const writeFavorites = (favoriteIds: string[]) => {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
};

const getProductImage = (product: FavoriteSnapshot) => product.imagenPrincipal || product.imagenes[0] || '';

const formatCurrency = (value: number) => `$${value.toLocaleString('es-CO')}`;

const toFavoriteSnapshot = (product: Producto): FavoriteSnapshot => ({
  id: product.id || product.ref,
  ref: product.ref,
  nombre: product.nombre,
  precio: product.precio,
  imagenPrincipal: product.imagenPrincipal,
  imagenes: product.imagenes,
  categoria: product.categoria,
  stock: product.stock,
  cantidadStock: product.cantidadStock,
});

export const Favoritos: React.FC = () => {
  const { productos } = useProductos();
  const { addToCart } = useCart();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [productToRemove, setProductToRemove] = useState<FavoriteSnapshot | null>(null);

  useEffect(() => {
    setFavoriteIds(readFavorites());
  }, []);

  const favoriteProducts = useMemo(() => {
    const productsById = productos
      .map(toFavoriteSnapshot)
      .reduce<Record<string, FavoriteSnapshot>>((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

    const idsFromStorage = new Set(favoriteIds);

    return Array.from(idsFromStorage)
      .map(id => productsById[id])
      .filter((product): product is FavoriteSnapshot => Boolean(product));
  }, [favoriteIds, productos]);

  const removeFavorite = () => {
    if (!productToRemove) return;

    setFavoriteIds(current => {
      const next = current.filter(id => id !== productToRemove.id);
      writeFavorites(next);
      return next;
    });

    toast.success(`${productToRemove.nombre} eliminado de favoritos`);
    setProductToRemove(null);
  };

  const handleAddToCart = (product: FavoriteSnapshot) => {
    if (product.stock === 'Agotado' || product.cantidadStock <= 0) {
      toast.error('Este producto no tiene stock disponible');
      return;
    }

    addToCart({
      cartId: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: getProductImage(product),
      categoria: product.categoria || 'Catálogo',
      talla: 'Única',
      color: 'Único',
      stock: product.cantidadStock || 99,
      quantity: 1,
    });

    toast.success(`${product.nombre} agregado al carrito`);
  };

  return (
    <div className={s.favoritesPage}>
      <header className={s.pageHeader}>
        <div>
          <p className={s.eyebrow}>Wishlist</p>
          <h1 className={s.pageTitle}>Mis Favoritos</h1>
          <p className={s.pageSubtitle}>Prendas que guardaste con corazón para comprarlas más rápido.</p>
        </div>
        <div className={s.countPill}>{favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}</div>
      </header>

      {favoriteProducts.length === 0 ? (
        <div className={s.emptyState}>
          <div className={s.emptyIcon}><PackageSearch size={34} /></div>
          <h2>Aún no tienes favoritos</h2>
          <p>Explora el catálogo y toca el corazón de las prendas que quieras guardar.</p>
        </div>
      ) : (
        <section className={s.favoritesGrid}>
          {favoriteProducts.map(product => (
            <article key={product.id} className={s.favoriteCard}>
              <div className={s.favoriteTopActions}>
                <button
                  className={s.heartButton}
                  type="button"
                  aria-label={`Eliminar ${product.nombre} de favoritos`}
                  onClick={() => setProductToRemove(product)}
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>

              <div className={s.productImageWrapper}>
                {getProductImage(product) ? (
                  <img src={getProductImage(product)} alt={product.nombre} loading="lazy" />
                ) : (
                  <div className={s.placeholderImage}><PackageSearch size={28} /></div>
                )}
              </div>

              <div className={s.productInfo}>
                <span className={s.category}>{product.categoria || 'Producto'}</span>
                <h3>{product.nombre}</h3>
                <p>Ref. {product.ref}</p>
                <strong>{formatCurrency(product.precio)}</strong>
              </div>

              <Button
                variant="primary"
                size="md"
                className={s.addToCartButton}
                disabled={product.stock === 'Agotado' || product.cantidadStock <= 0}
                onClick={() => handleAddToCart(product)}
                leftIcon={<ShoppingBag size={16} />}
              >
                Agregar al Carrito
              </Button>
            </article>
          ))}
        </section>
      )}

      <Modal
        open={!!productToRemove}
        onClose={() => setProductToRemove(null)}
        title="Eliminar de favoritos"
        description="Confirma si quieres quitar esta prenda de tu lista de deseos."
        size="sm"
        footer={(
          <div className={s.modalActions}>
            <Button variant="ghost" onClick={() => setProductToRemove(null)}>Cancelar</Button>
            <Button variant="danger" onClick={removeFavorite} leftIcon={<X size={16} />}>
              Quitar Favorito
            </Button>
          </div>
        )}
      >
        {productToRemove && (
          <div className={s.removePreview}>
            <div className={s.removeIcon}><AlertTriangle size={24} /></div>
            <div>
              <strong>{productToRemove.nombre}</strong>
              <span>Ref. {productToRemove.ref} • {formatCurrency(productToRemove.precio)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
