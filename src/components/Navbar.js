import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconLogo } from "./Icons";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const esSecretariaOAdmin = user && (user.tipo_usuario === "secretaria" || user.tipo_usuario === "admin");
  const esCliente = user && user.tipo_usuario === "cliente";

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border-color)",
      padding: "0 24px",
      marginBottom: "32px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{
        maxWidth: "1150px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px"
      }}>
        {/* Brand / Logo */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1.25rem",
          letterSpacing: "-0.025em"
        }}>
          <span style={{
            background: "linear-gradient(135deg, var(--accent-primary), #3b82f6)",
            color: "#0f172a",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <IconLogo size={20} color="#0f172a" />
          </span>
          <span>CYCLE<span style={{ color: "var(--accent-primary)" }}>FLOW</span></span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Link
            to="/"
            style={{
              color: isActive("/") ? "var(--accent-primary)" : "var(--text-muted)",
              textDecoration: "none",
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 500,
              fontSize: "0.9rem",
              backgroundColor: isActive("/") ? "rgba(6, 182, 212, 0.1)" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            Inicio
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                style={{
                  color: isActive("/login") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  backgroundColor: isActive("/login") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="btn btn-sm"
                style={{ marginLeft: "8px" }}
              >
                Registrarse
              </Link>
            </>
          )}

          {esCliente && (
            <>
              <Link
                to="/cliente/inicio"
                style={{
                  color: isActive("/cliente/inicio") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  backgroundColor: isActive("/cliente/inicio") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Mi Perfil y Membresía
              </Link>
              <Link
                to="/cliente/reservaciones"
                style={{
                  color: isActive("/cliente/reservaciones") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  backgroundColor: isActive("/cliente/reservaciones") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Reservar Clases
              </Link>
            </>
          )}

          {esSecretariaOAdmin && (
            <>
              <Link
                to="/secretaria/inicio"
                style={{
                  color: isActive("/secretaria/inicio") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/inicio") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Panel
              </Link>
              <Link
                to="/secretaria/reservaciones"
                style={{
                  color: isActive("/secretaria/reservaciones") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/reservaciones") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Reservaciones
              </Link>
              <Link
                to="/secretaria/bicicletas"
                style={{
                  color: isActive("/secretaria/bicicletas") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/bicicletas") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Bicicletas
              </Link>
              <Link
                to="/secretaria/horarios"
                style={{
                  color: isActive("/secretaria/horarios") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/horarios") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Horarios
              </Link>
              <Link
                to="/secretaria/membresias"
                style={{
                  color: isActive("/secretaria/membresias") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/membresias") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Membresías
              </Link>
              <Link
                to="/secretaria/usuarios"
                style={{
                  color: isActive("/secretaria/usuarios") ? "var(--accent-primary)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  backgroundColor: isActive("/secretaria/usuarios") ? "rgba(6, 182, 212, 0.1)" : "transparent"
                }}
              >
                Usuarios
              </Link>
            </>
          )}
        </nav>

        {/* User Badge / Logout */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem" }}>
                {user.nombre} {user.apellidos}
              </div>
              <div style={{ color: "var(--accent-primary)", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600 }}>
                {user.tipo_usuario}
              </div>
            </div>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
