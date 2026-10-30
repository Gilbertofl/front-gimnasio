export const BASE_URL = 'http://localhost:5124/api';

/**
 * Obtiene los encabezados HTTP comunes incluyendo el header sessionToken requerido por el backend.
 * @param {boolean} isJson Si es true, añade 'Content-Type': 'application/json'
 * @returns {Record<string, string>}
 */
export const getAuthHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('sessionToken');
  if (token) {
    headers['sessionToken'] = token;
  }
  return headers;
};

/**
 * Procesa la respuesta HTTP y extrae el mensaje de error o los datos JSON de manera segura.
 * @param {Response} response
 * @returns {Promise<any>}
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.detail || errorData.title;
        } else if (errorData.errors) {
          const firstKey = Object.keys(errorData.errors)[0];
          errorMessage = errorData.errors[firstKey][0] || errorMessage;
        }
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Ignorar fallo de parseo de texto
      }
    }
    throw new Error(errorMessage);
  }

  // Si no hay contenido (204 No Content), retornar null
  if (response.status === 204) {
    return null;
  }

  // Parsear JSON si la respuesta tiene contenido
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};
