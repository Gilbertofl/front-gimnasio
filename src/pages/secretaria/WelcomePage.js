import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const WelcomePage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('sessionToken');
        console.log("Token restaurado:", token);
        
        if(!loading && (!user || user.tipo_usuario !== 'secretaria' || !token)){
            navigate('/login')
        }
    }, [user, navigate, loading]);

    if(loading){
       return <div>Cargando...</div> 
    }

    return(
        <div>
            <h1>Bienvenido secretaria</h1>
            <p>Zona para funciones del secretaria</p>
        </div>
    );
};

export default WelcomePage;