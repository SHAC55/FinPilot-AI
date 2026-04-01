import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useForm } from "react-hook-form";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Wallet,
  Eye,
  EyeOff,
  Key
} from "lucide-react";

const Login = () => {
  const { setToken, setUser, URL } = useContext(AppContext);
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        if (res.data.requiresVerification) {
          setUserEmail(data.email);
          setShowOtp(true);
          toast.success("OTP sent to your email. Please verify.");
        } else {
          setToken(res.data.token);
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login Successful");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpData) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${URL}/auth/verify-otp`, {
        email: userEmail,
        otp: otpData.otp,
      });

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Account verified and logged in!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: "AI-powered insights" },
    { icon: Wallet, text: "Smart budget tracking" },
    { icon: Shield, text: "Bank-level security" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Left Section - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FinPilot</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Take Control of Your<br />
              <span className="text-blue-200">Financial Future</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-12 leading-relaxed">
              Join thousands of users who are already saving money and achieving their financial goals with AI-powered insights.
            </p>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Testimonial */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
                ))}
              </div>
              <div>
                <p className="text-sm text-blue-100">
                  <span className="font-semibold text-white">10,000+</span> users trust FinPilot
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">FinPilot</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {showOtp ? "Verify Your Identity" : "Welcome Back 👋"}
              </h2>
              <p className="text-gray-500 text-sm">
                {showOtp 
                  ? "Enter the 6-digit code sent to your email" 
                  : "Sign in to continue managing your finances"}
              </p>
            </div>

            {showOtp ? (
              <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Enter 6-digit OTP"
                      {...register("otp", { 
                        required: "OTP is required", 
                        minLength: { value: 6, message: "OTP must be 6 digits" },
                        maxLength: { value: 6, message: "OTP must be 6 digits" }
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                      })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={()=>navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {!showOtp && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                  >
                    Create free account
                  </button>
                </p>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-800 text-center">
                🔐 Demo Credentials: demo@finpilot.com / demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;