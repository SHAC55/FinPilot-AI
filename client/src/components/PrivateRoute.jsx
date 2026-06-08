import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/appContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AppContext);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;