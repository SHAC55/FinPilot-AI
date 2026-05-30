import axios from "axios";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api.js";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const URL = "https://finpilot-ai-t81b.onrender.com/api";
  // const URL = "http://localhost:5000/api";

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

  const [searchUser, setSearchUser] = useState([]);
  const [participants, setParticipants] = useState([]);

  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/auth/me");

        if (res.data.success) {
          setUser(res.data.user);
          fetchExpenses();
        }
      } catch (err) {
        console.log("Not authenticated");
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await API.get("/transaction/get-expenses");

      setExpenses(res.data.data || []);
    } catch (err) {
      console.log("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }

    setUser(null);
    setExpenses([]);
    setGoals([]);
    navigate("/login");
  };

  const deleteItem = async (endpoint, id, setState) => {
    try {
      const res = await API.delete(`/${endpoint}/${id}`);

      if (res.data.success) {
        setState((prev) => prev.filter((item) => item._id !== id));
        toast.success("Removed Successfully");
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(`Delete ${endpoint} Error:`, error);
      toast.error("Server error while deleting");
    }
  };

  const addParticipant = (reqUser) => {
    setParticipants((prev) => {
      if (!prev.find((u) => u._id === reqUser._id)) {
        return [...prev, reqUser];
      }
      return prev;
    });
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,

    logout,

    URL,

    deleteItem,

    expenses,
    setExpenses,

    goals,
    setGoals,

    searchUser,
    setSearchUser,

    participants,
    setParticipants,
    addParticipant,

    fetchExpenses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };