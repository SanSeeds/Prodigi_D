import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Homepage from '../../Pages/Homepage';

const ProtectedRoute: React.FC<any> = ({ element, ...rest }) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        return <Navigate to="/signin" />;
    }

    return <Route {...rest} element={<Homepage/>} />;
};

export default ProtectedRoute;
