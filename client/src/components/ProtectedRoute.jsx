// src/routes/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import esportContext from "../context/esportContext" // 

const ProtectedRoute = () => {
  const { token } = useContext(esportContext);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
