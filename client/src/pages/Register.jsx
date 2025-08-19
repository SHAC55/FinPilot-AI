import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({}); // store user data for later

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Register & Request OTP
  const handleRegister = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
        setUserEmail(data.email);
        setFormData(data); // store for OTP verification
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: userEmail,
        otp: data.otp,
      });

      if (res.data.success) {
        toast.success("Account verified and logged in!");
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          {otpSent ? "Verify OTP" : "Create Account"}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {otpSent
            ? `We’ve sent a code to ${userEmail}`
            : "Join FinPilot and take control of your finances"}
        </p>

        <form
          onSubmit={handleSubmit(otpSent ? handleVerifyOtp : handleRegister)}
          className="flex flex-col gap-4"
        >
          {!otpSent && (
            <>
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: true })}
                className="p-3 border border-gray-300 rounded-lg"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">Username is required</p>
              )}

              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="p-3 border border-gray-300 rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}

              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true, minLength: 6 })}
                className="p-3 border border-gray-300 rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  Password must be at least 6 characters
                </p>
              )}
            </>
          )}

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp", { required: true })}
              className="p-3 border border-gray-300 rounded-lg"
            />
          )}

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {otpSent ? "Verify OTP" : "Register"}
          </button>
        </form>

        {!otpSent && (
          <p className="text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <span
              className="text-green-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
