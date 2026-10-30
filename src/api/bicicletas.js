import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Listar bicicletas (admite parámetro opcional idHorario para verificar disponibilidad por turno)
export const listarBicicletas = async (idHorario = null) => {
  try {
    const url = idHorario
      ? `${BASE_URL}/Bicicletas/listar?idHorario=${encodeURIComponent(idHorario)}`
      : `${BASE_URL}/Bicicletas/listar`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al listar bicicletas:', error);
    throw error;
  }
};

// Obtener detalle de bicicleta por id
export const obtenerBicicleta = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Bicicletas/detalle/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al obtener bicicleta ${id}:`, error);
    throw error;
  }
};

// Agregar nueva bicicleta
export const agregarBicicleta = async (bicicleta) => {
  try {
    const response = await fetch(`${BASE_URL}/Bicicletas/agregar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(bicicleta),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al agregar bicicleta:', error);
    throw error;
  }
};

// Editar bicicleta existente
export const editarBicicleta = async (id, bicicleta) => {
  try {
    const response = await fetch(`${BASE_URL}/Bicicletas/editar/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(bicicleta),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al editar bicicleta ${id}:`, error);
    throw error;
  }
};

// Borrar bicicleta
export const borrarBicicleta = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Bicicletas/borrar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al borrar bicicleta ${id}:`, error);
    throw error;
  }
};
