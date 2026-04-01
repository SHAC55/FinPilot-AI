import React, { createContext, useContext, useState } from "react";
import API from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  //  Forgot Password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Error sending reset link" };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Error resetting password" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        forgotPassword,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);