import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../api.js";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const URL = "https://finpilot-server.onrender.com/api";
  // const URL = `http://localhost:5000/api`;

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([]);

   useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchExpenses();
    }
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/transaction/get-expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(res.data.data || []);
    } catch (err) {
      console.log("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  };

 
  const [goals, setGoals] = useState([]);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    navigate("/login");
  };

  const deleteItem = async (endpoint, id, setState) => {
    try {
      const res = await axios.delete(`${URL}/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  // User search

  const [searchUser, setSearchUser] = useState([]);
  const [participants, setParticipants] = useState([]);

  const addParticipant = (reqUser) => {
    setParticipants((prev) => {
      if (!prev.find((u) => u._id === reqUser._id)) {
        return [...prev, reqUser];
      }
    });
  };

  const value = {
    token,
    setToken,
    user,
    setUser,
    logout, // Auth
    URL,
    deleteItem, // global delete
    expenses,
    setExpenses, //  Expenses
    goals,
    setGoals, //goals
    searchUser,
    setSearchUser,
    participants,
    setParticipants,
    addParticipant, //splits
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
