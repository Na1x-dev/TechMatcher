import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Basket from "./pages/Basket";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const App = () => <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/basket" element={<Basket />} />
  <Route path="/smartphones/:id" element={<Product />} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/headphones" element={<Navigate to="/" replace />} />
  <Route path="/fitness-bracelets" element={<Navigate to="/" replace />} />
  <Route path="/chargers" element={<Navigate to="/" replace />} />
  <Route path="*" element={<NotFound />} />
</Routes>;
export default App;
