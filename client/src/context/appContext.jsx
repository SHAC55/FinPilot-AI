import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until first /me check done
  const [loading, setLoading] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [participants, setParticipants] = useState([]);

  const navigate = useNavigate();

  // ─── Bootstrap: check session on mount ───────────────────────────────────
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  // ─── Listen for global 401 events (from API interceptor) ─────────────────
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setExpenses([]);
      setGoals([]);
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  }, [navigate]);

  // ─── Expenses ─────────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/transaction/get-expenses");
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch expenses once when user is set
  useEffect(() => {
    if (user) fetchExpenses();
  }, [user, fetchExpenses]);

  // ─── Generic delete helper ────────────────────────────────────────────────
  const deleteItem = useCallback(async (endpoint, id, setState) => {
    try {
      const res = await API.delete(`/${endpoint}/${id}`);
      if (res.data.success) {
        setState((prev) => prev.filter((item) => item._id !== id));
        toast.success("Removed successfully");
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch {
      toast.error("Server error while deleting");
    }
  }, []);

  // ─── Participants (split / group features) ────────────────────────────────
  const addParticipant = useCallback((reqUser) => {
    setParticipants((prev) =>
      prev.find((u) => u._id === reqUser._id) ? prev : [...prev, reqUser],
    );
  }, []);

  const value = {
    // auth
    user,
    setUser,
    authLoading,
    logout,
    // ui
    loading,
    setLoading,
    // data
    expenses,
    setExpenses,
    fetchExpenses,
    goals,
    setGoals,
    // participants
    searchUser,
    setSearchUser,
    participants,
    setParticipants,
    addParticipant,
    // helpers
    deleteItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Convenience hook
export const useApp = () => useContext(AppContext);
