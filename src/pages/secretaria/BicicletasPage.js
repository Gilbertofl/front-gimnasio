import React, { useState, useEffect, useCallback } from "react";
import { listarBicicletas, agregarBicicleta, editarBicicleta, borrarBicicleta, obtenerBicicleta } from "../../api/bicicletas";
import { listarHorarios } from "../../api/horarios";
import { IconTrash, IconAlert, IconCheck } from "../../components/Icons";

const BicicletasPage = () => {
  const [bicicletas, setBicicletas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [filtroHorario, setFiltroHorario] = useState("");
  const [formData, setFormData] = useState({ nombre_bicicleta: "", estado: "libre" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [detalleBicicleta, setDetalleBicicleta] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBicicletas = useCallback(async (idHorario = null) => {
    setLoading(true);
    try {
      const data = await listarBicicletas(idHorario || null);
      setBicicletas(Array.isArray(data) ? data : []);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener bicicletas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHorarios = async () => {
    try {
      const data = await listarHorarios();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    }
  };

  useEffect(() => {
    fetchBicicletas();
    fetchHorarios();
  }, [fetchBicicletas]);

  const handleFiltroHorarioChange = (e) => {
    const val = e.target.value;
    setFiltroHorario(val);
    fetchBicicletas(val || null);
  };

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
        await editarBicicleta(editId, formData);
        setMessage("Bicicleta actualizada con éxito.");
      } else {
        await agregarBicicleta(formData);
        setMessage("Bicicleta agregada al catálogo con éxito.");
      }
      setFormData({ nombre_bicicleta: "", estado: "libre" });
      setEditMode(false);
      setEditId(null);
      setShowInputs(false);
      fetchBicicletas(filtroHorario || null);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al procesar la bicicleta");
    }
  };

  const handleEdit = (bicicleta) => {
    setFormData({
      nombre_bicicleta: bicicleta.nombre_bicicleta,
      estado: bicicleta.estado || bicicleta.estado_general || "libre",
    });
    setEditMode(true);
    setEditId(bicicleta.id_bicicleta);
    setShowInputs(true);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la bicicleta #${id}?`)) {
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      await borrarBicicleta(id);
      setMessage("Bicicleta eliminada con éxito.");
      fetchBicicletas(filtroHorario || null);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al borrar bicicleta");
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerBicicleta(id);
      setDetalleBicicleta(detalle);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error al obtener detalle de la bicicleta");
    }
  };

  const handleShowInputs = () => {
    setFormData({ nombre_bicicleta: "", estado: "libre" });
    setEditMode(false);
    setEditId(null);
    setShowInputs(true);
    setMessage(null);
  };

  const handleCancelForm = () => {
    setShowInputs(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ nombre_bicicleta: "", estado: "libre" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1>Gestión de Bicicletas</h1>
          <p style={{ margin: 0 }}>Inventario y estado de las bicicletas de spinning en CycleFlow</p>
        </div>
        {!showInputs && (
          <button onClick={handleShowInputs} className="btn-success">
            + Agregar Bicicleta
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
          {isError ? <IconAlert size={18} color="#fca5a5" /> : <IconCheck size={18} color="#6ee7b7" />}
          <span>{message}</span>
        </div>
      )}

      {/* Filtro por horario */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>
            Consultar disponibilidad en clase:
          </label>
          <select
            value={filtroHorario}
            onChange={handleFiltroHorarioChange}
            style={{ maxWidth: "300px" }}
          >
            <option value="">-- Vista general (Todos los turnos) --</option>
            {horarios.map((h) => (
              <option key={h.id_horario} value={h.id_horario}>
                Turno {h.hora_inicio} hrs
              </option>
            ))}
          </select>
          {filtroHorario && (
            <button onClick={() => { setFiltroHorario(""); fetchBicicletas(null); }} className="btn-secondary btn-sm">
              Quitar filtro
            </button>
          )}
        </div>
      </div>

      {/* Formulario de agregar / editar */}
      {showInputs && (
        <div className="card" style={{ borderColor: "var(--accent-primary)" }}>
          <h3 style={{ color: "var(--accent-primary)" }}>
            {editMode ? `Editar Bicicleta #${editId}` : "Alta de Nueva Bicicleta"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Identificador de Bicicleta *</label>
                <input
                  type="text"
                  name="nombre_bicicleta"
                  placeholder="Ej. Bicicleta #16"
                  value={formData.nombre_bicicleta}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado Inicial *</label>
                <select name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="libre">Libre</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">{editMode ? "Guardar Cambios" : "Guardar en Inventario"}</button>
              <button type="button" onClick={handleCancelForm} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal / Card de Detalle */}
      {detalleBicicleta && (
        <div className="card" style={{ borderColor: "#64748b", background: "rgba(30, 41, 59, 0.95)" }}>
          <h3>Detalle de Bicicleta #{detalleBicicleta.id_bicicleta}</h3>
          <p><strong>Nombre:</strong> {detalleBicicleta.nombre_bicicleta}</p>
          <p><strong>Estado en Catálogo:</strong> <span className={`badge badge-${detalleBicicleta.estado}`}>{detalleBicicleta.estado}</span></p>
          <button onClick={() => setDetalleBicicleta(null)} className="btn-secondary btn-sm">
            Cerrar detalle
          </button>
        </div>
      )}

      {/* Grid de Bicicletas */}
      <h2>Catálogo ({bicicletas.length})</h2>
      {loading ? (
        <p>Consultando catálogo...</p>
      ) : bicicletas.length === 0 ? (
        <p>No se encontraron bicicletas registradas.</p>
      ) : (
        <div className="grid-cards">
          {bicicletas.map((b) => {
            const estadoActual = b.estado || b.estado_general || "libre";
            const tieneFiltro = filtroHorario !== "";

            return (
              <div
                key={b.id_bicicleta}
                className="card"
                style={{
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderLeft: `4px solid ${
                    estadoActual === "libre" ? "var(--accent-success)" : estadoActual === "ocupada" ? "var(--accent-danger)" : "var(--accent-warning)"
                  }`
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{b.nombre_bicicleta}</h3>
                    <span className={`badge badge-${estadoActual}`}>{estadoActual}</span>
                  </div>

                  {tieneFiltro && (
                    <div style={{
                      margin: "8px 0 12px 0",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: b.disponible_en_horario ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      fontSize: "0.8rem",
                      color: b.disponible_en_horario ? "#34d399" : "#f87171"
                    }}>
                      {b.disponible_en_horario ? "Disponible en este turno" : "Ocupada en este turno"}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "6px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                  <button onClick={() => handleVerDetalle(b.id_bicicleta)} className="btn-secondary btn-sm" style={{ flex: 1 }}>
                    Detalle
                  </button>
                  <button onClick={() => handleEdit(b)} className="btn-secondary btn-sm" style={{ flex: 1 }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(b.id_bicicleta)} className="btn-danger btn-sm">
                    <IconTrash size={14} color="#fca5a5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BicicletasPage;
