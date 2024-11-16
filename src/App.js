import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';
// Cliente
import WelcomePageCliente from './pages/clientes/WelcomePage';

// Secretaria
import WelcomePageSecretaria from './pages/secretaria/WelcomePage';
import BicicletasPageSecretaria from './pages/secretaria/BicicletasPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<h1>Bienvenido al Gimnasio</h1>}/>
          <Route path='/registro' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/cliente/inicio' element={<PrivateRoute allowedRole='cliente'><WelcomePageCliente /></PrivateRoute>} />
          <Route path='/secretaria/inicio' element={<PrivateRoute allowedRole='secretaria'><WelcomePageSecretaria /></PrivateRoute>} />
          <Route path='/secretaria/bicicletas' element={<PrivateRoute allowedRole='secretaria'><BicicletasPageSecretaria /></PrivateRoute>}/>
        </Routes>
     </Router>
    </AuthProvider>
  );
}

export default App;
