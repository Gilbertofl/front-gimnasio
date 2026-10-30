import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';
import { IconBike, IconCard, IconActivity, IconSearch } from './components/Icons';

// Páginas Públicas
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// Páginas para el Rol Cliente
import WelcomePageCliente from './pages/clientes/WelcomePage';
import ReservacionesClientePage from './pages/clientes/ReservacionesClientePage';

// Páginas para el Rol Secretaría y Admin
import WelcomePageSecretaria from './pages/secretaria/WelcomePage';
import BicicletasPageSecretaria from './pages/secretaria/BicicletasPage';
import HorariosPageSecretaria from './pages/secretaria/HorariosPage';
import MembresiasPageSecretaria from './pages/secretaria/MembresiasPage';
import ReservacionesPageSecretaria from './pages/secretaria/ReservacionesPage';
import UsuariosPageSecretaria from './pages/secretaria/UsuariosPage';

// Componente de Landing Page que consume useAuth
function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '36px 0 50px 0' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        color: 'var(--accent-primary)',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '24px'
      }}>
        <IconBike size={16} color="var(--accent-primary)" />
        <span>CycleFlow &bull; Indoor Cycling Studio</span>
      </div>

      <h1 style={{ fontSize: '2.75rem', lineHeight: '1.2', maxWidth: '820px', margin: '0 auto 20px auto', letterSpacing: '-0.02em' }}>
        Control de Clases, Membresías y Bicicletas de Spinning
      </h1>

      <p style={{ maxWidth: '640px', margin: '0 auto 36px auto', fontSize: '1.1rem' }}>
        Plataforma integral para reservar turnos de entrenamiento en tiempo real, administrar inventario de bicicletas y supervisar suscripciones activas.
      </p>

      {/* Botones de acción: si el usuario ya está autenticado, se muestra acceso directo a su panel */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                Iniciar Sesión
              </button>
            </Link>
            <Link to="/registro" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                Crear Cuenta
              </button>
            </Link>
          </>
        ) : user.tipo_usuario === 'cliente' ? (
          <Link to="/cliente/inicio" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Ir a Mi Panel de Alumno
            </button>
          </Link>
        ) : (
          <Link to="/secretaria/inicio" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Ir al Panel de Administración
            </button>
          </Link>
        )}
      </div>

      {/* Tarjetas Principales centradas simétricamente */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '64px',
        textAlign: 'left'
      }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="icon-box icon-box-cyan">
            <IconActivity size={22} color="var(--accent-primary)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Disponibilidad en Vivo</h3>
          <p style={{ margin: 0 }}>
            Consulta en tiempo real qué bicicletas están disponibles en cada turno y aparta tu equipo al instante.
          </p>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div className="icon-box icon-box-emerald">
            <IconCard size={22} color="var(--accent-success)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Control de Membresías</h3>
          <p style={{ margin: 0 }}>
            Validación automática de vigencias para asegurar que solo los clientes activos puedan agendar.
          </p>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div className="icon-box icon-box-amber">
            <IconBike size={22} color="var(--accent-warning)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Historial y Métricas</h3>
          <p style={{ margin: 0 }}>
            Seguimiento detallado de clases concluidas, liberando bicicletas automáticamente al terminar el turno.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="app-container">
          <Routes>
            {/* Portada / Landing */}
            <Route path="/" element={<HomePage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas Cliente */}
            <Route
              path="/cliente/inicio"
              element={
                <PrivateRoute allowedRole="cliente">
                  <WelcomePageCliente />
                </PrivateRoute>
              }
            />
            <Route
              path="/cliente/reservaciones"
              element={
                <PrivateRoute allowedRole="cliente">
                  <ReservacionesClientePage />
                </PrivateRoute>
              }
            />

            {/* Rutas Secretaría / Administración */}
            <Route
              path="/secretaria/inicio"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <WelcomePageSecretaria />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaria/bicicletas"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <BicicletasPageSecretaria />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaria/horarios"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <HorariosPageSecretaria />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaria/membresias"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <MembresiasPageSecretaria />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaria/reservaciones"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <ReservacionesPageSecretaria />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaria/usuarios"
              element={
                <PrivateRoute allowedRoles={['secretaria', 'admin']}>
                  <UsuariosPageSecretaria />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
                  <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                    <IconSearch size={32} color="var(--text-muted)" />
                  </div>
                  <h2>Página no encontrada (404)</h2>
                  <p>La ruta a la que intentas acceder no existe en el sistema.</p>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <button>Volver al Inicio</button>
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
