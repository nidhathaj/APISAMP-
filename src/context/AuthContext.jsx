import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dev Bypass: If you want to skip login during development, 
        // you can just set a dummy token in localStorage once or uncomment the line below.
        // localStorage.setItem('access_token', 'dev-token');

        const token = localStorage.getItem('access_token');
        if (token) {
            setUser({ authenticated: true, role: 'Admin', name: 'Dev User' });
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        // Dev Bypass: Try API, but if it fails (or even before), 
        // we can just succeed to allow frontend development.
        try {
            // Uncomment below to strictly use real backend
            // const { data } = await authService.login(credentials);
            // localStorage.setItem('access_token', data.access);
            // localStorage.setItem('refresh_token', data.refresh);

            // Mock success for development
            localStorage.setItem('access_token', 'mock-access-token');
            setUser({ authenticated: true, role: 'Admin', name: 'Dev User' });
            return true;
        } catch (err) {
            // Even if API fails, we'll bypass for now if you want
            console.warn('API Login failed, using dev bypass');
            localStorage.setItem('access_token', 'mock-access-token');
            setUser({ authenticated: true, role: 'Admin', name: 'Dev User' });
            return true;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
