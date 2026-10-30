import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuario, editarUsuario } from "../../api/usuarios";
import { IconCalendar, IconBike, IconClock, IconCard, IconUsers, IconAlert, IconCheck } from "../../components/Icons";

const WelcomePage = () => {
  const { user, updateUser } = useAuth();
  const [perfil, setPerfil] = useState(null);
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

  useEffect(() => {
    if (user?.id_usuario) {
      obtenerUsuario(user.id_usuario)
        .then((data) => {
          setPerfil(data);
          setFormData({
            nombre: data.nombre || "",
            apellidos: data.apellidos || "",
            edad: data.edad || "",
            email: data.email || "",
            telefono: data.telefono || "",
            password: "",
          });
        })
        .catch((err) => console.error("Error al cargar perfil:", err));
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
      setMessage("Perfil actualizado con éxito.");
      setPerfil(res.usuario);
      updateUser(res.usuario);
      setEditMode(false);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Error al actualizar perfil");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1>Panel de Administración</h1>
        <p style={{ margin: 0 }}>
          Bienvenida(o), <strong>{user?.nombre} {user?.apellidos}</strong>. Selecciona un módulo para gestionar CycleFlow.
        </p>
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Grid de Accesos Rápidos con Iconos Vectoriales */}
      <div className="grid-cards" style={{ marginBottom: "32px" }}>
        <Link to="/secretaria/reservaciones" style={{ textDecoration: "none" }}>
          <div className="card" style={{ margin: 0, height: "100%", borderTop: "4px solid var(--accent-primary)" }}>
            <div className="icon-box icon-box-cyan">
              <IconCalendar size={22} color="var(--accent-primary)" />
            </div>
            <h3 style={{ margin: "0 0 6px 0", color: "#fff" }}>Reservaciones de Clases</h3>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Ver cupos ocupados, apartar lugares y concluir clases.</p>
          </div>
        </Link>

        <Link to="/secretaria/bicicletas" style={{ textDecoration: "none" }}>
          <div className="card" style={{ margin: 0, height: "100%", borderTop: "4px solid var(--accent-success)" }}>
            <div className="icon-box icon-box-emerald">
              <IconBike size={22} color="var(--accent-success)" />
            </div>
            <h3 style={{ margin: "0 0 6px 0", color: "#fff" }}>Catálogo de Bicicletas</h3>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Alta de unidades, control de mantenimiento y disponibilidad.</p>
          </div>
        </Link>

        <Link to="/secretaria/horarios" style={{ textDecoration: "none" }}>
          <div className="card" style={{ margin: 0, height: "100%", borderTop: "4px solid var(--accent-warning)" }}>
            <div className="icon-box icon-box-amber">
              <IconClock size={22} color="var(--accent-warning)" />
            </div>
            <h3 style={{ margin: "0 0 6px 0", color: "#fff" }}>Horarios de Clases</h3>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Programación y modificación de turnos de spinning diarios.</p>
          </div>
        </Link>

        <Link to="/secretaria/membresias" style={{ textDecoration: "none" }}>
          <div className="card" style={{ margin: 0, height: "100%", borderTop: "4px solid #8b5cf6" }}>
            <div className="icon-box icon-box-purple">
              <IconCard size={22} color="#a78bfa" />
            </div>
            <h3 style={{ margin: "0 0 6px 0", color: "#fff" }}>Control de Membresías</h3>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Activación, renovación y monitoreo de vigencias de clientes.</p>
          </div>
        </Link>

        <Link to="/secretaria/usuarios" style={{ textDecoration: "none" }}>
          <div className="card" style={{ margin: 0, height: "100%", borderTop: "4px solid #ec4899" }}>
            <div className="icon-box icon-box-pink">
              <IconUsers size={22} color="#f472b6" />
            </div>
            <h3 style={{ margin: "0 0 6px 0", color: "#fff" }}>Directorio de Usuarios</h3>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Administración de clientes, secretarias y roles del sistema.</p>
          </div>
        </Link>
      </div>

      {/* Perfil */}
      <div className="card" style={{ maxWidth: "600px" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          Mi Perfil de Secretaría
        </h3>

        {!editMode ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", marginBottom: "20px", fontSize: "0.95rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Nombre:</strong>
              <span>{perfil?.nombre} {perfil?.apellidos}</span>

              <strong style={{ color: "var(--text-muted)" }}>Email:</strong>
              <span>{perfil?.email}</span>

              <strong style={{ color: "var(--text-muted)" }}>Edad:</strong>
              <span>{perfil?.edad} años</span>

              <strong style={{ color: "var(--text-muted)" }}>Teléfono:</strong>
              <span>{perfil?.telefono || "No especificado"}</span>

              <strong style={{ color: "var(--text-muted)" }}>Rol:</strong>
              <span><span className="badge badge-libre">{perfil?.tipo_usuario}</span></span>
            </div>
            <button onClick={() => setEditMode(true)} className="btn-secondary">
              Editar Mi Información
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

export default WelcomePage;
