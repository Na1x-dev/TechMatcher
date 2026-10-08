import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
const ProtectedRoute = ({ children }) => { const { isAuthenticated } = useAuth(); const location = useLocation(); return isAuthenticated() ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />; };
export default ProtectedRoute;
