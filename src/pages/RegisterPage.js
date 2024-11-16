import React, { useState } from "react";
import { registerUser } from "../api/auth";

const RegisterPage = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setMessage('Usuario registrado con exito');
        } catch (error) {
            setMessage(error.message)
        }
    };

    return(
        <div>
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="nombre"/>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="apellidos"/>
                <input type="text" name="edad" value={formData.edad} onChange={handleChange} placeholder="edad"/>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contrasena" required />
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="telefono"/>
                <input type="text" name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange} placeholder="Tipo de usuario"/>
                <button type='submit'>Registrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterPage;