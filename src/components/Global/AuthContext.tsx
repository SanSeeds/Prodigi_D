// Import necessary modules from React and axios
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import config from './../../config';
 
const apiUrl = config.apiUrl;

// Define an interface for a User object
interface User {
    // The user's email address
    email: string;
}

// Define an interface for the authentication context type
interface AuthContextType {
    // The current authenticated user, or null if not authenticated
    user: User | null;
    
    // The access token for authentication, or null if not available
    accessToken: string | null;
    
    // The refresh token for obtaining a new access token, or null if not available
    refreshToken: string | null;
    
    // Function to log in a user, takes user data, access token, refresh token, and token expiry time as arguments
    login: (userData: User, accessToken: string, refreshToken: string, expiry: number) => void;
    
    // Function to log out the current user
    logout: () => void;
}

// Create a context for authentication, initially undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define interface for the props of the AuthProvider component
interface AuthProviderProps {
    // Children components that will be wrapped by the AuthProvider
    children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // State to store the current user, initially null
    const [user, setUser] = useState<User | null>(null);
    
    // State to store the access token, initially null
    const [accessToken, setAccessToken] = useState<string | null>(null);
    
    // State to store the refresh token, initially null
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // useEffect hook to load stored authentication data from local storage when the component mounts
    useEffect(() => {
        // Retrieve stored user data from local storage
        const storedUser = localStorage.getItem('user');
        
        // Retrieve stored access token from local storage
        const storedAccessToken = localStorage.getItem('accessToken');
        
        // Retrieve stored refresh token from local storage
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        // Retrieve stored token expiry time from local storage
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        // Check if all necessary data is available in local storage
        if (storedUser && storedAccessToken && storedRefreshToken && tokenExpiry) {
            // Check if the stored token has expired
            const isExpired = new Date().getTime() > parseInt(tokenExpiry, 10);
            
            // If the token has not expired, update state with stored values
            if (!isExpired) {
                setUser(JSON.parse(storedUser));
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
            } else {
                // If the token has expired, clear the stored values
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiry');
            }
        }
    }, []);

    // Function to log in a user, updates state and local storage with user data and tokens
    const login = (userData: User, accessToken: string, refreshToken: string, expiry: number) => {
        // Calculate the token expiry time in milliseconds
        const tokenExpiryTime = new Date().getTime() + expiry * 1000;
        
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store access token in local storage
        localStorage.setItem('accessToken', accessToken);
        
        // Store refresh token in local storage
        localStorage.setItem('refreshToken', refreshToken);
        
        // Store token expiry time in local storage
        localStorage.setItem('tokenExpiry', tokenExpiryTime.toString());
        
        // Update state with user data and tokens
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    // Function to log out the current user, clears state and local storage
    const logout = async () => {
        try {
            // Send a request to the server to log out the user
            await axios.post(`${apiUrl}/logout/`, {}, {
                headers: {
                    // Include the access token in the request headers for authentication
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            // Log any errors that occur during the logout request
            console.error('Error logging out:', error);
        } finally {
            // Clear user data from local storage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            
            // Clear user data and tokens from state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            
           
        }
    };

    // Return the AuthContext provider with the current state and functions as its value
    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
