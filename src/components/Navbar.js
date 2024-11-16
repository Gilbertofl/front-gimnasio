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
                    <Link to='/secretaria/inicio'>inicio</Link>
                    <Link to='/secretaria/bicicletas'>Bicicletas</Link>
                    <button onClick={logout} style={{ marginLeft: '10px' }}>
                        Cerrar sesion
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;