// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";
import  { AppContext } from "../context/appContext";
import { useForm } from "react-hook-form";

const Login = () => {
  const { setToken, setUser } = useContext(AppContext)

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success('Login Successfull')
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
   <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f2f2f2]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="p-3 border border-gray-300 rounded text-gray-800"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">Email is required</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="p-3 border border-gray-300 rounded text-gray-800"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">Password is required</p>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
