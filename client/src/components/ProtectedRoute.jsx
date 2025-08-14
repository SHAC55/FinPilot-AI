// src/routes/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import esportContext from "../context/esportContext" // ✅ adjust if context is in a different path

const ProtectedRoute = () => {
  const { token } = useContext(esportContext);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
