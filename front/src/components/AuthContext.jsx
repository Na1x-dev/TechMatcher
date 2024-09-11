import React, { createContext, useState, useContext } from 'react';

//todo: registration

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const accessToken = localStorage.getItem('accessToken');
        return accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null; // Декодируем access-токен для получения информации о пользователе
    });
   


    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(JSON.parse(atob(accessToken.split('.')[1]))); // Обновляем состояние пользователя
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
