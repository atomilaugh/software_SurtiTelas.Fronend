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
import { AdminPedidos } from '@/presentation/pages/admin/Pedidos';
import { AdminProduccion } from '@/presentation/pages/admin/Produccion';
import { AdminInventario } from '@/presentation/pages/admin/Inventario';
import { AdminAsesores } from '@/presentation/pages/admin/AdminAsesores';
import { AdminReportes } from '@/presentation/pages/admin/AdminReportes';
import { AdminConfiguracion } from '@/presentation/pages/admin/AdminConfiguracion';
import { AdminDomicilios } from '@/presentation/pages/admin/AdminDomicilios';
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

// PUBLIC
import HomePage from '@/presentation/pages/public/HomePage';
import CatalogPage from '@/presentation/pages/features/CatalogPage';
import CartPage from '@/presentation/pages/features/CartPage';
import ContactPage from '@/presentation/pages/features/ContactPage';
import AboutPage from '@/presentation/pages/public/AboutPage';

// AUTH
import LoginPage from '@/presentation/pages/auth/LoginPage';
import RegisterPage from '@/presentation/pages/auth/RegisterPage';

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

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* ADMIN - Protected routes for admin role */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produccion" element={<AdminProduccion />} />
            <Route path="inventario" element={<AdminInventario />} />
            <Route path="domicilios" element={<AdminDomicilios />} />
            <Route path="asesores" element={<AdminAsesores />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="configuracion" element={<AdminConfiguracion />} />
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