import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute =({ children, allowedRole}) => {
    const { user, loading } = useAuth();
    const token = localStorage.getItem('sessionToken');

    if(loading){
        return <div>Cargando...</div>;
    }

    if(!user || !token){
        console.log('Usuario o token no encontrado');
        return <Navigate to='/login' />
    }

    if(user.tipo_usuario !== allowedRole){
        console.log('usuario no autorizado para esta ruta');
        return <Navigate to='/' />
    }

    return children;
};

export default PrivateRoute;
