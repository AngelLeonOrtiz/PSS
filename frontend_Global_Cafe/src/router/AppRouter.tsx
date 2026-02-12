import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

// Auth
import LoginPage from "../pages/auth/LoginPage";

// Dashboard
import DashboardPage from "../pages/dashboard/DashboardPage";

// Módulo 1: Recepción
import RemisionPage from "../pages/recepcion/RemisionPage";
import MuestreoPage from "../pages/recepcion/MuestreoPage";
import LaboratorioPage from "../pages/recepcion/LaboratorioPage";
import BasculaEntradaPage from "../pages/recepcion/BasculaEntradaPage";
import WMSPatioPage from "../pages/recepcion/WMSPatioPage";
import NotaPesoPage from "../pages/recepcion/NotaPesoPage";

// Módulo 2: Comercial
import ContratosPage from "../pages/comercial/ContratosPage";
//import MuestraPreembarquePage from "../pages/comercial/MuestraPreembarquePage";
import LabPreembarquePage from "../pages/comercial/LabPreembarquePage";
import AprobacionPage from "../pages/comercial/AprobacionPage";
import LotesPage from "../pages/comercial/LotesPage";
import InstruccionesEmbarquePage from "../pages/comercial/InstruccionesEmbarquePage";
import InventarioPergaminoPage from "../pages/comercial/InventarioPergaminoPage";

// Módulo 3: Industrial
import ProgramaPage from "../pages/industrial/ProgramaPage";
import OrdenSacosPage from "../pages/industrial/OrdenSacosPage";
import TrillaPage from "../pages/industrial/TrillaPage";
import BalanceMasasPage from "../pages/industrial/BalanceMasasPage";
import ProductoTerminadoPage from "../pages/industrial/ProductoTerminadoPage";
import MermaPage from "../pages/industrial/MermaPage";

// Módulo 4: Despacho
//import ContenedoresPage from "../pages/despacho/ContenedoresPage";
//import OrdenCargaPage from "../pages/despacho/OrdenCargaPage";
import CargaPage from "../pages/despacho/CargaPage";
import BasculaSalidaPage from "../pages/despacho/BasculaSalidaPage";
import DocumentacionPage from "../pages/despacho/DocumentacionPage";

// Módulo 5: Ventas Locales
import KardexPage from "../pages/ventas/KardexPage";
import OrdenVentaPage from "../pages/ventas/OrdenVentaPage";
import BasculaVentaPage from "../pages/ventas/BasculaVentaPage";
import SalidaVentaPage from "../pages/ventas/SalidaVentaPage";

// Administración
import UsuariosPage from "../pages/admin/UsuariosPage";
import RolesPage from "../pages/admin/RolesPage";
import ConfiguracionPage from "../pages/admin/ConfiguracionPage";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta de Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Rutas protegidas */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Módulo 1: Recepción */}
        <Route path="/recepcion/remision" element={<RemisionPage />} />
        <Route path="/recepcion/muestreo" element={<MuestreoPage />} />
        <Route path="/recepcion/laboratorio" element={<LaboratorioPage />} />
        <Route path="/recepcion/bascula-entrada" element={<BasculaEntradaPage />} />
        <Route path="/recepcion/wms-patio" element={<WMSPatioPage />} />
        <Route path="/recepcion/nota-peso" element={<NotaPesoPage />} />

        {/* Módulo 2: Comercial */}
        <Route path="/comercial/contratos" element={<ContratosPage />} />
        {/*<Route path="/comercial/muestra-preembarque" element={<MuestraPreembarquePage />} />*/}
        <Route path="/comercial/lab-preembarque" element={<LabPreembarquePage />} />
        <Route path="/comercial/aprobacion" element={<AprobacionPage />} />
        <Route path="/comercial/lotes" element={<LotesPage />} />
        <Route path="/comercial/instrucciones-embarque" element={<InstruccionesEmbarquePage />} />
        <Route path="/comercial/inventario-pergamino" element={<InventarioPergaminoPage />} />

        {/* Módulo 3: Industrial */}
        <Route path="/industrial/programa" element={<ProgramaPage />} />
        <Route path="/industrial/orden-sacos" element={<OrdenSacosPage />} />
        <Route path="/industrial/trilla" element={<TrillaPage />} />
        <Route path="/industrial/balance-masas" element={<BalanceMasasPage />} />
        <Route path="/industrial/producto-terminado" element={<ProductoTerminadoPage />} />
        <Route path="/industrial/merma" element={<MermaPage />} />

        {/* Módulo 4: Despacho */}
      {/*  <Route path="/despacho/contenedores" element={<ContenedoresPage />} />
        <Route path="/despacho/orden-carga" element={<OrdenCargaPage />} /> */}
        <Route path="/despacho/carga" element={<CargaPage />} />
        <Route path="/despacho/bascula-salida" element={<BasculaSalidaPage />} />
        <Route path="/despacho/documentacion" element={<DocumentacionPage />} />

        {/* Módulo 5: Ventas Locales */}
        <Route path="/ventas/kardex" element={<KardexPage />} />
        <Route path="/ventas/orden-venta" element={<OrdenVentaPage />} />
        <Route path="/ventas/bascula" element={<BasculaVentaPage />} />
        <Route path="/ventas/salida" element={<SalidaVentaPage />} />

        {/* Administración */}
        <Route path="/admin/usuarios" element={<UsuariosPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/configuracion" element={<ConfiguracionPage />} />
      </Route>

      {/* Ruta por defecto - redirigir al dashboard o login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
