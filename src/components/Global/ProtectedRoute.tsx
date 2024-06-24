import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { accessToken } = authContext;

    if (!accessToken) {
        return <Navigate to="/signin" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
