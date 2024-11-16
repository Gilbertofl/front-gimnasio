import { BASE_URL } from "./config";

// Listar bicicletas
export const listarBicicletas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/Bicicletas/listar`);
        if(!response.ok){
            throw new Error("Error al obtener bicicletas");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al listar bicicletas:", error);
        throw error;
    }
};

// Agregar bicicletas
export const agregarBicicleta = async (bicicleta) => {
    try {
        const response = await fetch(`${BASE_URL}/Bicicletas/agregar`, {
           method: "POST",
           headers: {
            "Content-Type": "application/json",
           },
           body: JSON.stringify(bicicleta),
        });
        if(!response.ok){
            throw new Error("Error al agregar bicicleta");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al agregar bicicleta:", error);
        throw error;    
    }
}

// Editar bicicleta
export const editarBicicleta = async (id, bicicleta) => {
    try {
        const response = await fetch(`${BASE_URL}/Bicicletas/editar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bicicleta),
        });
        if (!response.ok) {
            throw new Error("Error al editar bicicleta");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al editar bicicleta:", error);
        throw error;
    }
}

// Borrar bicicleta
export const borrarBicicleta = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/Bicicletas/borrar/${id}`,  {
            method: "DELETE",
        });
        if(!response.ok){
            throw new Error("Error al borrar bicicleta");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al editar bicicleta:", error);
        throw error;
    }
}