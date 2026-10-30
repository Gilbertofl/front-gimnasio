import React, { useState, useEffect } from "react";
import { listarUsuarios, obtenerUsuario, editarUsuario, borrarUsuario } from "../../api/usuarios";
import { registerUser } from "../../api/auth";
import { IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [detalleUsuario, setDetalleUsuario] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createData, setCreateData] = useState({
    nombre: "",
    apellidos: "",
    edad: 25,
    email: "",
    password: "",
    telefono: "",
    tipo_usuario: "cliente",
  });

  const [editData, setEditData] = useState({
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

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await listarUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al listar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await registerUser({
        ...createData,
        edad: parseInt(createData.edad, 10) || 18,
      });
      setMessage("Usuario registrado con éxito.");
      setCreateData({
        nombre: "",
        apellidos: "",
        edad: 25,
        email: "",
        password: "",
        telefono: "",
        tipo_usuario: "cliente",
      });
      setShowCreateForm(false);
      fetchUsuarios();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al crear usuario");
    }
  };

  const handleStartEdit = (u) => {
    setEditId(u.id_usuario);
    setEditData({
      nombre: u.nombre,
      apellidos: u.apellidos,
      edad: u.edad,
      email: u.email,
      password: "",
      telefono: u.telefono || "",
      tipo_usuario: u.tipo_usuario,
    });
    setMessage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const payload = {
        nombre: editData.nombre,
        apellidos: editData.apellidos,
        edad: editData.edad ? parseInt(editData.edad, 10) : undefined,
        email: editData.email,
        telefono: editData.telefono,
        tipo_usuario: editData.tipo_usuario,
      };
      if (editData.password && editData.password.trim().length >= 6) {
        payload.password = editData.password.trim();
      }

      await editarUsuario(editId, payload);
      setMessage("Usuario actualizado con éxito.");
      setEditId(null);
      fetchUsuarios();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al actualizar usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el usuario #${id}?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await borrarUsuario(id);
      setMessage("Usuario eliminado con éxito.");
      fetchUsuarios();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al eliminar usuario");
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerUsuario(id);
      setDetalleUsuario(detalle);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener detalle del usuario");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1>Directorio de Usuarios</h1>
          <p style={{ margin: 0 }}>Cuentas registradas en la plataforma CycleFlow</p>
        </div>
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)} className="btn-success">
            + Nuevo Usuario
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Formulario de Alta */}
      {showCreateForm && (
        <div className="card" style={{ borderColor: "var(--accent-primary)" }}>
          <h3 style={{ color: "var(--accent-primary)" }}>Registrar Nuevo Usuario</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Nombre(s) *</label>
                <input type="text" name="nombre" value={createData.nombre} onChange={handleCreateChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos *</label>
                <input type="text" name="apellidos" value={createData.apellidos} onChange={handleCreateChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Edad (12 a 120) *</label>
                <input type="number" name="edad" value={createData.edad} onChange={handleCreateChange} min="12" max="120" required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={createData.telefono} onChange={handleCreateChange} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={createData.email} onChange={handleCreateChange} required />
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input type="password" name="password" value={createData.password} onChange={handleCreateChange} minLength="6" required />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: "300px" }}>
              <label>Rol de Usuario</label>
              <select name="tipo_usuario" value={createData.tipo_usuario} onChange={handleCreateChange}>
                <option value="cliente">Cliente</option>
                <option value="secretaria">Secretaría</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">Guardar Usuario</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulario de Edición */}
      {editId && (
        <div className="card" style={{ borderColor: "#64748b" }}>
          <h3>Editar Usuario #{editId}</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Nombre(s)</label>
                <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input type="text" name="apellidos" value={editData.apellidos} onChange={handleEditChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Edad</label>
                <input type="number" name="edad" value={editData.edad} onChange={handleEditChange} min="12" max="120" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={editData.telefono} onChange={handleEditChange} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={editData.email} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input type="password" name="password" value={editData.password} onChange={handleEditChange} placeholder="Dejar en blanco para no cambiar" />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: "300px" }}>
              <label>Rol</label>
              <select name="tipo_usuario" value={editData.tipo_usuario} onChange={handleEditChange}>
                <option value="cliente">Cliente</option>
                <option value="secretaria">Secretaría</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={() => setEditId(null)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detalle */}
      {detalleUsuario && (
        <div className="card" style={{ borderColor: "#64748b" }}>
          <h3>Detalle de Usuario #{detalleUsuario.id_usuario}</h3>
          <p><strong>Nombre completo:</strong> {detalleUsuario.nombre} {detalleUsuario.apellidos}</p>
          <p><strong>Email:</strong> {detalleUsuario.email}</p>
          <p><strong>Edad:</strong> {detalleUsuario.edad} años</p>
          <p><strong>Teléfono:</strong> {detalleUsuario.telefono || "No registrado"}</p>
          <p><strong>Rol:</strong> <span className="badge badge-libre">{detalleUsuario.tipo_usuario}</span></p>
          <button onClick={() => setDetalleUsuario(null)} className="btn-secondary btn-sm">
            Cerrar detalle
          </button>
        </div>
      )}

      {/* Tabla */}
      <h2>Usuarios Registrados ({usuarios.length})</h2>
      {loading ? (
        <p>Cargando directorio de usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td><strong>#{u.id_usuario}</strong></td>
                  <td style={{ fontWeight: 600 }}>{u.nombre} {u.apellidos}</td>
                  <td>{u.email}</td>
                  <td>{u.edad}</td>
                  <td>{u.telefono || "-"}</td>
                  <td>
                    <span className="badge badge-libre">{u.tipo_usuario}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleVerDetalle(u.id_usuario)} className="btn-secondary btn-sm">
                        Detalle
                      </button>
                      <button onClick={() => handleStartEdit(u)} className="btn-secondary btn-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(u.id_usuario)} className="btn-danger btn-sm">
                        <IconTrash size={14} color="#fca5a5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
