import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import { useAuth } from '../src/components/AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;