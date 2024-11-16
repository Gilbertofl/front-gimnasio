import { BASE_URL } from "./config";

// funcion para registro de nuevo usuario
export const registerUser = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/Usuarios/registrar`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar el usuario');
      }

      return await response.json();

    } catch(error){
        console.error('Error en RegisterUser:', error);
        throw error;
    }
};

// Funcion para el inicio de sesion
export const loginUser = async (loginData) => {
    try {
        const response = await fetch(`${BASE_URL}/Usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if(!response.ok){
            throw new Error('Credenciales incorrectas');
        }

        const data = await response.json();
        console.log('Respues del back:', data);

        //Guarda el usuario y el sessionToken
        if (data && data.sessionToken) {
            localStorage.setItem('user', JSON.stringify(data.usuario));
            localStorage.setItem('sessionToken', data.sessionToken)
            console.log("token desde auth", data.sessionToken); 
            return { ...data.usuario, sessionToken: data.sessionToken};
        } else {
            throw new Error('No se recibió sessionToken');
        }


    } catch(error){
        console.error('Error en loginUser:', error);
        throw error;
    }
}