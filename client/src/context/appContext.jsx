import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { getArchivedDebit } from "../../../server/controller/transactionController";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([]);

  const [credit, setCredit] = useState([]);
  const [archiveCredit, setArchiveCredit] = useState([]);

  const [debit, setDebit] = useState([]);
  const [archiveDebit, setArchiveDebit] = useState([]);

  const [goals, setGoals] = useState([])


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  

  const deleteItem = async (endpoint, id, setState) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/${endpoint}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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

  // CREDIT
  const markCreditAsCompleted = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/transaction/credit/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setCredit((prev) => prev.filter((item) => item._id !== id));
        setArchiveCredit((prev) => [...prev, res.data.data]);
      }
    } catch (error) {
      console.error("Error marking credit as completed", error);
    }
  };

  const getCompletedCredit = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/transaction/getcompletedcredit",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setArchiveCredit(res.data);
        console.log("Completed credits:", res.data);
      }
    } catch (error) {
      console.error("Error fetching completed credits:", error);
    }
  };

  // DEBIT
  const markDedbitAsCompleted = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/transaction/debit/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setDebit((prev) => prev.filter((item) => item._id !== id));
        setArchiveCredit((prev) => [...prev, res.data.data]);
      }
    } catch (error) {
      console.error("Error marking credit as completed", error);
    }
  };

  const getCompletedDebit = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/transaction/getcompletedebit",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setArchiveDebit(res.data);
        console.log("Completed debits:", res.data);
      }
    } catch (error) {
      console.error("Error fetching completed credits:", error);
    }
  };

 


  const value = {
    token,setToken,user,setUser,logout, // Auth
    deleteItem,  // global delete
    expenses,setExpenses, //  Expenses
    credit,setCredit,getCompletedCredit, archiveCredit,markCreditAsCompleted, //credit
    debit,setDebit,archiveDebit,setArchiveDebit,markDedbitAsCompleted,getArchivedDebit,getCompletedDebit, //debits
    goals,setGoals,//goals
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
