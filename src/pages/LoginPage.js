import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      login(user);
      
      const token = localStorage.getItem('sessionToken');
      console.log('Token pero desde loginpage',token);
      

      if(user.tipo_usuario === 'cliente'){
        navigate('/cliente/inicio');
      } else if(user.tipo_usuario === 'secretaria'){
        navigate('/secretaria/inicio');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Inicio de Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required
        />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contrasena" required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
