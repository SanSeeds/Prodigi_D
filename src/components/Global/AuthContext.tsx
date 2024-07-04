import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (userData: User, accessToken: string, refreshToken: string, expiry: number) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        if (storedUser && storedAccessToken && storedRefreshToken && tokenExpiry) {
            const isExpired = new Date().getTime() > parseInt(tokenExpiry, 10);
            if (!isExpired) {
                setUser(JSON.parse(storedUser));
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiry');
            }
        }
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string, expiry: number) => {
        const tokenExpiryTime = new Date().getTime() + expiry * 1000;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('tokenExpiry', tokenExpiryTime.toString());
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const logout = async () => {
        try {
            await axios.post('/logout/', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            window.location.href = '/'; // Redirect to home page or login page
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
