// src/services/api.js

import axios from "axios";

// 🔧 Base Config
const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies with requests
});


export default API;
