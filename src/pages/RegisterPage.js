import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { IconUserPlus, IconCheck, IconAlert } from "../components/Icons";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    email: "",
    password: "",
    telefono: "",
    tipo_usuario: "cliente",
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        edad: parseInt(formData.edad, 10) || 18,
      };

      const res = await registerUser(payload);
      setMessage(res?.message || "Usuario registrado con éxito. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px", margin: "30px auto 0 auto" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="icon-box icon-box-cyan" style={{ margin: "0 auto 12px auto" }}>
            <IconUserPlus size={24} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>Registro de Usuario</h1>
          <p style={{ margin: 0 }}>Crea tu cuenta para comenzar a reservar clases en CycleFlow</p>
        </div>

        {message && (
          <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
            {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Nombre(s) *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan"
                required
              />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ej. Pérez"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Edad (12 - 120) *</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="Ej. 25"
                min="12"
                max="120"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. 555-123-4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico *</label>
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
            <label>Contraseña (mínimo 6 caracteres) *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña segura"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Usuario</label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
            >
              <option value="cliente">Cliente (Alumno de spinning)</option>
              <option value="secretaria">Secretaría (Administración)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "10px", padding: "12px" }}
          >
            {loading ? "Creando cuenta..." : "Completar Registro"}
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-color)",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)"
        }}>
          ¿Ya tienes cuenta registrada?{" "}
          <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
