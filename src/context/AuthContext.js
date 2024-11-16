import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedSessionToken = localStorage.getItem('sessionToken');
        
        if(storedUser && storedSessionToken){
            const userWithToken = { ...JSON.parse(storedUser), sessionToken: storedSessionToken };
            console.log("usuario restaurado:", userWithToken);
            setUser(userWithToken);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('sessionToken', userData.sessionToken);
        console.log("token desde authcontext:", userData.sessionToken);
        console.log("Datos del usuario en login:", userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
    };

    return(
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
