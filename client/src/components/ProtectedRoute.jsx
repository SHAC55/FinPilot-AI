import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/appContext";

/**
 * Wraps protected routes.
 * - While the initial /auth/me check is in-flight → show a spinner
 * - If authenticated  → render children (Outlet)
 * - If not            → redirect to /login
 */
const ProtectedRoute = () => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;