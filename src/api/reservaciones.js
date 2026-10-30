import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Crear una nueva reservación
// Espera: { id_cliente, id_horario, id_bicicleta, talla }
export const crearReservacion = async (reservacionData) => {
  try {
    const response = await fetch(`${BASE_URL}/Reservacion/reservar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(reservacionData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al crear reservación:', error);
    throw error;
  }
};

// Modificar una reservación activa
// Admite: { id_horario, id_bicicleta, talla, nombre, apellidos, email }
export const editarReservacion = async (id, datos) => {
  try {
    const response = await fetch(`${BASE_URL}/Reservacion/editar-reservacion/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(datos),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al editar reservación ${id}:`, error);
    throw error;
  }
};

// Cancelar/eliminar una reservación activa
export const eliminarReservacion = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Reservacion/eliminar-reservacion/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al eliminar reservación ${id}:`, error);
    throw error;
  }
};

// Consultar reservaciones activas e historial de clases concluidas
// Devuelve: { usuario, tipo_usuario, reservacionesActuales, historialReservaciones }
export const obtenerHistorialReservaciones = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Reservacion/historial`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al obtener historial de reservaciones:', error);
    throw error;
  }
};

// Mover una reservación activa al historial (concluir clase - solo secretaria o admin)
export const moverReservacionAHistorial = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Reservacion/mover-a-historial/${id}`, {
      method: 'POST',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al mover reservación ${id} a historial:`, error);
    throw error;
  }
};
