import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRole, allowedRoles }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('sessionToken');

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const rolesPermitidos = allowedRoles || (allowedRole ? [allowedRole] : []);

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
