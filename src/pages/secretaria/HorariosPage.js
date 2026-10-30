import React, { useState, useEffect } from "react";
import { listarHorarios, agregarHorario, editarHorario, eliminarHorario, obtenerHorario } from "../../api/horarios";
import { IconClock, IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const HorariosPage = () => {
  const [horarios, setHorarios] = useState([]);
  const [formData, setFormData] = useState({ hora_inicio: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [detalleHorario, setDetalleHorario] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHorarios = async () => {
    setLoading(true);
    try {
      const data = await listarHorarios();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener horarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      if (editMode) {
        await editarHorario(editId, formData);
        setMessage("Horario modificado con éxito.");
      } else {
        await agregarHorario(formData);
        setMessage("Horario creado con éxito.");
      }
      setFormData({ hora_inicio: "" });
      setEditMode(false);
      setEditId(null);
      setShowInputs(false);
      fetchHorarios();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al guardar el horario");
    }
  };

  const handleEdit = (horario) => {
    setFormData({ hora_inicio: horario.hora_inicio });
    setEditMode(true);
    setEditId(horario.id_horario);
    setShowInputs(true);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el horario #${id}?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await eliminarHorario(id);
      setMessage("Horario eliminado con éxito.");
      fetchHorarios();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al eliminar horario");
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerHorario(id);
      setDetalleHorario(detalle);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener detalle");
    }
  };

  const handleCancel = () => {
    setShowInputs(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ hora_inicio: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1>Horarios de Clases</h1>
          <p style={{ margin: 0 }}>Gestión de turnos diarios para las sesiones de spinning</p>
        </div>
        {!showInputs && (
          <button onClick={() => setShowInputs(true)} className="btn-success">
            + Nuevo Turno
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {showInputs && (
        <div className="card" style={{ borderColor: "var(--accent-primary)" }}>
          <h3 style={{ color: "var(--accent-primary)" }}>
            {editMode ? `Editar Horario #${editId}` : "Nuevo Horario de Clase"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ maxWidth: "300px" }}>
              <label>Hora de Inicio (formato HH:mm) *</label>
              <input
                type="text"
                name="hora_inicio"
                placeholder="Ej. 07:00, 18:30"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">{editMode ? "Guardar Cambios" : "Guardar Horario"}</button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {detalleHorario && (
        <div className="card" style={{ borderColor: "#64748b" }}>
          <h3>Detalle del Turno #{detalleHorario.id_horario}</h3>
          <p><strong>Hora de inicio:</strong> {detalleHorario.hora_inicio} hrs</p>
          <button onClick={() => setDetalleHorario(null)} className="btn-secondary btn-sm">
            Cerrar detalle
          </button>
        </div>
      )}

      <h2>Turnos Programados ({horarios.length})</h2>
      {loading ? (
        <p>Cargando horarios...</p>
      ) : horarios.length === 0 ? (
        <p>No hay turnos registrados actualmente.</p>
      ) : (
        <div className="grid-cards">
          {horarios.map((h) => (
            <div key={h.id_horario} className="card" style={{ margin: 0, textAlign: "center" }}>
              <div className="icon-box icon-box-amber" style={{ margin: "0 auto 12px auto" }}>
                <IconClock size={22} color="var(--accent-warning)" />
              </div>
              <h3 style={{ fontSize: "1.4rem", color: "var(--accent-primary)", marginBottom: "4px" }}>
                {h.hora_inicio}
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.8rem" }}>Turno #{h.id_horario}</p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button onClick={() => handleVerDetalle(h.id_horario)} className="btn-secondary btn-sm">
                  Detalle
                </button>
                <button onClick={() => handleEdit(h)} className="btn-secondary btn-sm">
                  Editar
                </button>
                <button onClick={() => handleDelete(h.id_horario)} className="btn-danger btn-sm">
                  <IconTrash size={14} color="#fca5a5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HorariosPage;
