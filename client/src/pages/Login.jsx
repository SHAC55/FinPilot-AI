import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useForm } from "react-hook-form";

const Login = () => {
  const { setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://finpilot-ai-backend.onrender.com/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        if (res.data.requiresVerification) {
          setUserEmail(data.email);
          setShowOtp(true);
          toast("OTP sent to your email. Please verify.");
        } else {
          setToken(res.data.token);
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login Successful");
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleVerifyOtp = async (otpData) => {
    try {
      const res = await axios.post("https://finpilot-ai-backend.onrender.com/api/auth/verify-otp", {
        email: userEmail,
        otp: otpData.otp,
      });

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Account verified and logged in!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-r from-green-50 to-green-100">
      <div className="hidden md:flex flex-1 items-center justify-center bg-green-700 text-white p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 leading-snug">
            Manage your finances <br /> with confidence
          </h1>
          <p className="text-lg opacity-90">
            FinPilot helps you track expenses, plan budgets, and achieve your goals.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {showOtp ? "Verify OTP" : "Welcome Back 👋"}
          </h2>

          {showOtp ? (
            <form onSubmit={handleSubmit(handleVerifyOtp)} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", { required: true, minLength: 6 })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm">OTP must be 6 digits</p>
              )}

              <button
                type="submit"
                className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}

              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}

              <button
                type="submit"
                className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Login
              </button>
            </form>
          )}

          {!showOtp && (
            <p className="text-center text-gray-500 text-sm mt-6">
              Don’t have an account?{" "}
              <span
                className="text-green-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
