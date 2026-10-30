import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerHistorialReservaciones,
  crearReservacion,
  editarReservacion,
  eliminarReservacion,
} from "../../api/reservaciones";
import { listarHorarios } from "../../api/horarios";
import { listarBicicletas } from "../../api/bicicletas";
import { IconBike, IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const ReservacionesClientePage = () => {
  const { user } = useAuth();
  const [reservacionesActivas, setReservacionesActivas] = useState([]);
  const [historialReservaciones, setHistorialReservaciones] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [bicicletasDisponibles, setBicicletasDisponibles] = useState([]);

  // Formulario para apartar clase
  const [selectedHorario, setSelectedHorario] = useState("");
  const [selectedBicicleta, setSelectedBicicleta] = useState("");
  const [talla, setTalla] = useState("M");

  // Formulario para editar reservación activa
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ id_horario: "", id_bicicleta: "", talla: "" });
  const [bicicletasEdicion, setBicicletasEdicion] = useState([]);

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBicis, setLoadingBicis] = useState(false);

  const fetchMisReservaciones = async () => {
    setLoading(true);
    try {
      const data = await obtenerHistorialReservaciones();
      setReservacionesActivas(data?.reservacionesActuales || []);
      setHistorialReservaciones(data?.historialReservaciones || []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al cargar reservaciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchHorarios = async () => {
    try {
      const data = await listarHorarios();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    }
  };

  useEffect(() => {
    fetchMisReservaciones();
    fetchHorarios();
  }, []);

  const handleHorarioSelect = async (e) => {
    const horId = e.target.value;
    setSelectedHorario(horId);
    setSelectedBicicleta("");
    if (!horId) {
      setBicicletasDisponibles([]);
      return;
    }
    setLoadingBicis(true);
    try {
      const bicis = await listarBicicletas(horId);
      const libres = bicis.filter((b) => b.disponible_en_horario);
      setBicicletasDisponibles(libres);
    } catch (error) {
      console.error("Error al cargar bicicletas disponibles:", error);
    } finally {
      setLoadingBicis(false);
    }
  };

  const handleReservarSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      await crearReservacion({
        id_cliente: user.id_usuario,
        id_horario: parseInt(selectedHorario, 10),
        id_bicicleta: parseInt(selectedBicicleta, 10),
        talla: talla.trim(),
      });
      setMessage("¡Tu bicicleta ha sido apartada con éxito!");
      setSelectedHorario("");
      setSelectedBicicleta("");
      setTalla("M");
      setBicicletasDisponibles([]);
      fetchMisReservaciones();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al realizar la reservación");
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

  const handleEditHorarioChange = async (e) => {
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
      setMessage("Tu reservación ha sido modificada con éxito.");
      setEditId(null);
      fetchMisReservaciones();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al modificar la reservación");
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm(`¿Deseas cancelar tu reservación #${id}? La bicicleta quedará libre.`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await eliminarReservacion(id);
      setMessage("Tu reservación fue cancelada.");
      fetchMisReservaciones();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al cancelar la reservación");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1>Reservar Clases de Spinning</h1>
        <p style={{ margin: 0 }}>Elige tu turno y tu bicicleta preferida en CycleFlow</p>
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Formulario de Reserva */}
      <div className="card" style={{ maxWidth: "600px", borderColor: "var(--accent-primary)" }}>
        <h3 style={{ color: "var(--accent-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <IconBike size={20} color="var(--accent-primary)" />
          <span>Apartar Bicicleta para Hoy</span>
        </h3>

        <form onSubmit={handleReservarSubmit}>
          <div className="form-group">
            <label>1. Selecciona el horario del turno *</label>
            <select value={selectedHorario} onChange={handleHorarioSelect} required>
              <option value="">-- Elige un turno disponible --</option>
              {horarios.map((h) => (
                <option key={h.id_horario} value={h.id_horario}>
                  Clase de las {h.hora_inicio} hrs
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>2. Bicicleta disponible en este turno *</label>
            <select
              value={selectedBicicleta}
              onChange={(e) => setSelectedBicicleta(e.target.value)}
              disabled={!selectedHorario || loadingBicis}
              required
            >
              <option value="">
                {!selectedHorario
                  ? "-- Primero elige un horario arriba --"
                  : loadingBicis
                  ? "Buscando disponibilidad..."
                  : bicicletasDisponibles.length === 0
                  ? "-- No hay bicicletas libres en este turno --"
                  : "-- Selecciona tu bicicleta --"}
              </option>
              {bicicletasDisponibles.map((b) => (
                <option key={b.id_bicicleta} value={b.id_bicicleta}>
                  {b.nombre_bicicleta} (Libre)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>3. Talla de calzado para bicicleta *</label>
            <input
              type="text"
              placeholder="Ej. S, M, L, 26, 27"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!selectedBicicleta}
            className="btn-success"
            style={{ width: "100%", marginTop: "10px", padding: "12px" }}
          >
            Confirmar Mi Asistencia
          </button>
        </form>
      </div>

      {/* Edición de Reserva */}
      {editId && (
        <div className="card" style={{ borderColor: "#64748b", maxWidth: "600px" }}>
          <h3>Modificar Reservación #{editId}</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>Turno</label>
              <select value={editData.id_horario} onChange={handleEditHorarioChange} required>
                <option value="">-- Seleccionar horario --</option>
                {horarios.map((h) => (
                  <option key={h.id_horario} value={h.id_horario}>
                    Clase {h.hora_inicio} hrs
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
            <div className="form-group">
              <label>Talla de calzado</label>
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

      {/* Mis Reservaciones Activas */}
      <h2>Mis Reservaciones Activas ({reservacionesActivas.length})</h2>
      {loading ? (
        <p>Cargando tus clases...</p>
      ) : reservacionesActivas.length === 0 ? (
        <p>No tienes reservaciones activas. ¡Aparta una arriba para empezar!</p>
      ) : (
        <div className="table-responsive" style={{ marginBottom: "32px" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
                  <td><span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{r.horario} hrs</span></td>
                  <td>{r.bicicleta}</td>
                  <td><span className="badge badge-libre">{r.talla}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleStartEdit(r)} className="btn-secondary btn-sm">
                        Modificar
                      </button>
                      <button onClick={() => handleCancelar(r.id_reservacion)} className="btn-danger btn-sm">
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
      <h2>Mi Historial de Clases Tomadas ({historialReservaciones.length})</h2>
      {historialReservaciones.length === 0 ? (
        <p>Aún no tienes clases completadas en el historial.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Turno</th>
                <th>Bicicleta</th>
                <th>Talla</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historialReservaciones.map((h) => (
                <tr key={h.id_historial}>
                  <td>#{h.id_historial}</td>
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

export default ReservacionesClientePage;
