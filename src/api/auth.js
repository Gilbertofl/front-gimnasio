import { BASE_URL, getAuthHeaders, handleApiResponse } from './config';

// Registro de nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};

// Inicio de sesión
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await handleApiResponse(response);

    if (data && data.sessionToken) {
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('sessionToken', data.sessionToken);
      return { ...data.usuario, sessionToken: data.sessionToken };
    } else {
      throw new Error('El backend no devolvió un sessionToken válido.');
    }
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};

// Cierre de sesión en el backend
export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Usuarios/logout`, {
      method: 'POST',
      headers: getAuthHeaders(false),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.warn('Aviso al cerrar sesión en el backend:', error);
    // No relanzamos para permitir que el logout local proceda siempre
  }
};
