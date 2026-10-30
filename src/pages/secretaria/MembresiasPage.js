import React, { useState, useEffect } from "react";
import { listarMembresias, registrarMembresia, editarMembresia, eliminarMembresia, obtenerMembresiasDeCliente, obtenerMembresia } from "../../api/membresias";
import { listarUsuarios } from "../../api/usuarios";
import { IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const MembresiasPage = () => {
  const [membresias, setMembresias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ id_cliente: "", meses_duracion: 1 });
  const [editData, setEditData] = useState({ fecha_inicio: "", fecha_expiracion: "", estado: "Activa" });
  const [editId, setEditId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [detalleMembresia, setDetalleMembresia] = useState(null);
  const [filtroClienteId, setFiltroClienteId] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMembresias = async () => {
    setLoading(true);
    try {
      const data = await listarMembresias();
      setMembresias(Array.isArray(data) ? data : []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener membresías");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchMembresias();
    fetchUsuarios();
  }, []);

  const clientes = usuarios.filter((u) => u.tipo_usuario === "cliente");

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await registrarMembresia({
        id_cliente: parseInt(formData.id_cliente, 10),
        meses_duracion: parseInt(formData.meses_duracion, 10) || 1,
      });
      setMessage("Membresía registrada y activada con éxito.");
      setFormData({ id_cliente: "", meses_duracion: 1 });
      setShowCreateForm(false);
      fetchMembresias();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al registrar membresía");
    }
  };

  const handleStartEdit = (m) => {
    setEditId(m.id_membresia);
    setEditData({
      fecha_inicio: m.fecha_inicio ? m.fecha_inicio.substring(0, 10) : "",
      fecha_expiracion: m.fecha_expiracion ? m.fecha_expiracion.substring(0, 10) : "",
      estado: m.estado,
    });
    setMessage(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await editarMembresia(editId, {
        fecha_inicio: editData.fecha_inicio ? new Date(editData.fecha_inicio).toISOString() : null,
        fecha_expiracion: editData.fecha_expiracion ? new Date(editData.fecha_expiracion).toISOString() : null,
        estado: editData.estado,
      });
      setMessage("Membresía actualizada con éxito.");
      setEditId(null);
      fetchMembresias();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al editar membresía");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Deseas eliminar permanentemente la membresía #${id}?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await eliminarMembresia(id);
      setMessage("Membresía eliminada.");
      fetchMembresias();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al eliminar membresía");
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerMembresia(id);
      setDetalleMembresia(detalle);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener detalle");
    }
  };

  const handleFiltrarPorCliente = async () => {
    if (!filtroClienteId) {
      fetchMembresias();
      return;
    }
    setLoading(true);
    try {
      const data = await obtenerMembresiasDeCliente(filtroClienteId);
      setMembresias(Array.isArray(data) ? data : []);
      setMessage(`Mostrando membresías del cliente seleccionado.`);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al filtrar por cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1>Control de Membresías</h1>
          <p style={{ margin: 0 }}>Suscripciones activas, historial y vigencias de los clientes</p>
        </div>
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)} className="btn-success">
            + Activar Membresía
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Barra de Filtro */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>
            Historial por Cliente:
          </label>
          <select
            value={filtroClienteId}
            onChange={(e) => setFiltroClienteId(e.target.value)}
            style={{ maxWidth: "340px" }}
          >
            <option value="">-- Todos los clientes --</option>
            {clientes.map((c) => (
              <option key={c.id_usuario} value={c.id_usuario}>
                {c.nombre} {c.apellidos} ({c.email})
              </option>
            ))}
          </select>
          <button onClick={handleFiltrarPorCliente} className="btn-sm">
            Filtrar
          </button>
          {filtroClienteId && (
            <button onClick={() => { setFiltroClienteId(""); fetchMembresias(); }} className="btn-secondary btn-sm">
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* Formulario de Alta */}
      {showCreateForm && (
        <div className="card" style={{ borderColor: "var(--accent-primary)" }}>
          <h3 style={{ color: "var(--accent-primary)" }}>Activar Nueva Membresía a Cliente</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Cliente Beneficiario *</label>
                <select name="id_cliente" value={formData.id_cliente} onChange={handleCreateChange} required>
                  <option value="">-- Selecciona un cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id_usuario} value={c.id_usuario}>
                      {c.nombre} {c.apellidos} - {c.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Duración en Meses *</label>
                <input
                  type="number"
                  name="meses_duracion"
                  value={formData.meses_duracion}
                  onChange={handleCreateChange}
                  min="1"
                  max="24"
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">Activar Membresía</button>
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
          <h3>Editar Membresía #{editId}</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  value={editData.fecha_inicio}
                  onChange={(e) => setEditData({ ...editData, fecha_inicio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Fecha de Expiración</label>
                <input
                  type="date"
                  value={editData.fecha_expiracion}
                  onChange={(e) => setEditData({ ...editData, fecha_expiracion: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: "300px" }}>
              <label>Estado de la Membresía</label>
              <select
                value={editData.estado}
                onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
              >
                <option value="Activa">Activa</option>
                <option value="Vencida">Vencida</option>
                <option value="Cancelada">Cancelada</option>
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
      {detalleMembresia && (
        <div className="card" style={{ borderColor: "#64748b" }}>
          <h3>Detalle de Membresía #{detalleMembresia.id_membresia}</h3>
          <p><strong>Cliente:</strong> {detalleMembresia.cliente_nombre} ({detalleMembresia.cliente_email})</p>
          <p><strong>Inicio:</strong> {new Date(detalleMembresia.fecha_inicio).toLocaleDateString()}</p>
          <p><strong>Vencimiento:</strong> {new Date(detalleMembresia.fecha_expiracion).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> <span className={`badge badge-${detalleMembresia.estado.toLowerCase()}`}>{detalleMembresia.estado}</span></p>
          <p><strong>¿Vigente para apartar clases?:</strong> {detalleMembresia.esta_vigente ? "Sí, vigente" : "No vigente"}</p>
          <button onClick={() => setDetalleMembresia(null)} className="btn-secondary btn-sm">
            Cerrar detalle
          </button>
        </div>
      )}

      {/* Tabla de Membresías */}
      <h2>Membresías Registradas ({membresias.length})</h2>
      {loading ? (
        <p>Cargando información de suscripciones...</p>
      ) : membresias.length === 0 ? (
        <p>No se encontraron registros de membresías.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Periodo</th>
                <th>Estado</th>
                <th>Vigencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {membresias.map((m) => (
                <tr key={m.id_membresia}>
                  <td><strong>#{m.id_membresia}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.cliente_nombre}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{m.cliente_email}</div>
                  </td>
                  <td>
                    {new Date(m.fecha_inicio).toLocaleDateString()} al {new Date(m.fecha_expiracion).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge badge-${m.estado.toLowerCase()}`}>{m.estado}</span>
                  </td>
                  <td>
                    {m.esta_vigente ? (
                      <span style={{ color: "#34d399", fontWeight: 600, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <IconCheck size={14} color="#34d399" /> Activa
                      </span>
                    ) : (
                      <span style={{ color: "#f87171", fontSize: "0.85rem" }}>Expirada</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleVerDetalle(m.id_membresia)} className="btn-secondary btn-sm">
                        Detalle
                      </button>
                      <button onClick={() => handleStartEdit(m)} className="btn-secondary btn-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(m.id_membresia)} className="btn-danger btn-sm">
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

export default MembresiasPage;
