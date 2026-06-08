import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/appContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext);

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;