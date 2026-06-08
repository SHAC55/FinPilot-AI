import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true,
});

// Response interceptor — handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stale state — the AppContext useEffect will handle redirect
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default API;