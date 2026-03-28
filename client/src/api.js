// src/services/api.js

import axios from "axios";

// 🔧 Base Config
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//  Attach Token Automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// AUTH APIs
// =======================
export const AuthAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
};

// =======================
// 💳 CREDIT APIs
// =======================
export const CreditAPI = {
  markCompleted: (id) => API.patch(`/transaction/credit/${id}`),
  getCompleted: () => API.get(`/transaction/getcompletedcredit`),
};

// =======================
// 💸 DEBIT APIs
// =======================
export const DebitAPI = {
  markCompleted: (id) => API.patch(`/transaction/debit/${id}`),
  getCompleted: () => API.get(`/transaction/getcompletedebit`),
};

// =======================
// 🧾 BILL APIs
// =======================
export const BillAPI = {
  markCompleted: (id) => API.patch(`/bill/${id}`),
  getCompleted: () => API.get(`/bill/completedbills`),
};

export default API;