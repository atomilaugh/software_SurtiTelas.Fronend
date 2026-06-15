import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import s from './Catalogo.module.css';
import { DataTable, DataTableColumn } from '@/shared/ui/DataTable';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { ProductPreviewModal } from '@/presentation/components/ProductPreviewModal';
import { useProductos } from '@/core/stores';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import type { Producto, PublicationStatus } from '@/core/types';

const publishStatus = (p: Producto): PublicationStatus => {
  if (!p.publicado) return p.estado === 'Inactivo' ? 'Oculto' : 'Borrador';
  return 'Publicado';
};

export const AsesorCatalogo: React.FC = () => {
  const { productos, createProducto, updateProducto, deleteProducto, publishProducto, unpublishProducto } = useProductos();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Producto | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publicationProduct, setPublicationProduct] = useState<Producto | null>(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingRef, setEditingRef] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [marca, setMarca] = useState('SurtiTelas');
  const [precio, setPrecio] = useState('');
  const [precioAnterior, setPrecioAnterior] = useState('');
  const [descuento, setDescuento] = useState('');
  const [cantidadStock, setCantidadStock] = useState('');
  const [estado, setEstado] = useState<'Activo' | 'Inactivo'>('Activo');
  const [colores, setColores] = useState<string[]>([]);
  const [tallas, setTallas] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [destacado, setDestacado] = useState(false);
  const [oferta, setOferta] = useState(false);
  const [nuevo, setNuevo] = useState(false);
  const [masVendido, setMasVendido] = useState(false);

  const filtered = useMemo(() => {
    return productos.filter(p =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.codigo && p.codigo.toLowerCase().includes(search.toLowerCase()))
    );
  }, [productos, search]);

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setDescripcionCorta('');
    setCategoria('');
    setSubcategoria('');
    setMarca('SurtiTelas');
    setPrecio('');
    setPrecioAnterior('');
    setDescuento('');
    setCantidadStock('');
    setEstado('Activo');
    setColores([]);
    setTallas([]);
    setImagenes([]);
    setImagenPrincipal('');
    setDestacado(false);
    setOferta(false);
    setNuevo(false);
    setMasVendido(false);
    setEditingRef(null);
    setFormError(null);
    setIsModalOpen(false);
  };

  const openEdit = (product: Producto) => {
    setEditingRef(product.ref);
    setNombre(product.nombre);
    setDescripcion(product.descripcion || '');
    setDescripcionCorta(product.descripcionCorta || product.descripcion || '');
    setCategoria(product.categoria || 'General');
    setSubcategoria(product.subcategoria || '');
    setMarca(product.marca || 'SurtiTelas');
    setPrecio(String(product.precio));
    setPrecioAnterior(product.precioAnterior ? String(product.precioAnterior) : '');
    setDescuento(product.descuento ? String(product.descuento) : '');
    setCantidadStock(String(product.cantidadStock));
    setEstado(product.estado || 'Activo');
    setColores(product.colores || []);
    setTallas(product.tallas || []);
    setImagenes(product.imagenes || []);
    setImagenPrincipal(product.imagenPrincipal || '');
    setDestacado(product.destacado || false);
    setOferta(product.oferta || false);
    setNuevo(product.nuevo || false);
    setMasVendido(product.masVendido || false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    setFormError(null);
    if (!nombre.trim()) { setFormError('El nombre del producto es obligatorio'); return false; }
    if (!categoria.trim()) { setFormError('La categoría es obligatoria'); return false; }
    if (!precio || Number(precio) <= 0) { setFormError('El precio debe ser mayor a 0'); return false; }
    if (!imagenPrincipal && (!imagenes || imagenes.length === 0)) {
      setFormError('Debes añadir al menos 1 imagen para el producto.');
      return false;
    }
    if (imagenes.length > 4) { setFormError('El producto permite un máximo de 4 imágenes.'); return false; }
    if (cantidadStock !== '' && Number(cantidadStock) < 0) { setFormError('La cantidad en stock no puede ser negativa'); return false; }
    return true;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const totalQty = Number(cantidadStock) || 0;
      const pre = precioAnterior ? Number(precioAnterior) : Number(precio);
      const desc = descuento ? Number(descuento) : 0;
      const stockStatus: Producto['stock'] = totalQty === 0 ? 'Agotado' : totalQty <= 10 ? 'Bajo stock' : 'OK';
      const baseData: Omit<Producto, 'ref'> = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || descripcionCorta.trim(),
        descripcionCorta: descripcionCorta.trim() || descripcion.trim() || nombre.trim(),
        categoria: categoria.trim(),
        subcategoria: subcategoria.trim(),
        marca: marca.trim(),
        precio: Number(precio),
        precioAnterior: pre,
        descuento: desc,
        stock: stockStatus,
        cantidadStock: totalQty,
        estado,
        imagenes: imagenes.filter(Boolean),
        imagenPrincipal: imagenPrincipal || (imagenes.length > 0 ? imagenes[0] : ''),
        destacado,
        oferta,
        nuevo,
        masVendido,
        tela: '',
        colores,
        tallas,
      };

      if (editingRef) {
        const refreshed = updateProducto(editingRef, baseData);
        toast.success(`${refreshed.nombre} actualizado correctamente`);
      } else {
        const nuevoCodigo = `PROD-${String(productos.length + 1).padStart(3, '0')}`;
        createProducto({ ...baseData, codigo: nuevoCodigo });
        toast.success('Producto creado correctamente');
      }

      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product: Producto) => {
    deleteProducto(product.ref);
    toast.success('Producto eliminado del catálogo');
  };

  const handleTogglePublication = () => {
    if (!publicationProduct) return;
    const status = publishStatus(publicationProduct);
    const success = status === 'Publicado'
      ? unpublishProducto(publicationProduct.ref)
      : publishProducto(publicationProduct.ref);

    if (success) {
      toast.success(status === 'Publicado' ? 'Producto ocultado correctamente' : 'Producto publicado correctamente');
    } else {
      toast.error('El producto requiere nombre, categoría, precio e imagen para publicarse');
    }
    setPublicationProduct(null);
  };

  const handleEdit = (product: Producto) => openEdit(product);

  const columns: DataTableColumn<Producto>[] = [
    {
      key: 'nombre',
      header: 'Producto',
      sortable: true,
      minWidth: '220px',
      render: (item: Producto) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.88rem' }}>{item.nombre}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {item.codigo || item.ref}
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      sortable: true,
      render: (item: Producto) => (
        <div>
          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>{item.categoria || 'General'}</div>
          {item.subcategoria && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{item.subcategoria}</div>}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (item: Producto) => {
        const variant = item.stock === 'OK' ? 'success' : item.stock === 'Bajo stock' ? 'warning' : 'danger';
        return <Badge variant={variant}>{item.stock}</Badge>;
      },
    },
    {
      key: 'cantidadStock',
      header: 'Stock',
      sortable: true,
      align: 'right',
      render: (item: Producto) => <span style={{ fontSize: '0.84rem' }}>{item.cantidadStock}</span>,
    },
    {
      key: 'precio',
      header: 'Precio',
      sortable: true,
      align: 'right',
      render: (item: Producto) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.88rem' }}>
            ${item.precio.toLocaleString()}
          </span>
          {item.precioAnterior && item.precioAnterior > item.precio && (
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
              ${item.precioAnterior.toLocaleString()}
              {(item.descuento ?? 0) > 0 && <span style={{ color: '#ef4444', marginLeft: '4px' }}>-{item.descuento}%</span>}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'publicacion',
      header: 'Publicación',
      sortable: true,
      align: 'center',
      render: (item: Producto) => {
        const status = publishStatus(item);
        const config: { [K in PublicationStatus]: { variant: 'success' | 'warning' | 'danger'; icon: string } } = {
          Publicado: { variant: 'success', icon: '🟢' },
          Borrador: { variant: 'warning', icon: '🟡' },
          Oculto: { variant: 'danger', icon: '🔴' },
        };
        const cfg = config[status];
        return <Badge variant={cfg.variant} dot>{cfg.icon} {status}</Badge>;
      },
    },
  ];

  const actions = (item: Producto) => [
    {
      label: 'Vista previa',
      icon: <Eye size={14} />,
      onClick: () => { setPreviewProduct(item); setPreviewOpen(true); },
    },
    {
      label: 'Editar',
      icon: <Edit size={14} />,
      onClick: () => handleEdit(item),
    },
    {
      label: publishStatus(item) === 'Publicado' ? 'Ocultar' : 'Publicar',
      icon: <EyeOff size={14} />,
      onClick: () => setPublicationProduct(item),
    },
    {
      label: 'Eliminar',
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => {
        if (window.confirm(`¿Eliminar "${item.nombre}"?`)) handleDelete(item);
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className={s.pageTitle}>Catálogo Digital</h1>
        <p className={s.pageSubtitle}>Gestiona productos para el catálogo digital del frontend</p>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          debounceMs={100}
          minChars={0}
        />
        <Button leftIcon={<Plus size={16} />} onClick={() => { setEditingRef(null); setIsModalOpen(true); }}>
          Nuevo Producto
        </Button>
      </div>

      <DataTable<Producto>
        data={filtered}
        columns={columns}
        actions={actions}
        enableExport={false}
        enableRowSelection={false}
        enableSorting={true}
        enableColumnFilters={false}
        toolbarLeft={null}
        maxVisibleColumns={6}
      />

      <Modal open={isModalOpen} onClose={resetForm} title={editingRef ? 'Editar Producto' : 'Registrar Nuevo Producto'} size="lg">
        <form onSubmit={handleSaveProduct} className={s.modalForm}>
          {formError && !saving && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#ef4444', fontSize: '0.82rem', fontWeight: 500 }}>
              {formError}
            </div>
          )}

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label>Nombre del Producto *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Camiseta Oversize Premium" />
            </div>
            <div className={s.formGroup}>
              <label>Categoría *</label>
              <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ej: Camisetas" />
            </div>
          </div>

          <div className={s.formGroup}>
            <label>Descripción Corta</label>
            <input type="text" value={descripcionCorta} onChange={(e) => setDescripcionCorta(e.target.value)} placeholder="Resumen breve para el catálogo" />
          </div>

          <div className={s.formGroup}>
            <label>Descripción Completa</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Añade detalles..." rows={3} />
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label>Precio ($) *</label>
              <input type="number" min="1" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio base" />
            </div>
            <div className={s.formGroup}>
              <label>Precio Anterior (opcional)</label>
              <input type="number" min="0" value={precioAnterior} onChange={(e) => setPrecioAnterior(e.target.value)} placeholder="Sin descuento" />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label>Descuento (%)</label>
              <input type="number" min="0" max="100" value={descuento} onChange={(e) => setDescuento(e.target.value)} placeholder="0" />
            </div>
            <div className={s.formGroup}>
              <label>Cantidad Stock</label>
              <input type="number" min="0" value={cantidadStock} onChange={(e) => setCantidadStock(e.target.value)} placeholder="Unidades en bodega" />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label>Tipo de Tela</label>
              <input type="text" value="" onChange={() => {}} disabled placeholder="Solo lectura" style={{ opacity: 0.6 }} />
            </div>
            <div className={s.formGroup}>
              <label>Marca</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label>Colores Disponibles</label>
              <input type="text" value={colores.join(', ')} onChange={(e) => setColores(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Ej: Azul, Blanco, Verde" />
            </div>
            <div className={s.formGroup}>
              <label>Tallas Disponibles</label>
              <input type="text" value={tallas.join(', ')} onChange={(e) => setTallas(e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean))} placeholder="Ej: S, M, L, XL" />
            </div>
          </div>

          <div className={s.formGroup}>
            <label>Subcategoría</label>
            <input type="text" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} placeholder="Ej: Básicas, Premium" />
          </div>

          <div className={s.formGroup}>
            <label>Imagen Principal (URL)</label>
            <input type="text" value={imagenPrincipal} onChange={(e) => setImagenPrincipal(e.target.value)} placeholder="https://..." />
          </div>

          <div className={s.formGroup}>
            <label>Imágenes de Referencia (Máximo 4)</label>
            <div className={s.uploadContainer}>
              <label className={s.uploadPlaceholder}>
                <span style={{ fontSize: '1.2rem' }}>+</span>
                <span>Agregar imagen (URL)</span>
                <input
                  type="text"
                  className={s.hiddenFileInput}
                  placeholder="Pegar URL y presionar Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim() && imagenes.length < 4) {
                      e.preventDefault();
                      setImagenes([...imagenes, e.currentTarget.value.trim()]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </label>
              {imagenes.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {imagenes.map((url, index) => (
                    <div key={index} className={s.previewBox} style={{ width: '100px' }}>
                      <img src={url} alt={`Ref ${index + 1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '6px' }} />
                      <button type="button" onClick={() => setImagenes(imagenes.filter((_, i) => i !== index))} className={s.removeImgBtn}>
                        <span style={{ fontSize: '14px' }}>×</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={s.formGroup}>
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value === 'Inactivo' ? 'Inactivo' : 'Activo')}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo (Oculto)</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label>Etiquetas</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { key: 'destacado', label: 'Destacado', state: destacado, set: setDestacado },
                { key: 'oferta', label: 'Oferta', state: oferta, set: setOferta },
                { key: 'nuevo', label: 'Nuevo', state: nuevo, set: setNuevo },
                { key: 'masVendido', label: 'Más vendido', state: masVendido, set: setMasVendido },
              ].map(({ key, label, state, set }) => (
                <label key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text-secondary)', padding: '6px 12px', background: state ? 'rgba(244,162,97,0.15)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${state ? 'rgba(244,162,97,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  <input type="checkbox" checked={state} onChange={(e) => set(e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className={s.modalActions}>
            <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingRef ? 'Guardar Cambios' : 'Crear Producto (Borrador)'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        open={Boolean(publicationProduct)}
        onClose={() => setPublicationProduct(null)}
        onConfirm={handleTogglePublication}
        title={publicationProduct && publishStatus(publicationProduct) === 'Publicado' ? 'Ocultar producto' : 'Publicar producto'}
        description={publicationProduct && publishStatus(publicationProduct) === 'Publicado'
          ? `¿Ocultar "${publicationProduct.nombre}" del catálogo público?`
          : `¿Publicar "${publicationProduct?.nombre}" en el catálogo público?`}
        confirmLabel={publicationProduct && publishStatus(publicationProduct) === 'Publicado' ? 'Ocultar' : 'Publicar'}
      />

      <ProductPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} product={previewProduct} />
    </div>
  );
};
