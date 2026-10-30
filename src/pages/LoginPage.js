import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconBike, IconAlert } from '../components/Icons';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const user = await loginUser(formData);
      login(user);

      if (user.tipo_usuario === 'cliente') {
        navigate('/cliente/inicio');
      } else if (user.tipo_usuario === 'secretaria' || user.tipo_usuario === 'admin') {
        navigate('/secretaria/inicio');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto 0 auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="icon-box icon-box-cyan" style={{ margin: '0 auto 12px auto' }}>
            <IconBike size={24} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Iniciar Sesión</h1>
          <p style={{ margin: 0 }}>Accede a tu cuenta de CycleFlow</p>
        </div>

        {message && (
          <div className="alert alert-error">
            <IconAlert size={18} color="#fca5a5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Iniciando sesión...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: '#fff' }}>Cuentas de demostración:</strong>
          <br />• Secretaría: <code>secretaria@gimnasio.com</code> / <code>Secretaria123!</code>
          <br />• Cliente: <code>cliente@gimnasio.com</code> / <code>Cliente123!</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
