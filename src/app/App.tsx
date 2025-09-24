import '../App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home} from './pages';
import { useEffect } from 'react';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRouter';
import Login from './features/auth/pages/Login';
import ClienteAll from './features/clientes/pages/ClienteAll';
import ClienteDetalle from './features/clientes/pages/ClienteDetalle';
import CrearCliente from './features/clientes/pages/CrearCliente';
import Inicio from './pages/Inicio';
import EmpresaAll from './features/empresas/pages/EmpresaAll';
import EmpresaDetalle from './features/empresas/pages/EmpresaDetalle';
import CrearEmpresa from './features/empresas/pages/CrearEmpresa';
import { Toaster } from "react-hot-toast";



function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      document.documentElement.className = 'h-full bg-gray-900'; // fondo para login
    } else {
      document.documentElement.className = ''; // limpio para home u otras
    }
  }, [location]);

 return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={
        <PrivateRoute>
          <Layout hideSidebar={location.pathname === '/home' || location.pathname === '/home/'} />
        </PrivateRoute>
        }>
        <Route index element={<Inicio />} />
        <Route path="clientes" element={<ClienteAll />} />
        <Route path="clientes/crear" element={<CrearCliente />} />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="empresas" element={<EmpresaAll />} />
        <Route path="empresas/:id" element={<EmpresaDetalle />} />
        <Route path="empresas/crear" element={<CrearEmpresa />} />

      </Route>
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
