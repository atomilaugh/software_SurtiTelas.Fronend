import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/presentation/routes/ProtectedRoute';
import Layout from '@/presentation/pages/layouts/Layout';
import ScrollToTop from '@/presentation/components/ScrollToTop';
import { Spinner } from '@/shared/ui';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { AdminLayout } from '@/presentation/pages/admin/AdminLayout';
import { AdminDashboard } from '@/presentation/pages/admin/Dashboard';
import { AdminClientes } from '@/presentation/pages/admin/Clientes';
import { AdminCatalogo } from '@/presentation/pages/admin/AdminCatalogo';
import { AdminPedidos } from '@/presentation/pages/admin/Pedidos';
import { AdminProduccion } from '@/presentation/pages/admin/Produccion';
import { AdminInventario } from '@/presentation/pages/admin/Inventario';
import { AdminAsesores } from '@/presentation/pages/admin/AdminAsesores';
import { AdminReportes } from '@/presentation/pages/admin/AdminReportes';
import { AdminConfiguracion } from '@/presentation/pages/admin/AdminConfiguracion';
import { AdminDomicilios } from '@/presentation/pages/admin/AdminDomicilios';
import { AdminRoles } from '@/presentation/pages/admin/Roles';
import { AdminPermisos } from '@/presentation/pages/admin/Permisos';
import { AdminGestionUsuarios } from '@/presentation/pages/admin/GestionUsuarios';
import { AdminSeguridadUsuarios } from '@/presentation/pages/admin/SeguridadUsuarios';
import { AdminProductosTerminados } from '@/presentation/pages/admin/ProductosTerminados';
import { AdminInsumos } from '@/presentation/pages/admin/Insumos';
import { AdminProveedores } from '@/presentation/pages/admin/Proveedores';
import { AdminGestionAcceso } from '@/presentation/pages/admin/GestionAcceso';
import { AdminAlertasStock } from '@/presentation/pages/admin/AlertasStock';
import { AdminStockDevuelto } from '@/presentation/pages/admin/StockDevuelto';
import { AdminRegistroTalleres } from '@/presentation/pages/admin/RegistroTalleres';
import { AdminControlPrendas } from '@/presentation/pages/admin/ControlPrendas';
import { AdminAsignacionProduccion } from '@/presentation/pages/admin/AsignacionProduccion';
import { AdminSeguimientoProduccion } from '@/presentation/pages/admin/SeguimientoProduccion';
import { AdminRecibos } from '@/presentation/pages/admin/Recibos';
import { AdminPagos } from '@/presentation/pages/admin/Pagos';
import { AdminReportesVentas } from '@/presentation/pages/admin/ReportesVentas';
import { AdminReportesUsuarios } from '@/presentation/pages/admin/ReportesUsuarios';
import { AdminReportesProduccion } from '@/presentation/pages/admin/ReportesProduccion';
import { AdminReportesInventario } from '@/presentation/pages/admin/ReportesInventario';
import { AsesorLayout } from '@/presentation/pages/asesor/AsesorLayout';
import { AsesorDashboard } from '@/presentation/pages/asesor/Dashboard';
import { AsesorClientes } from '@/presentation/pages/asesor/MisClientes';
import { AtencionCliente } from '@/presentation/pages/asesor/Atencion-cliente';
import { AsesorPedidos } from '@/presentation/pages/asesor/Pedidos';
import { AsesorCatalogo } from '@/presentation/pages/asesor/Catalogo';
import { AsesorComisiones } from '@/presentation/pages/asesor/Comisiones';
import { AsesorPerfil } from '@/presentation/pages/asesor/PerfilAsesor';
import { DomiciliarioLayout } from '@/presentation/pages/domiciliario/DomiciliarioLayout';
import { DomiciliarioDashboard } from '@/presentation/pages/domiciliario/Dashboard';
import { DomiciliarioEntregas } from '@/presentation/pages/domiciliario/MisEntregas';
import { RutaDelDia } from '@/presentation/pages/domiciliario/RutaDelDia';
import { DomiciliarioHistorial } from '@/presentation/pages/domiciliario/Historial';
import { DomiciliarioPerfil } from '@/presentation/pages/domiciliario/PerfilDomiciliario';
import { ClienteLayout } from '@/presentation/pages/cliente/ClienteLayout';
import { InicioCliente } from '@/presentation/pages/cliente/InicioCliente';
import { CatalogoCliente } from '@/presentation/pages/cliente/Catalogo';
import { MisPedidos } from '@/presentation/pages/cliente/MisPedidos';
import { PerfilCliente } from '@/presentation/pages/cliente/PerfilCliente';
import { OrderTracking } from '@/presentation/pages/cliente/OrderTracking';
import { Recibos } from '@/presentation/pages/cliente/Recibos';
import { Favoritos } from '@/presentation/pages/cliente/Favoritos';

// PUBLIC
import HomePage from '@/presentation/pages/public/HomePage';
import CatalogPage from '@/presentation/pages/features/CatalogPage';
import CartPage from '@/presentation/pages/features/CartPage';
import ContactPage from '@/presentation/pages/features/ContactPage';
import AboutPage from '@/presentation/pages/public/AboutPage';
import TooltipsDemo from '@/presentation/pages/public/TooltipsDemo';

// AUTH
import LoginPage from '@/presentation/pages/auth/LoginPage';
import RegisterPage from '@/presentation/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/presentation/pages/auth/ForgotPasswordPage';

const ProtectedLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)]">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <ScrollToTop />
    <ErrorBoundary>
      <Suspense fallback={<ProtectedLoader />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/catalogo" element={<Layout><CatalogPage /></Layout>} />
          <Route path="/carrito" element={<Layout><CartPage /></Layout>} />
          <Route path="/contacto" element={<Layout><ContactPage /></Layout>} />
          <Route path="/nosotros" element={<Layout><AboutPage /></Layout>} />
          <Route path="/tooltips" element={<Layout><TooltipsDemo /></Layout>} />

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />

          {/* ADMIN - Protected routes for admin role */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="catalogo" element={<AdminCatalogo />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produccion" element={<AdminProduccion />} />
            <Route path="inventario" element={<AdminInventario />} />
            <Route path="domicilios" element={<AdminDomicilios />} />
            <Route path="asesores" element={<AdminAsesores />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="configuracion" element={<AdminConfiguracion />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="permisos" element={<AdminPermisos />} />
            <Route path="gestion-usuarios" element={<AdminGestionUsuarios />} />
            <Route path="seguridad" element={<AdminSeguridadUsuarios />} />
            <Route path="productos" element={<AdminProductosTerminados />} />
            <Route path="insumos" element={<AdminInsumos />} />
            <Route path="proveedores" element={<AdminProveedores />} />
            <Route path="gestion-acceso" element={<AdminGestionAcceso />} />
            <Route path="alertas-stock" element={<AdminAlertasStock />} />
            <Route path="stock-devuelto" element={<AdminStockDevuelto />} />
            <Route path="talleres" element={<AdminRegistroTalleres />} />
            <Route path="prendas" element={<AdminControlPrendas />} />
            <Route path="asignacion" element={<AdminAsignacionProduccion />} />
            <Route path="seguimiento" element={<AdminSeguimientoProduccion />} />
            <Route path="facturacion" element={<AdminRecibos />} />
            <Route path="pagos" element={<AdminPagos />} />
            <Route path="ventas-pedidos" element={<AdminPedidos />} />
            <Route path="reportes-ventas" element={<AdminReportesVentas />} />
            <Route path="reportes-usuarios" element={<AdminReportesUsuarios />} />
            <Route path="reportes-produccion" element={<AdminReportesProduccion />} />
            <Route path="reportes-inventario" element={<AdminReportesInventario />} />
          </Route>

          {/* ASESOR - Protected routes for asesor role */}
          <Route path="/asesor" element={
            <ProtectedRoute allowedRoles={['asesor']}>
              <AsesorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AsesorDashboard />} />
            <Route path="clientes" element={<AsesorClientes />} />
            <Route path="pedidos" element={<AsesorPedidos />} />
            <Route path="AtencionCliente" element={<AtencionCliente />} />
            <Route path="catalogo" element={<AsesorCatalogo />} />
            <Route path="comisiones" element={<AsesorComisiones />} />
            <Route path="perfil" element={<AsesorPerfil />} />
          </Route>

          {/* DOMICILIARIO - Protected routes for domiciliario role */}
          <Route path="/domiciliario" element={
            <ProtectedRoute allowedRoles={['domiciliario']}>
              <DomiciliarioLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DomiciliarioDashboard />} />
            <Route path="entregas" element={<DomiciliarioEntregas />} />
            <Route path="ruta" element={<RutaDelDia />} />
            <Route path="historial" element={<DomiciliarioHistorial />} />
            <Route path="perfil" element={<DomiciliarioPerfil />} />
          </Route>

          {/* CLIENTE - Protected routes for cliente role */}
          <Route path="/cliente" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <ClienteLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<InicioCliente />} />
            <Route path="catalogo" element={<CatalogoCliente />} />
            <Route path="pedidos" element={<MisPedidos />} />
            <Route path="recibos" element={<Recibos />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="seguimiento" element={<OrderTracking />} />
            <Route path="seguimiento/:orderId" element={<OrderTracking />} />
            <Route path="perfil" element={<PerfilCliente />} />
          </Route>

          {/* REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
    <Toaster position="top-right" richColors />
  </BrowserRouter>
);

export default App;