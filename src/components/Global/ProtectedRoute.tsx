import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
// import Homepage from '../../Pages/Homepage';

const ProtectedRoute: React.FC<any> = ({ element, ...rest }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { accessToken } = authContext;

    if (!accessToken) {
        return <Navigate to="/signin" />;
    }

    return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
