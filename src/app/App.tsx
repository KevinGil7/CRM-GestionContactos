import '../App.css'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home} from './pages';
import { useEffect } from 'react';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRouter';
import Login from '../@auth/services/pages/Login';
import ContactoAll from './features/contactos/pages/ContactoAll';
import ContactoDetalle from './features/contactos/pages/ContactoDetalle';
import CrearContacto from './features/contactos/pages/CrearContacto';
import Inicio from './pages/Inicio';
import ProveedorAll from './features/provedores/pages/ProveedorAll';
import ProveedorDetalle from './features/provedores/pages/ProveedorDetalle';
import CrearProveedor from './features/provedores/pages/CrearProveedor';
import { Toaster } from "react-hot-toast";
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';
import CrearCliente from './features/clientes/pages/CrearCliente';
import ClienteAll from './features/clientes/pages/ClienteAll';
import ClienteDetalle from './features/clientes/pages/ClienteDetalle';
import InteraccionAll from './features/interaccion/pages/interaccionall';
import InteraccionDetalle from './features/interaccion/pages/InteraccionDetalle';
import CrearInteraccion from './features/interaccion/pages/crearinteraccion';



function AppRoutes() {
  const location = useLocation();
  const { authState } = useAuth();
  
  const isAuthenticated = authState?.isAuthenticated || false;
  const authStatus = authState?.authStatus || 'unauthenticated';

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      document.documentElement.className = 'h-full login-bg'; // fondo para login
    } else {
      document.documentElement.className = ''; // limpio para home u otras
    }
  }, [location]);

  // Show loading while authentication is being determined
  if (authStatus === 'configuring') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Login />
        } 
      />
      <Route path="/home" element={
        <PrivateRoute>
          <Layout hideSidebar={location.pathname === '/home' || location.pathname === '/home/'} />
        </PrivateRoute>
        }>
        <Route index element={<Inicio />} />
        <Route path="contactos" element={<ContactoAll />} />
        <Route path="contactos/crear" element={<CrearContacto />} />
        <Route path="contactos/:id" element={<ContactoDetalle />} />
        <Route path="proveedores" element={<ProveedorAll />} />
        <Route path="proveedores/:id" element={<ProveedorDetalle />} />
        <Route path="proveedores/crear" element={<CrearProveedor />} />
        <Route path="clientes" element={<ClienteAll />} />
        <Route path="clientes/crear" element={<CrearCliente />} />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="interaccion" element={<InteraccionAll />} />
        <Route path="interaccion/crear" element={<CrearInteraccion />} />
        <Route path="interaccion/:id" element={<InteraccionDetalle />} />
      </Route>
      {/* Catch all route - redirect to home if authenticated, otherwise to login */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/home" : "/"} replace />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}

export default App;
