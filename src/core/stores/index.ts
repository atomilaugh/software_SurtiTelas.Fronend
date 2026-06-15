import { create } from 'zustand';
import type { Cliente, Pedido, Producto, OrdenProduccion, MovimientoInventario, Notificacion, Proveedor } from '@/core/types';

/* ──────────────────────────────────────────────
   SEED DATA
   ────────────────────────────────────────────── */
const seedProductos: Producto[] = [
  {
    ref: 'REF-001', codigo: 'CAM-001', nombre: 'Camiseta Básica Hombre',
    descripcion: 'Camiseta básica de algodón para hombre, cómoda y versátil para el día a día.',
    descripcionCorta: 'Camiseta básica de algodón para hombre',
    categoria: 'Camisetas', subcategoria: 'Básicas', marca: 'SurtiTelas',
    precio: 28000, precioAnterior: 35000, descuento: 20,
    stock: 'OK', cantidadStock: 45, estado: 'Activo',
    imagenes: [], imagenPrincipal: '',
    publicado: true, fechaPublicacion: '2026-06-01T10:00:00.000Z',
    destacado: true, oferta: true, nuevo: false, masVendido: true,
    tela: 'Algodón 180gr', colores: ['Blanco', 'Negro', 'Gris'], tallas: ['S', 'M', 'L', 'XL']
  },
  {
    ref: 'REF-002', codigo: 'BLU-002', nombre: 'Blusa Campesina Mujer',
    descripcion: 'Blusa campesina de lino con bordados artesanales tradicionales colombianos.',
    descripcionCorta: 'Blusa campesina de lino con bordados',
    categoria: 'Blusas', subcategoria: 'Campesinas', marca: 'SurtiTelas',
    precio: 42000, precioAnterior: 0, descuento: 0,
    stock: 'OK', cantidadStock: 20, estado: 'Activo',
    imagenes: [], imagenPrincipal: '',
    publicado: true, fechaPublicacion: '2026-06-02T10:00:00.000Z',
    destacado: false, oferta: false, nuevo: true, masVendido: false,
    tela: 'Lino', colores: ['Beige', 'Terracota'], tallas: ['XS', 'S', 'M', 'L']
  },
  {
    ref: 'REF-003', codigo: 'PAN-003', nombre: 'Pantalón Cargo Hombre',
    descripcion: 'Pantalón cargo de denim con múltiples bolsillos, resistente y moderno.',
    descripcionCorta: 'Pantalón cargo de denim resistente',
    categoria: 'Pantalones', subcategoria: 'Cargo', marca: 'SurtiTelas',
    precio: 78000, precioAnterior: 90000, descuento: 13,
    stock: 'Bajo stock', cantidadStock: 4, estado: 'Activo',
    imagenes: [], imagenPrincipal: '',
    publicado: true, fechaPublicacion: '2026-05-28T10:00:00.000Z',
    destacado: true, oferta: true, nuevo: false, masVendido: true,
    tela: 'Denim 12oz', colores: ['Azul', 'Negro'], tallas: ['28', '30', '32', '34']
  },
  {
    ref: 'REF-004', codigo: 'VES-004', nombre: 'Vestido Casual Mujer',
    descripcion: 'Vestido casual de viscosa, perfecto para ocasiones especiales y eventos.',
    descripcionCorta: 'Vestido casual de viscosa elegante',
    categoria: 'Vestidos', subcategoria: 'Casual', marca: 'SurtiTelas',
    precio: 65000, precioAnterior: 0, descuento: 0,
    stock: 'OK', cantidadStock: 15, estado: 'Activo',
    imagenes: [], imagenPrincipal: '',
    publicado: false, fechaPublicacion: undefined,
    destacado: false, oferta: false, nuevo: true, masVendido: false,
    tela: 'Viscosa', colores: ['Rojo', 'Azul', 'Verde'], tallas: ['XS', 'S', 'M']
  },
  {
    ref: 'REF-005', codigo: 'SUD-005', nombre: 'Sudadera con Capucha',
    descripcion: 'Sudadera con capucha de fleece, ideal para climas fríos y uso deportivo.',
    descripcionCorta: 'Sudadera con capucha de fleece',
    categoria: 'Sudaderas', subcategoria: 'Con capucha', marca: 'SurtiTelas',
    precio: 92000, precioAnterior: 110000, descuento: 16,
    stock: 'Agotado', cantidadStock: 0, estado: 'Inactivo',
    imagenes: [], imagenPrincipal: '',
    publicado: false, fechaPublicacion: undefined,
    destacado: true, oferta: true, nuevo: false, masVendido: false,
    tela: 'Fleece', colores: ['Gris', 'Negro', 'Navy'], tallas: ['S', 'M', 'L', 'XL']
  },
];

const seedClientes: Cliente[] = [
  { id: 'CL-001', nombre: 'Almacén El Sol', ciudad: 'Bogotá', tel: '310 234 5678', asesor: 'Camila Torres', pedidos: 34, estado: 'Activo', nit: '890.300.123-4', cupoTotal: 5000000, cupoUsado: 2100000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-002', nombre: 'Boutique Moda+', ciudad: 'Medellín', tel: '311 345 6789', asesor: 'Luis Herrera', pedidos: 18, estado: 'Activo', nit: '890.400.456-7', cupoTotal: 3000000, cupoUsado: 2850000, deudaVencida: 450000, isTrustedCustomer: false },
  { id: 'CL-003', nombre: 'Textiles Andina', ciudad: 'Cali', tel: '312 456 7890', asesor: 'Camila Torres', pedidos: 52, estado: 'Activo', nit: '890.500.789-1', cupoTotal: 8000000, cupoUsado: 1200000, deudaVencida: 0, isTrustedCustomer: true },
  { id: 'CL-004', nombre: 'Moda Casual SAS', ciudad: 'Bogotá', tel: '313 567 8901', asesor: 'Pedro Gómez', pedidos: 28, estado: 'Activo', nit: '890.600.234-5', cupoTotal: 4500000, cupoUsado: 3900000, deudaVencida: 120000, isTrustedCustomer: false },
  { id: 'CL-005', nombre: 'La Tienda Norte', ciudad: 'Barranquilla', tel: '314 567 8902', asesor: 'Camila Torres', pedidos: 41, estado: 'Activo', nit: '890.700.567-8', cupoTotal: 6000000, cupoUsado: 4100000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-006', nombre: 'Confección del Valle', ciudad: 'Cali', tel: '315 678 9012', asesor: 'Luis Herrera', pedidos: 22, estado: 'Activo', nit: '890.800.890-2', cupoTotal: 3500000, cupoUsado: 3500000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-007', nombre: 'Telas Premium', ciudad: 'Medellín', tel: '316 789 0123', asesor: 'Pedro Gómez', pedidos: 15, estado: 'Activo', nit: '890.900.123-6', cupoTotal: 2800000, cupoUsado: 2450000, deudaVencida: 350000, isTrustedCustomer: false },
  { id: 'CL-008', nombre: 'Moda Express', ciudad: 'Bogotá', tel: '317 890 1234', asesor: 'María Ruiz', pedidos: 33, estado: 'Activo', nit: '890.100.456-9', cupoTotal: 5200000, cupoUsado: 3800000, deudaVencida: 0, isTrustedCustomer: true },
  { id: 'CL-009', nombre: 'Boutique La Luna', ciudad: 'Cali', tel: '318 901 2345', asesor: 'Camila Torres', pedidos: 27, estado: 'Activo', nit: '890.110.789-3', cupoTotal: 4000000, cupoUsado: 2900000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-010', nombre: 'Textiles del Caribe', ciudad: 'Barranquilla', tel: '319 012 3456', asesor: 'Luis Herrera', pedidos: 19, estado: 'Inactivo', nit: '890.120.012-5', cupoTotal: 3200000, cupoUsado: 2800000, deudaVencida: 89000, isTrustedCustomer: false },
  { id: 'CL-011', nombre: 'Ropa Urbana', ciudad: 'Bogotá', tel: '320 123 4567', asesor: 'Pedro Gómez', pedidos: 25, estado: 'Activo', nit: '890.130.345-7', cupoTotal: 4800000, cupoUsado: 4200000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-012', nombre: 'Moda Fina', ciudad: 'Medellín', tel: '321 234 5678', asesor: 'María Ruiz', pedidos: 12, estado: 'Activo', nit: '890.140.678-1', cupoTotal: 2500000, cupoUsado: 2200000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-013', nombre: 'Almacén y Más', ciudad: 'Bogotá', tel: '322 345 6789', asesor: 'Camila Torres', pedidos: 38, estado: 'Activo', nit: '890.150.901-4', cupoTotal: 6500000, cupoUsado: 5100000, deudaVencida: 0, isTrustedCustomer: true },
  { id: 'CL-014', nombre: 'Boutique Elegante', ciudad: 'Cali', tel: '323 456 7890', asesor: 'Pedro Gómez', pedidos: 16, estado: 'Inactivo', nit: '890.160.234-6', cupoTotal: 3800000, cupoUsado: 3400000, deudaVencida: 40000, isTrustedCustomer: false },
  { id: 'CL-015', nombre: 'Textiles Norteños', ciudad: 'Medellín', tel: '324 567 8901', asesor: 'Luis Herrera', pedidos: 29, estado: 'Activo', nit: '890.170.567-9', cupoTotal: 4200000, cupoUsado: 3100000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-016', nombre: 'Moda Actual', ciudad: 'Barranquilla', tel: '325 678 9012', asesor: 'Camila Torres', pedidos: 21, estado: 'Activo', nit: '890.180.890-3', cupoTotal: 3600000, cupoUsado: 3200000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-017', nombre: 'Boutique Central', ciudad: 'Bogotá', tel: '326 789 0123', asesor: 'María Ruiz', pedidos: 14, estado: 'Activo', nit: '890.190.123-5', cupoTotal: 2900000, cupoUsado: 2500000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-018', nombre: 'Telas del Sur', ciudad: 'Cali', tel: '327 890 1234', asesor: 'Pedro Gómez', pedidos: 26, estado: 'Activo', nit: '890.200.456-8', cupoTotal: 4400000, cupoUsado: 3600000, deudaVencida: 0, isTrustedCustomer: true },
  { id: 'CL-019', nombre: 'Confección Express', ciudad: 'Bogotá', tel: '328 901 2345', asesor: 'Luis Herrera', pedidos: 17, estado: 'Activo', nit: '890.210.789-1', cupoTotal: 3100000, cupoUsado: 2700000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-020', nombre: 'Moda Joven', ciudad: 'Medellín', tel: '329 012 3456', asesor: 'Camila Torres', pedidos: 30, estado: 'Activo', nit: '890.220.012-4', cupoTotal: 5500000, cupoUsado: 3900000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-021', nombre: 'Textiles Bogotá', ciudad: 'Bogotá', tel: '330 123 4567', asesor: 'Pedro Gómez', pedidos: 23, estado: 'Inactivo', nit: '890.230.345-7', cupoTotal: 3900000, cupoUsado: 3500000, deudaVencida: 0, isTrustedCustomer: false },
  { id: 'CL-022', nombre: 'Boutique Nueva', ciudad: 'Barranquilla', tel: '331 234 5678', asesor: 'María Ruiz', pedidos: 11, estado: 'Activo', nit: '890.240.678-0', cupoTotal: 2700000, cupoUsado: 2300000, deudaVencida: 0, isTrustedCustomer: false },
];

const seedPedidos: Pedido[] = [
  { id: '#PD-2401', cliente: 'Almacén El Sol', asesor: 'Camila Torres', fecha: '08 Jun 2026', items: 24, total: '$2.480.000', estado: 'En producción', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 10 },
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 4 },
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 6 },
  ]},
  { id: '#PD-2400', cliente: 'Boutique Moda+', asesor: 'Luis Herrera', fecha: '07 Jun 2026', items: 8, total: '$980.000', estado: 'Listo', prioridad: 'Prioritario', observaciones: 'Entregar antes de las 2pm', itemsList: [
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 3 },
    { nombre: 'Sudadera con Capucha', precio: 92000, cantidad: 2 },
  ]},
  { id: '#PD-2399', cliente: 'Textiles Andina', asesor: 'Camila Torres', fecha: '06 Jun 2026', items: 15, total: '$1.870.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: 'Entrega completada', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 15 },
  ]},
  { id: '#PD-2398', cliente: 'Moda Casual SAS', asesor: 'Pedro Gómez', fecha: '05 Jun 2026', items: 12, total: '$1.240.000', estado: 'Nuevo', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 8 },
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 2 },
  ]},
  { id: '#PD-2397', cliente: 'La Tienda Norte', asesor: 'Camila Torres', fecha: '04 Jun 2026', items: 20, total: '$2.100.000', estado: 'Despachado', prioridad: 'Prioritario', observaciones: 'En camino', itemsList: [
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 10 },
    { nombre: 'Sudadera con Capucha', precio: 92000, cantidad: 5 },
  ]},
  { id: '#PD-2396', cliente: 'Confección del Valle', asesor: 'Luis Herrera', fecha: '03 Jun 2026', items: 8, total: '$890.000', estado: 'En camino', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 8 },
  ]},
  { id: '#PD-2395', cliente: 'Telas Premium', asesor: 'Pedro Gómez', fecha: '02 Jun 2026', items: 18, total: '$1.650.000', estado: 'Cancelado', prioridad: 'Estándar', observaciones: 'Cancelado por cliente', itemsList: [
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 6 },
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 5 },
  ]},
  { id: '#PD-2394', cliente: 'Moda Express', asesor: 'María Ruiz', fecha: '01 Jun 2026', items: 14, total: '$1.320.000', estado: 'Entregado', prioridad: 'Prioritario', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 12 },
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 2 },
  ]},
  { id: '#PD-2393', cliente: 'Boutique La Luna', asesor: 'Camila Torres', fecha: '31 May 2026', items: 9, total: '$1.050.000', estado: 'En producción', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 9 },
  ]},
  { id: '#PD-2392', cliente: 'Textiles del Caribe', asesor: 'Luis Herrera', fecha: '30 May 2026', items: 16, total: '$1.480.000', estado: 'Listo', prioridad: 'Prioritario', observaciones: '', itemsList: [
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 4 },
    { nombre: 'Sudadera con Capucha', precio: 92000, cantidad: 4 },
  ]},
  { id: '#PD-2391', cliente: 'Ropa Urbana', asesor: 'Pedro Gómez', fecha: '29 May 2026', items: 7, total: '$720.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 7 },
  ]},
  { id: '#PD-2390', cliente: 'Moda Fina', asesor: 'María Ruiz', fecha: '28 May 2026', items: 11, total: '$920.000', estado: 'Nuevo', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 6 },
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 5 },
  ]},
  { id: '#PD-2389', cliente: 'Almacén y Más', asesor: 'Camila Torres', fecha: '27 May 2026', items: 22, total: '$2.800.000', estado: 'Despachado', prioridad: 'Prioritario', observaciones: 'Urgente', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 20 },
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 2 },
  ]},
  { id: '#PD-2388', cliente: 'Boutique Elegante', asesor: 'Luis Herrera', fecha: '26 May 2026', items: 5, total: '$480.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 5 },
  ]},
  { id: '#PD-2387', cliente: 'Textiles Norteños', asesor: 'Pedro Gómez', fecha: '25 May 2026', items: 13, total: '$1.420.000', estado: 'En producción', prioridad: 'Prioritario', observaciones: '', itemsList: [
    { nombre: 'Sudadera con Capucha', precio: 92000, cantidad: 5 },
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 8 },
  ]},
  { id: '#PD-2386', cliente: 'Moda Actual', asesor: 'Camila Torres', fecha: '24 May 2026', items: 17, total: '$1.980.000', estado: 'Listo', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 12 },
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 5 },
  ]},
  { id: '#PD-2385', cliente: 'Boutique Central', asesor: 'María Ruiz', fecha: '23 May 2026', items: 6, total: '$560.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 6 },
  ]},
  { id: '#PD-2384', cliente: 'Telas del Sur', asesor: 'Pedro Gómez', fecha: '22 May 2026', items: 19, total: '$2.250.000', estado: 'En camino', prioridad: 'Prioritario', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 15 },
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 4 },
  ]},
  { id: '#PD-2383', cliente: 'Confección Express', asesor: 'Luis Herrera', fecha: '21 May 2026', items: 10, total: '$890.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Vestido Casual Mujer', precio: 65000, cantidad: 10 },
  ]},
  { id: '#PD-2382', cliente: 'Moda Joven', asesor: 'Camila Torres', fecha: '20 May 2026', items: 14, total: '$1.320.000', estado: 'Cancelado', prioridad: 'Estándar', observaciones: 'Sin stock', itemsList: [
    { nombre: 'Sudadera con Capucha', precio: 92000, cantidad: 14 },
  ]},
  { id: '#PD-2381', cliente: 'Textiles Bogotá', asesor: 'Pedro Gómez', fecha: '19 May 2026', items: 16, total: '$1.740.000', estado: 'Entregado', prioridad: 'Estándar', observaciones: '', itemsList: [
    { nombre: 'Camiseta Básica Hombre', precio: 28000, cantidad: 10 },
    { nombre: 'Blusa Campesina Mujer', precio: 42000, cantidad: 6 },
  ]},
  { id: '#PD-2380', cliente: 'Boutique Nueva', asesor: 'María Ruiz', fecha: '18 May 2026', items: 8, total: '$820.000', estado: 'En producción', prioridad: 'Prioritario', observaciones: '', itemsList: [
    { nombre: 'Pantalón Cargo Hombre', precio: 78000, cantidad: 8 },
  ]},
];

const seedProduccion: OrdenProduccion[] = [
  { id: 'OP-001', pedido: '#PD-2401', operario: 'Juan Pérez', referencia: 'CAM-001', cantidad: 50, fechaInicio: '05 Jun', fechaEstimada: '10 Jun', avance: 65, estado: 'En proceso', tela: 'Algodón 180gr', colores: ['Blanco', 'Negro'], curvaTallas: { s: 10, m: 20, l: 15, xl: 5 }, notasTecnicas: 'Acabado en prensa a 180°C' },
  { id: 'OP-002', pedido: '#PD-2400', operario: 'María López', referencia: 'CAM-002', cantidad: 30, fechaInicio: '04 Jun', fechaEstimada: '09 Jun', avance: 100, estado: 'Terminado', tela: 'Lino', colores: ['Beige'], curvaTallas: { s: 8, m: 12, l: 7, xl: 3 }, notasTecnicas: 'Planchado a vapor obligatorio' },
  { id: 'OP-003', pedido: '#PD-2399', operario: 'Carlos Ruiz', referencia: 'BLU-003', cantidad: 25, fechaInicio: '03 Jun', fechaEstimada: '08 Jun', avance: 40, estado: 'En proceso', tela: 'Lino', colores: ['Terracota'], curvaTallas: { s: 5, m: 8, l: 7, xl: 5 }, notasTecnicas: 'Corte laser en mangas' },
  { id: 'OP-004', pedido: '#PD-2398', operario: 'Ana Martínez', referencia: 'PED-004', cantidad: 45, fechaInicio: '02 Jun', fechaEstimada: '07 Jun', avance: 85, estado: 'En proceso', tela: 'Denim 12oz', colores: ['Azul'], curvaTallas: { s: 12, m: 15, l: 10, xl: 8 }, notasTecnicas: '' },
  { id: 'OP-005', pedido: '#PD-2397', operario: 'Juan Pérez', referencia: 'CAM-005', cantidad: 60, fechaInicio: '01 Jun', fechaEstimada: '06 Jun', avance: 100, estado: 'Terminado', tela: 'Fleece', colores: ['Gris', 'Navy'], curvaTallas: { s: 15, m: 20, l: 15, xl: 10 }, notasTecnicas: 'Listo para despacho' },
  { id: 'OP-006', pedido: '#PD-2396', operario: 'María López', referencia: 'CAM-006', cantidad: 40, fechaInicio: '31 May', fechaEstimada: '05 Jun', avance: 20, estado: 'Pendiente', tela: 'Algodón 180gr', colores: ['Blanco'], curvaTallas: { s: 8, m: 12, l: 10, xl: 10 }, notasTecnicas: 'Esperando tela' },
  { id: 'OP-007', pedido: '#PD-2393', operario: 'Roberto Díaz', referencia: 'BLU-007', cantidad: 35, fechaInicio: '30 May', fechaEstimada: '04 Jun', avance: 70, estado: 'En proceso', tela: 'Lino', colores: ['Beige', 'Terracota'], curvaTallas: { s: 10, m: 12, l: 8, xl: 5 }, notasTecnicas: 'Acabado doble costura' },
  { id: 'OP-008', pedido: '#PD-2389', operario: 'Juan Pérez', referencia: 'PED-008', cantidad: 55, fechaInicio: '29 May', fechaEstimada: '04 Jun', avance: 95, estado: 'En proceso', tela: 'Denim 12oz', colores: ['Negro'], curvaTallas: { s: 15, m: 18, l: 12, xl: 10 }, notasTecnicas: '' },
  { id: 'OP-009', pedido: '#PD-2384', operario: 'Ana Martínez', referencia: 'CAM-009', cantidad: 28, fechaInicio: '28 May', fechaEstimada: '03 Jun', avance: 30, estado: 'Pendiente', tela: 'Viscosa', colores: ['Verde'], curvaTallas: { s: 6, m: 8, l: 8, xl: 6 }, notasTecnicas: 'Prioridad media' },
  { id: 'OP-010', pedido: '#PD-2380', operario: 'Carlos Ruiz', referencia: 'PED-010', cantidad: 32, fechaInicio: '27 May', fechaEstimada: '02 Jun', avance: 100, estado: 'Terminado', tela: 'Algodón orgánico', colores: ['Natural'], curvaTallas: { s: 8, m: 10, l: 8, xl: 6 }, notasTecnicas: 'Control de calidad completado' },
  { id: 'OP-011', pedido: '#PD-2394', operario: 'María López', referencia: 'PED-011', cantidad: 42, fechaInicio: '26 May', fechaEstimada: '01 Jun', avance: 55, estado: 'En proceso', tela: 'Denim 12oz', colores: ['Azul', 'Negro'], curvaTallas: { s: 12, m: 14, l: 10, xl: 6 }, notasTecnicas: '' },
  { id: 'OP-012', pedido: '#PD-2390', operario: 'Roberto Díaz', referencia: 'CAM-012', cantidad: 28, fechaInicio: '25 May', fechaEstimada: '30 May', avance: 100, estado: 'Terminado', tela: 'Algodón 180gr', colores: ['Gris'], curvaTallas: { s: 8, m: 10, l: 6, xl: 4 }, notasTecnicas: 'Listo' },
];

const seedNotificaciones: Notificacion[] = [
  { id: 'N-001', tipo: 'info', titulo: 'Bienvenido', mensaje: 'Sistema SurtiTelas inicializado', leida: false, createdAt: Date.now() },
];

const seedProveedores: Proveedor[] = [
  { id: 'PRV-001', nombre: 'Textiles Colombia SAS', nit: '830.045.123-4', telefono: '(601) 234 5678', email: 'ventas@textilescolombia.com', direccion: 'Calle 12 # 34-56', ciudad: 'Bogotá', materiales: ['Algodón 180gr', 'Algodón 240gr'], estado: 'Activo', calificacion: 4.5, pedidosRealizados: 23, ultimoPedido: '08 Jun 2026' },
  { id: 'PRV-002', nombre: 'Linos del Caribe', nit: '890.123.456-7', telefono: '(605) 345 6789', email: 'contacto@linosdelcaribe.com', direccion: 'Carrera 45 # 67-89', ciudad: 'Barranquilla', materiales: ['Lino', 'Lino fino'], estado: 'Activo', calificacion: 4.8, pedidosRealizados: 18, ultimoPedido: '05 Jun 2026' },
  { id: 'PRV-003', nombre: 'Denim Factory', nit: '900.234.567-8', telefono: '(4) 456 7890', email: 'pedidos@denimfactory.com', direccion: 'Av. El Poblado # 12-34', ciudad: 'Medellín', materiales: ['Denim 12oz', 'Denim 14oz', 'Stretch'], estado: 'Activo', calificacion: 4.2, pedidosRealizados: 15, ultimoPedido: '06 Jun 2026' },
  { id: 'PRV-004', nombre: 'Viscosa Textiles', nit: '890.345.678-9', telefono: '(2) 567 8901', email: 'info@viscosatextiles.com', direccion: 'Calle 78 # 23-45', ciudad: 'Cali', materiales: ['Viscosa', 'Rayón', 'Poliéster'], estado: 'Activo', calificacion: 3.9, pedidosRealizados: 12, ultimoPedido: '03 Jun 2026' },
  { id: 'PRV-005', nombre: 'Fleece Andino', nit: '830.456.789-0', telefono: '(601) 678 9012', email: 'ventas@fleeceandino.com', direccion: 'Carrera 15 # 89-12', ciudad: 'Bogotá', materiales: ['Fleece', 'French Terry'], estado: 'Inactivo', calificacion: 3.5, pedidosRealizados: 8, ultimoPedido: '15 May 2026' },
  { id: 'PRV-006', nombre: 'Tejidos Orgánicos', nit: '900.567.890-1', telefono: '(4) 789 0123', email: 'contacto@tejidosorganicos.com', direccion: 'Calle 34 # 56-78', ciudad: 'Medellín', materiales: ['Algodón orgánico', 'Lino orgánico'], estado: 'Activo', calificacion: 4.7, pedidosRealizados: 20, ultimoPedido: '07 Jun 2026' },
];

/* ──────────────────────────────────────────────
   LOCAL STORAGE HELPERS (persistencia real)
   ────────────────────────────────────────────── */
const STORAGE_KEYS = {
  productos: 'surti_productos',
  clientes: 'surti_clientes',
  proveedores: 'surti_proveedores',
  pedidos: 'surti_pedidos',
  produccion: 'surti_produccion',
  inventario: 'surti_inventario',
  notificaciones: 'surti_notificaciones',
} as const;

function loadFromStorage<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seed;
  } catch {
    return seed;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

/* Cargar desde LocalStorage al iniciar */
let _productos = loadFromStorage<Producto>(STORAGE_KEYS.productos, seedProductos);
let _clientes = loadFromStorage<Cliente>(STORAGE_KEYS.clientes, seedClientes);
let _proveedores = loadFromStorage<Proveedor>('surti_proveedores', seedProveedores);
let _pedidos = loadFromStorage<Pedido>(STORAGE_KEYS.pedidos, seedPedidos);
let _produccion = loadFromStorage<OrdenProduccion>(STORAGE_KEYS.produccion, seedProduccion);
let _inventario = loadFromStorage<MovimientoInventario>(STORAGE_KEYS.inventario, []);
let _notificaciones = loadFromStorage<Notificacion>(STORAGE_KEYS.notificaciones, seedNotificaciones);

/* ──────────────────────────────────────────────
   ID GENERATORS  (para REF secuenciales)
   ────────────────────────────────────────────── */
function nextRef(list: Producto[]): string {
  const max = list.reduce((a, p) => {
    const n = parseInt(p.ref.replace('REF-', ''), 10);
    return Number.isNaN(n) ? a : Math.max(a, n);
  }, 0);
  return `REF-${String(max + 1).padStart(3, '0')}`;
}

function nextClienteId(list: Cliente[]): string {
  const max = list.reduce((a, c) => {
    const n = parseInt(c.id.replace('CL-', ''), 10);
    return Number.isNaN(n) ? a : Math.max(a, n);
  }, 0);
  return `CL-${String(max + 1).padStart(3, '0')}`;
}

function nextPedidoId(list: Pedido[]): string {
  const max = list.reduce((a, p) => {
    const n = parseInt(p.id.replace('#PD-', ''), 10);
    return Number.isNaN(n) ? a : Math.max(n, a);
  }, 2400);
  return `#PD-${String(max + 1)}`;
}

function nextOpId(list: OrdenProduccion[]): string {
  const max = list.reduce((a, o) => {
    const n = parseInt(o.id.replace('OP-', ''), 10);
    return Number.isNaN(n) ? a : Math.max(a, n);
  }, 0);
  return `OP-${String(max + 1).padStart(3, '0')}`;
}

function nextProveedorId(list: Proveedor[]): string {
  const max = list.reduce((a, p) => {
    const n = parseInt(p.id.replace('PRV-', ''), 10);
    return Number.isNaN(n) ? a : Math.max(a, n);
  }, 0);
  return `PRV-${String(max + 1).padStart(3, '0')}`;
}

/* ──────────────────────────────────────────────
   ZUSTAND STORE
   ────────────────────────────────────────────── */
export interface AppState {
  // datos
  productos: Producto[];
  clientes: Cliente[];
  proveedores: Proveedor[];
  pedidos: Pedido[];
  produccion: OrdenProduccion[];
  inventario: MovimientoInventario[];
  notificaciones: Notificacion[];

// acciones productos
   createProducto: (data: Omit<Producto, 'ref'>) => Producto;
   updateProducto: (ref: string, data: Partial<Producto>) => Producto;
   deleteProducto: (ref: string) => void;
   publishProducto: (ref: string) => boolean;
   unpublishProducto: (ref: string) => void;
   getCatalogProducts: () => Producto[];

   // acciones clientes
  createCliente: (data: Omit<Cliente, 'id' | 'pedidos'>) => Cliente;
  updateCliente: (id: string, data: Partial<Cliente>) => Cliente;
  deleteCliente: (id: string) => void;

  // acciones proveedores
  createProveedor: (data: Omit<Proveedor, 'id'>) => Proveedor;
  updateProveedor: (id: string, data: Partial<Proveedor>) => Proveedor;
  deleteProveedor: (id: string) => void;

  // acciones pedidos
  createPedido: (data: Omit<Pedido, 'id'>) => Pedido;
  updatePedido: (id: string, data: Partial<Pedido>) => Pedido;
  deletePedido: (id: string) => void;

  // acciones producción
  createOrden: (data: Omit<OrdenProduccion, 'id'>) => OrdenProduccion;
  updateOrden: (id: string, data: Partial<OrdenProduccion>) => OrdenProduccion;
  deleteOrden: (id: string) => void;

  // inventario
  addMovimiento: (mov: Omit<MovimientoInventario, 'id' | 'fecha'>) => MovimientoInventario;
  getMovimientosPorProducto: (ref: string) => MovimientoInventario[];

  // notificaciones
  addNotificacion: (n: Omit<Notificacion, 'id' | 'createdAt' | 'leida'>) => Notificacion;
  marcarNotificacionLeida: (id: string) => void;
  marcarTodasLeidas: () => void;

  // métricas dashboard
  getMetricas: () => {
    totalVentas: number;
    totalPedidos: number;
    totalClientes: number;
    totalProductos: number;
    stockBajo: number;
    productosAgotados: number;
    ingresosTotales: number;
  };
}

export const useAppStore = create<AppState>((_set, _get) => ({
  productos: _productos,
  clientes: _clientes,
  proveedores: _proveedores,
  pedidos: _pedidos,
  produccion: _produccion,
  inventario: _inventario,
  notificaciones: _notificaciones,

  createProducto: (data) => {
    const productos = _get().productos;
    const ref = nextRef(productos);
    const codigo = `PROD-${String(productos.length + 1).padStart(3, '0')}`;
    const base = data as Omit<Producto, 'ref'>;
    const nueva: Producto = {
      ref,
      codigo: base.codigo || codigo,
      nombre: base.nombre,
      descripcion: base.descripcion || '',
      descripcionCorta: base.descripcionCorta || base.descripcion || base.nombre || 'Sin descripción',
      categoria: base.categoria || 'General',
      subcategoria: base.subcategoria || '',
      marca: base.marca || 'SurtiTelas',
      precio: base.precio,
      precioAnterior: base.precioAnterior || 0,
      descuento: base.descuento || 0,
      stock: base.stock,
      cantidadStock: base.cantidadStock,
      estado: base.estado || 'Activo',
      imagenes: base.imagenes,
      imagenPrincipal: base.imagenPrincipal || (base.imagenes && base.imagenes[0]) || '',
      publicado: false,
      fechaPublicacion: undefined,
      destacado: base.destacado || false,
      oferta: base.oferta || false,
      nuevo: base.nuevo || false,
      masVendido: base.masVendido || false,
      tela: base.tela,
      colores: base.colores,
      tallas: base.tallas,
    };
    const nuevos = [...productos, nueva];
    _productos = nuevos;
    saveToStorage(STORAGE_KEYS.productos, nuevos);
    _set({ productos: nuevos });
    return nueva;
  },

  updateProducto: (ref, data) => {
    const productos = _get().productos;
    const idx = productos.findIndex(p => p.ref === ref);
    if (idx === -1) throw new Error('Producto no encontrado');
    const actualizado = { ...productos[idx], ...data };
    const nuevos = [...productos];
    nuevos[idx] = actualizado;
    _productos = nuevos;
    saveToStorage(STORAGE_KEYS.productos, nuevos);
    _set({ productos: nuevos });
    return actualizado;
  },

  deleteProducto: (ref) => {
    const productos = _get().productos.filter(p => p.ref !== ref);
    _productos = productos;
    saveToStorage(STORAGE_KEYS.productos, productos);
    _set({ productos });
  },

  publishProducto: (ref) => {
    const productos = _get().productos;
    const idx = productos.findIndex(p => p.ref === ref);
    if (idx === -1) return false;

    const product = productos[idx];
    const hasRequiredFields = product.nombre?.trim() !== '' && product.categoria?.trim() !== '' && product.precio > 0 && ((product.imagenPrincipal && product.imagenPrincipal.trim() !== '') || (product.imagenes && product.imagenes.length > 0));
    if (!hasRequiredFields) return false;

    const publicados = [...productos];
    const now = new Date().toISOString();
    publicados[idx] = {
      ...product,
      publicado: true,
      fechaPublicacion: product.fechaPublicacion || now,
    };
    _productos = publicados;
    saveToStorage(STORAGE_KEYS.productos, publicados);
    _set({ productos: publicados });

    useAppStore.getState().addNotificacion({
      tipo: 'success',
      titulo: 'Producto publicado',
      mensaje: `${product.nombre} ahora está visible en el Catálogo Digital`,
    });

    return true;
  },

  unpublishProducto: (ref) => {
    const productos = _get().productos;
    const idx = productos.findIndex(p => p.ref === ref);
    if (idx === -1) return;

    const product = productos[idx];
    const actualizados = [...productos];
    actualizados[idx] = { ...product, publicado: false };
    _productos = actualizados;
    saveToStorage(STORAGE_KEYS.productos, actualizados);
    _set({ productos: actualizados });
  },

  getCatalogProducts: () => {
    return _get().productos.filter(p => p.publicado && p.stock !== 'Agotado');
  },

  createCliente: (data) => {
    const clientes = _get().clientes;
    const nuevo: Cliente = { ...data, id: nextClienteId(clientes), pedidos: 0, isTrustedCustomer: false };
    const nuevos = [...clientes, nuevo];
    _clientes = nuevos;
    saveToStorage(STORAGE_KEYS.clientes, nuevos);
    _set({ clientes: nuevos });
    return nuevo;
  },

  updateCliente: (id, data) => {
    const clientes = _get().clientes;
    const idx = clientes.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Cliente no encontrado');
    const actualizado = { ...clientes[idx], ...data };
    const nuevos = [...clientes];
    nuevos[idx] = actualizado;
    _clientes = nuevos;
    saveToStorage(STORAGE_KEYS.clientes, nuevos);
    _set({ clientes: nuevos });
    return actualizado;
  },

  deleteCliente: (id) => {
    const clientes = _get().clientes.filter(c => c.id !== id);
    _clientes = clientes;
    saveToStorage(STORAGE_KEYS.clientes, clientes);
    _set({ clientes });
  },

  createProveedor: (data) => {
    const proveedores = _get().proveedores;
    const nuevo: Proveedor = { ...data, id: nextProveedorId(proveedores), pedidosRealizados: 0 };
    const nuevos = [...proveedores, nuevo];
    _proveedores = nuevos;
    saveToStorage('surti_proveedores', nuevos);
    _set({ proveedores: nuevos });
    return nuevo;
  },

  updateProveedor: (id, data) => {
    const proveedores = _get().proveedores;
    const idx = proveedores.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Proveedor no encontrado');
    const actualizado = { ...proveedores[idx], ...data };
    const nuevos = [...proveedores];
    nuevos[idx] = actualizado;
    _proveedores = nuevos;
    saveToStorage('surti_proveedores', nuevos);
    _set({ proveedores: nuevos });
    return actualizado;
  },

  deleteProveedor: (id) => {
    const proveedores = _get().proveedores.filter(p => p.id !== id);
    _proveedores = proveedores;
    saveToStorage('surti_proveedores', proveedores);
    _set({ proveedores });
  },

  createPedido: (data) => {
    const pedidos = _get().pedidos;
    const nuevo: Pedido = { ...data, id: nextPedidoId(pedidos) };
    const nuevos = [nuevo, ...pedidos];
    _pedidos = nuevos;
    saveToStorage(STORAGE_KEYS.pedidos, nuevos);
    _set({ pedidos: nuevos });
    return nuevo;
  },

  updatePedido: (id, data) => {
    const pedidos = _get().pedidos;
    const idx = pedidos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Pedido no encontrado');
    const actualizado = { ...pedidos[idx], ...data };
    const nuevos = [...pedidos];
    nuevos[idx] = actualizado;
    _pedidos = nuevos;
    saveToStorage(STORAGE_KEYS.pedidos, nuevos);
    _set({ pedidos: nuevos });
    return actualizado;
  },

  deletePedido: (id) => {
    const pedidos = _get().pedidos.filter(p => p.id !== id);
    _pedidos = pedidos;
    saveToStorage(STORAGE_KEYS.pedidos, pedidos);
    _set({ pedidos });
  },

  createOrden: (data) => {
    const ordenes = _get().produccion;
    const nueva: OrdenProduccion = { ...data, id: nextOpId(ordenes) };
    const nuevas = [nueva, ...ordenes];
    _produccion = nuevas;
    saveToStorage(STORAGE_KEYS.produccion, nuevas);
    _set({ produccion: nuevas });
    return nueva;
  },

  updateOrden: (id, data) => {
    const ordenes = _get().produccion;
    const idx = ordenes.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Orden no encontrada');
    const actualizada = { ...ordenes[idx], ...data };
    const nuevas = [...ordenes];
    nuevas[idx] = actualizada;
    _produccion = nuevas;
    saveToStorage(STORAGE_KEYS.produccion, nuevas);
    _set({ produccion: nuevas });
    return actualizada;
  },

  deleteOrden: (id) => {
    const ordenes = _get().produccion.filter(o => o.id !== id);
    _produccion = ordenes;
    saveToStorage(STORAGE_KEYS.produccion, ordenes);
    _set({ produccion: ordenes });
  },

  addMovimiento: (mov) => {
    const movs = _get().inventario;
    const nuevo: MovimientoInventario = {
      ...mov,
      id: `MOV-${String(movs.length + 1).padStart(4, '0')}`,
      fecha: new Date().toISOString(),
    };
    const nuevos = [...movs, nuevo];
    _inventario = nuevos;
    saveToStorage(STORAGE_KEYS.inventario, nuevos);

    // Descontar/agregar stock automáticamente
    const productos = _get().productos;
    const idx = productos.findIndex(p => p.ref === mov.productoRef || p.nombre === mov.productoRef);
    if (idx !== -1) {
      const delta = mov.tipo === 'entrada' ? mov.cantidad : mov.tipo === 'salida' ? -mov.cantidad : (mov.ajuste || 0);
      const nuevoStock = Math.max(0, (productos[idx].cantidadStock || 0) + delta);
      const nuevoEstado: Producto['stock'] = nuevoStock === 0 ? 'Agotado' : nuevoStock <= 10 ? 'Bajo stock' : 'OK';
      const prodActualizados = [...productos];
      prodActualizados[idx] = { ...productos[idx], cantidadStock: nuevoStock, stock: nuevoEstado };
      _productos = prodActualizados;
      saveToStorage(STORAGE_KEYS.productos, prodActualizados);
      _set({ productos: prodActualizados });
    }
    return nuevo;
  },

  getMovimientosPorProducto: (ref) => _get().inventario.filter(m => m.productoRef === ref),

  addNotificacion: (n) => {
    const notifs = _get().notificaciones;
    const nueva: Notificacion = {
      ...n,
      id: `N-${String(notifs.length + 1).padStart(3, '0')}`,
      createdAt: Date.now(),
      leida: false,
    };
    const nuevas = [nueva, ...notifs];
    _notificaciones = nuevas;
    saveToStorage(STORAGE_KEYS.notificaciones, nuevas);
    _set({ notificaciones: nuevas });
    return nueva;
  },

  marcarNotificacionLeida: (id) => {
    const notifs = _get().notificaciones.map(n => n.id === id ? { ...n, leida: true } : n);
    _notificaciones = notifs;
    saveToStorage(STORAGE_KEYS.notificaciones, notifs);
    _set({ notificaciones: notifs });
  },

  marcarTodasLeidas: () => {
    const notifs = _get().notificaciones.map(n => ({ ...n, leida: true }));
    _notificaciones = notifs;
    saveToStorage(STORAGE_KEYS.notificaciones, notifs);
    _set({ notificaciones: notifs });
  },

  getMetricas: () => {
    const { productos, pedidos, clientes } = _get();
    const ingresos = pedidos
      .filter(p => p.estado === 'Entregado')
      .reduce((sum, p) => sum + (parseInt(p.total.replace(/[^0-9]/g, ''), 10) || 0), 0);

    return {
      totalVentas: pedidos.filter(p => p.estado === 'Entregado').length,
      totalPedidos: pedidos.length,
      totalClientes: clientes.length,
      totalProductos: productos.length,
      stockBajo: productos.filter(p => p.stock === 'Bajo stock').length,
      productosAgotados: productos.filter(p => p.stock === 'Agotado').length,
      ingresosTotales: ingresos,
    };
  },
}));

/* ──────────────────────────────────────────────
   REACT HOOKS — suscripción automática
   ────────────────────────────────────────────── */
export function useProductos() {
  const productos = useAppStore(s => s.productos);
  return {
    productos,
    createProducto: useAppStore(s => s.createProducto),
    updateProducto: useAppStore(s => s.updateProducto),
    deleteProducto: useAppStore(s => s.deleteProducto),
    publishProducto: useAppStore(s => s.publishProducto),
    unpublishProducto: useAppStore(s => s.unpublishProducto),
    getCatalogProducts: useAppStore(s => s.getCatalogProducts),
  };
}

export function useClientes() {
  const clientes = useAppStore(s => s.clientes);
  return {
    clientes,
    createCliente: useAppStore(s => s.createCliente),
    updateCliente: useAppStore(s => s.updateCliente),
    deleteCliente: useAppStore(s => s.deleteCliente),
  };
}

export function useProveedores() {
  const proveedores = useAppStore(s => s.proveedores);
  return {
    proveedores,
    createProveedor: useAppStore(s => s.createProveedor),
    updateProveedor: useAppStore(s => s.updateProveedor),
    deleteProveedor: useAppStore(s => s.deleteProveedor),
  };
}

export function usePedidos() {
  const pedidos = useAppStore(s => s.pedidos);
  return {
    pedidos,
    createPedido: useAppStore(s => s.createPedido),
    updatePedido: useAppStore(s => s.updatePedido),
    deletePedido: useAppStore(s => s.deletePedido),
  };
}

export function useProduccion() {
  const produccion = useAppStore(s => s.produccion);
  return {
    ordenes: produccion,
    createOrden: useAppStore(s => s.createOrden),
    updateOrden: useAppStore(s => s.updateOrden),
    deleteOrden: useAppStore(s => s.deleteOrden),
  };
}

export function useNotificaciones() {
  const notificaciones = useAppStore(s => s.notificaciones);
  const noLeidas = notificaciones.filter(n => !n.leida).length;
  return {
    notificaciones,
    noLeidas,
    addNotificacion: useAppStore(s => s.addNotificacion),
    marcarLeida: useAppStore(s => s.marcarNotificacionLeida),
    marcarTodasLeidas: useAppStore(s => s.marcarTodasLeidas),
  };
}

export function useMetricas() {
  return useAppStore(s => s.getMetricas());
}

export function useInventario() {
  const inventario = useAppStore(s => s.inventario);
  return {
    movimientos: inventario,
    addMovimiento: useAppStore(s => s.addMovimiento),
    getMovimientosPorProducto: useAppStore(s => s.getMovimientosPorProducto),
  };
}
