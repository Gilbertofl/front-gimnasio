import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Listar todos los horarios
export const listarHorarios = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Horarios/listar`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al listar horarios:', error);
    throw error;
  }
};

// Obtener detalle de horario
export const obtenerHorario = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Horarios/detalle/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al obtener horario ${id}:`, error);
    throw error;
  }
};

// Agregar un nuevo horario (formato esperado: "HH:mm" o "HH:mm:ss")
export const agregarHorario = async (horarioData) => {
  try {
    const response = await fetch(`${BASE_URL}/Horarios/agregar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(horarioData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al agregar horario:', error);
    throw error;
  }
};

// Modificar un horario existente
export const editarHorario = async (id, horarioData) => {
  try {
    const response = await fetch(`${BASE_URL}/Horarios/editar/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(horarioData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al editar horario ${id}:`, error);
    throw error;
  }
};

// Eliminar un horario
export const eliminarHorario = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Horarios/eliminar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al eliminar horario ${id}:`, error);
    throw error;
  }
};
