import React, { useState, useEffect } from "react";
import {
  obtenerHistorialReservaciones,
  crearReservacion,
  editarReservacion,
  eliminarReservacion,
  moverReservacionAHistorial,
} from "../../api/reservaciones";
import { listarHorarios } from "../../api/horarios";
import { listarBicicletas } from "../../api/bicicletas";
import { listarUsuarios } from "../../api/usuarios";
import { IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const ReservacionesPage = () => {
  const [reservacionesActivas, setReservacionesActivas] = useState([]);
  const [historialReservaciones, setHistorialReservaciones] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [bicicletasDisponibles, setBicicletasDisponibles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_horario: "",
    id_bicicleta: "",
    talla: "M",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    id_horario: "",
    id_bicicleta: "",
    talla: "",
  });
  const [bicicletasEdicion, setBicicletasEdicion] = useState([]);

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const res = await obtenerHistorialReservaciones();
      setReservacionesActivas(res?.reservacionesActuales || []);
      setHistorialReservaciones(res?.historialReservaciones || []);

      const [hors, users] = await Promise.all([
        listarHorarios(),
        listarUsuarios(),
      ]);
      setHorarios(Array.isArray(hors) ? hors : []);
      setUsuarios(Array.isArray(users) ? users : []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al cargar datos de reservaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const clientes = usuarios.filter((u) => u.tipo_usuario === "cliente");

  const handleHorarioCreateChange = async (e) => {
    const horId = e.target.value;
    setFormData((prev) => ({ ...prev, id_horario: horId, id_bicicleta: "" }));
    if (!horId) {
      setBicicletasDisponibles([]);
      return;
    }
    try {
      const bicis = await listarBicicletas(horId);
      const libres = bicis.filter((b) => b.disponible_en_horario);
      setBicicletasDisponibles(libres);
    } catch (err) {
      console.error("Error al cargar bicis para horario:", err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await crearReservacion({
        id_cliente: parseInt(formData.id_cliente, 10),
        id_horario: parseInt(formData.id_horario, 10),
        id_bicicleta: parseInt(formData.id_bicicleta, 10),
        talla: formData.talla,
      });
      setMessage("Reservación creada con éxito.");
      setFormData({ id_cliente: "", id_horario: "", id_bicicleta: "", talla: "M" });
      setShowCreateForm(false);
      setBicicletasDisponibles([]);
      fetchDatos();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al crear reservación");
    }
  };

  const handleStartEdit = async (reserva) => {
    setEditId(reserva.id_reservacion);
    setEditData({
      id_horario: reserva.id_horario,
      id_bicicleta: reserva.id_bicicleta,
      talla: reserva.talla,
    });
    setMessage(null);

    try {
      const bicis = await listarBicicletas(reserva.id_horario);
      const validas = bicis.filter(
        (b) => b.disponible_en_horario || b.id_bicicleta === reserva.id_bicicleta
      );
      setBicicletasEdicion(validas);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHorarioEditChange = async (e) => {
    const horId = e.target.value;
    setEditData((prev) => ({ ...prev, id_horario: horId, id_bicicleta: "" }));
    if (!horId) {
      setBicicletasEdicion([]);
      return;
    }
    try {
      const bicis = await listarBicicletas(horId);
      const validas = bicis.filter((b) => b.disponible_en_horario);
      setBicicletasEdicion(validas);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await editarReservacion(editId, {
        id_horario: parseInt(editData.id_horario, 10),
        id_bicicleta: parseInt(editData.id_bicicleta, 10),
        talla: editData.talla,
      });
      setMessage("Reservación modificada con éxito.");
      setEditId(null);
      fetchDatos();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al modificar reservación");
    }
  };

  const handleConcluirClase = async (id) => {
    if (!window.confirm(`¿Deseas marcar la clase #${id} como concluida y liberar la bicicleta?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await moverReservacionAHistorial(id);
      setMessage("Clase concluida exitosamente. La bicicleta quedó libre.");
      fetchDatos();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al concluir la reservación");
    }
  };

  const handleCancelarReservacion = async (id) => {
    if (!window.confirm(`¿Deseas cancelar y retirar la reservación #${id}?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await eliminarReservacion(id);
      setMessage("Reservación cancelada.");
      fetchDatos();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al cancelar la reservación");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1>Control de Reservaciones y Clases</h1>
          <p style={{ margin: 0 }}>Gestión de cupos, bicicletas apartadas y cierre de clases</p>
        </div>
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)} className="btn-success">
            + Nueva Reservación
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
          <h3 style={{ color: "var(--accent-primary)" }}>Crear Reservación Manual</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Cliente (debe tener membresía activa) *</label>
                <select
                  value={formData.id_cliente}
                  onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                  required
                >
                  <option value="">-- Seleccionar cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id_usuario} value={c.id_usuario}>
                      {c.nombre} {c.apellidos} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Horario del Turno *</label>
                <select value={formData.id_horario} onChange={handleHorarioCreateChange} required>
                  <option value="">-- Seleccionar horario --</option>
                  {horarios.map((h) => (
                    <option key={h.id_horario} value={h.id_horario}>
                      Turno {h.hora_inicio} hrs
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Bicicleta Libre *</label>
                <select
                  value={formData.id_bicicleta}
                  onChange={(e) => setFormData({ ...formData, id_bicicleta: e.target.value })}
                  disabled={!formData.id_horario}
                  required
                >
                  <option value="">
                    {!formData.id_horario
                      ? "-- Primero elige un horario --"
                      : bicicletasDisponibles.length === 0
                      ? "-- No hay bicicletas disponibles en este turno --"
                      : "-- Seleccionar bicicleta --"}
                  </option>
                  {bicicletasDisponibles.map((b) => (
                    <option key={b.id_bicicleta} value={b.id_bicicleta}>
                      {b.nombre_bicicleta}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Talla de Calzado *</label>
                <input
                  type="text"
                  placeholder="Ej. S, M, L, 26, 27"
                  value={formData.talla}
                  onChange={(e) => setFormData({ ...formData, talla: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={!formData.id_bicicleta}>
                Confirmar Reservación
              </button>
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
          <h3>Modificar Reservación #{editId}</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Horario</label>
                <select value={editData.id_horario} onChange={handleHorarioEditChange} required>
                  <option value="">-- Seleccionar horario --</option>
                  {horarios.map((h) => (
                    <option key={h.id_horario} value={h.id_horario}>
                      Turno {h.hora_inicio} hrs
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bicicleta</label>
                <select
                  value={editData.id_bicicleta}
                  onChange={(e) => setEditData({ ...editData, id_bicicleta: e.target.value })}
                  required
                >
                  <option value="">-- Seleccionar bicicleta --</option>
                  {bicicletasEdicion.map((b) => (
                    <option key={b.id_bicicleta} value={b.id_bicicleta}>
                      {b.nombre_bicicleta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: "300px" }}>
              <label>Talla</label>
              <input
                type="text"
                value={editData.talla}
                onChange={(e) => setEditData({ ...editData, talla: e.target.value })}
                required
              />
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

      {/* Tabla de Reservaciones Activas */}
      <h2>Reservaciones Activas ({reservacionesActivas.length})</h2>
      {loading ? (
        <p>Cargando reservaciones...</p>
      ) : reservacionesActivas.length === 0 ? (
        <p>No hay clases reservadas activas en este momento.</p>
      ) : (
        <div className="table-responsive" style={{ marginBottom: "32px" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Turno</th>
                <th>Bicicleta</th>
                <th>Talla</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservacionesActivas.map((r) => (
                <tr key={r.id_reservacion}>
                  <td><strong>#{r.id_reservacion}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.nombre} {r.apellidos}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{r.email}</div>
                  </td>
                  <td>
                    <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{r.horario} hrs</span>
                  </td>
                  <td>{r.bicicleta}</td>
                  <td><span className="badge badge-libre">{r.talla}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleStartEdit(r)} className="btn-secondary btn-sm">
                        Editar
                      </button>
                      <button onClick={() => handleConcluirClase(r.id_reservacion)} className="btn-success btn-sm">
                        Concluir Clase
                      </button>
                      <button onClick={() => handleCancelarReservacion(r.id_reservacion)} className="btn-danger btn-sm">
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

      {/* Historial */}
      <h2>Historial de Clases Concluidas ({historialReservaciones.length})</h2>
      {historialReservaciones.length === 0 ? (
        <p>Aún no hay clases registradas en el historial.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID Historial</th>
                <th>Cliente</th>
                <th>Turno</th>
                <th>Bicicleta</th>
                <th>Talla</th>
                <th>Estado</th>
                <th>Fecha Conclusión</th>
              </tr>
            </thead>
            <tbody>
              {historialReservaciones.map((h) => (
                <tr key={h.id_historial}>
                  <td>#{h.id_historial}</td>
                  <td>{h.nombre} {h.apellidos}</td>
                  <td>{h.horario} hrs</td>
                  <td>{h.bicicleta}</td>
                  <td>{h.talla}</td>
                  <td><span className="badge badge-finalizado">{h.estado}</span></td>
                  <td>{new Date(h.fecha_registro).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservacionesPage;
