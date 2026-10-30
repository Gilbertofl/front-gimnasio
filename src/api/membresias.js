import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Registrar y activar una nueva membresía (secretaria/admin)
export const registrarMembresia = async (membresiaData) => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/registrar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(membresiaData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al registrar membresía:', error);
    throw error;
  }
};

// Listar todas las membresías del gimnasio (secretaria/admin)
export const listarMembresias = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/listar`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al listar membresías:', error);
    throw error;
  }
};

// Obtener detalle de una membresía por su id
export const obtenerMembresia = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/detalle/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al obtener membresía ${id}:`, error);
    throw error;
  }
};

// Consultar membresías de un cliente en específico
export const obtenerMembresiasDeCliente = async (idCliente) => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/cliente/${idCliente}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al obtener membresías del cliente ${idCliente}:`, error);
    throw error;
  }
};

// Modificar datos o fechas de una membresía (secretaria/admin)
export const editarMembresia = async (id, datos) => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/editar/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(datos),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al editar membresía ${id}:`, error);
    throw error;
  }
};

// Eliminar una membresía (secretaria/admin)
export const eliminarMembresia = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Membresias/eliminar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al eliminar membresía ${id}:`, error);
    throw error;
  }
};
