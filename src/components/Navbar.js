import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return(
        <nav>
            <Link to='/'>Inicio</Link>
            {!user && <Link to='/registro'>Registro</Link>}
            {!user && <Link to='/login'>Login</Link>}
            {user && (
                <>
                    <span>Bienvenido, {user.nombre} {user.apellidos}</span>
                    <button onClick={logout} style={{ marginLeft: '10px' }}>
                        Cerrar sesion
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;