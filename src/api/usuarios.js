import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Listar todos los usuarios (solo secretaria o admin)
export const listarUsuarios = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/listar`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    throw error;
  }
};

// Obtener detalle de un usuario
export const obtenerUsuario = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/detalle/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error;
  }
};

// Modificar datos de usuario
export const editarUsuario = async (id, datos) => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/editar/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(datos),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al editar usuario ${id}:`, error);
    throw error;
  }
};

// Eliminar un usuario
export const borrarUsuario = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/borrar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error al borrar usuario ${id}:`, error);
    throw error;
  }
};
