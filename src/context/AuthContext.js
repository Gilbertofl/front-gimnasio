import React, { createContext, useState, useContext, useEffect } from "react";
import { logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedSessionToken = localStorage.getItem('sessionToken');

      if (storedUser && storedSessionToken) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          const userWithToken = { ...parsed, sessionToken: storedSessionToken };
          setUser(userWithToken);
        }
      }
    } catch (e) {
      console.error("Error al restaurar la sesión desde localStorage:", e);
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.sessionToken) {
      localStorage.setItem('sessionToken', userData.sessionToken);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignorar si el backend falla al cerrar
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
