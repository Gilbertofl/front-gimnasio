import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuario, editarUsuario } from "../../api/usuarios";
import { obtenerMembresiasDeCliente } from "../../api/membresias";
import { IconBike, IconCheck, IconAlert } from "../../components/Icons";

const WelcomePageCliente = () => {
  const { user, updateUser } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [membresias, setMembresias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id_usuario) {
      setLoading(true);
      Promise.all([
        obtenerUsuario(user.id_usuario),
        obtenerMembresiasDeCliente(user.id_usuario),
      ])
        .then(([perfilData, membresiasData]) => {
          setPerfil(perfilData);
          setMembresias(Array.isArray(membresiasData) ? membresiasData : []);
          setFormData({
            nombre: perfilData.nombre || "",
            apellidos: perfilData.apellidos || "",
            edad: perfilData.edad || "",
            email: perfilData.email || "",
            telefono: perfilData.telefono || "",
            password: "",
          });
        })
        .catch((err) => {
          setIsError(true);
          setMessage(err.message || "Error al cargar datos del cliente");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const payload = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        edad: formData.edad ? parseInt(formData.edad, 10) : undefined,
        email: formData.email,
        telefono: formData.telefono,
      };
      if (formData.password && formData.password.trim().length >= 6) {
        payload.password = formData.password.trim();
      }

      const res = await editarUsuario(user.id_usuario, payload);
      setMessage("Tu perfil ha sido actualizado con éxito.");
      setPerfil(res.usuario);
      updateUser(res.usuario);
      setEditMode(false);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Error al actualizar perfil");
    }
  };

  const membresiaActiva = membresias.find((m) => m.esta_vigente || m.estado === "Activa");

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1>Portal del Alumno</h1>
        <p style={{ margin: 0 }}>
          ¡Bienvenido de nuevo, <strong>{user?.nombre} {user?.apellidos}</strong>!
        </p>
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Carnet de Membresía */}
      <div
        className="card"
        style={{
          background: membresiaActiva
            ? "linear-gradient(135deg, #1e293b 0%, #064e3b 100%)"
            : "linear-gradient(135deg, #1e293b 0%, #450a0a 100%)",
          border: `1px solid ${membresiaActiva ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700 }}>
              Membresía CycleFlow
            </span>
            <h2 style={{ margin: "4px 0 10px 0", fontSize: "1.6rem" }}>
              {membresiaActiva ? "Membresía Activa y Vigente" : "Membresía Inactiva / Expirada"}
            </h2>
          </div>
          <span className={`badge ${membresiaActiva ? "badge-activa" : "badge-vencida"}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
            {membresiaActiva ? "Vigente" : "Sin acceso a reservas"}
          </span>
        </div>

        {membresiaActiva ? (
          <div>
            <p style={{ color: "#e2e8f0", margin: "10px 0 16px 0" }}>
              Tienes acceso completo para apartar turnos y bicicletas de spinning.
            </p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "20px" }}>
              <div>
                <small style={{ color: "var(--text-muted)", display: "block" }}>Fecha de inicio:</small>
                <strong>{new Date(membresiaActiva.fecha_inicio).toLocaleDateString()}</strong>
              </div>
              <div>
                <small style={{ color: "var(--text-muted)", display: "block" }}>Válida hasta:</small>
                <strong style={{ color: "var(--accent-primary)" }}>{new Date(membresiaActiva.fecha_expiracion).toLocaleDateString()}</strong>
              </div>
            </div>
            <Link to="/cliente/reservaciones">
              <button className="btn-success">
                <IconBike size={18} color="#0f172a" /> Apartar mi Bicicleta Ahora
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <p style={{ color: "#fca5a5", margin: "10px 0 16px 0" }}>
              Tu membresía ha vencido o no cuentas con una activa. Por favor contacta a la secretaría del gimnasio para renovarla y habilitar tus reservaciones.
            </p>
          </div>
        )}

        {membresias.length > 0 && (
          <details style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <summary style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Historial de suscripciones ({membresias.length})
            </summary>
            <ul style={{ paddingLeft: "20px", marginTop: "10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {membresias.map((m) => (
                <li key={m.id_membresia} style={{ marginBottom: "4px" }}>
                  Suscripción #{m.id_membresia} - Estado: <strong>{m.estado}</strong> ({new Date(m.fecha_inicio).toLocaleDateString()} al {new Date(m.fecha_expiracion).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Datos Personales */}
      <div className="card" style={{ maxWidth: "600px" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          Mis Datos Personales
        </h3>

        {loading ? (
          <p>Cargando información...</p>
        ) : !editMode ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", marginBottom: "20px", fontSize: "0.95rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Nombre:</strong>
              <span>{perfil?.nombre} {perfil?.apellidos}</span>

              <strong style={{ color: "var(--text-muted)" }}>Email:</strong>
              <span>{perfil?.email}</span>

              <strong style={{ color: "var(--text-muted)" }}>Edad:</strong>
              <span>{perfil?.edad} años</span>

              <strong style={{ color: "var(--text-muted)" }}>Teléfono:</strong>
              <span>{perfil?.telefono || "No registrado"}</span>
            </div>
            <button onClick={() => setEditMode(true)} className="btn-secondary">
              Modificar Mis Datos
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdatePerfil}>
            <div className="grid-2">
              <div className="form-group">
                <label>Nombre(s) *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos *</label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Edad</label>
                <input type="number" name="edad" value={formData.edad} onChange={handleChange} min="12" max="120" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WelcomePageCliente;
