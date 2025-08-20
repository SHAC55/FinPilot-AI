import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {

  const  URL  =  'http://localhost:5000/api' //https://finpilot-server.onrender.com/api
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([]);

  const [credit, setCredit] = useState([]);
  const [archiveCredit, setArchiveCredit] = useState([]);

  const [debit, setDebit] = useState([]);
  const [archiveDebit, setArchiveDebit] = useState([]);

  const [goals, setGoals] = useState([]);
  const [completeGoals, setCompletedGoals] = useState([]);

  const [bills, setBills] = useState([]);
  const [completedBills, setCompletedBills] = useState([]);

  const [splits,setSplits] = useState([]);
  const [completedSplits,setCompletedSplits] = useState([]);

  const creditCount  = credit.length ;
  const debitCount  =  debit.length ;  

  const  navigate =  useNavigate()
  
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setToken("");
  setUser(null); 
  navigate('/login')
};


  const deleteItem = async (endpoint, id, setState) => {
    try {
      const res = await axios.delete(
        `${URL}/${endpoint}/${id}`,
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
        `${URL}/transaction/credit/${id}`,
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
        `${URL}/transaction/getcompletedcredit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setArchiveCredit(res.data);
        // console.log("Completed credits:", res.data);
      }
    } catch (error) {
      console.error("Error fetching completed credits:", error);
    }
  };

  // DEBIT
  const markDedbitAsCompleted = async (id) => {
    try {
      const res = await axios.patch(
        `${URL}/transaction/debit/${id}`,
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
        `${URL}/transaction/getcompletedebit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setArchiveDebit(res.data);
        // console.log("Completed debits:", res.data);
      }
    } catch (error) {
      console.error("Error fetching completed credits:", error);
    }
  };

  // bills
  const markBillsAsCompleted = async (id) => {
    try {
      const res = await axios.patch(
        `${URL}/bill/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setBills((prev) => prev.filter((item) => item._id !== id));
        setCompletedBills((prev) => [...prev, res.data.data]);
      }
    } catch (error) {
      console.error("Error marking credit as completed", error);
    }
  };

  const getCompletedBills = async () => {
    try {
      const res = await axios.get(
        `${URL}/bill/completedbills`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setCompletedBills(res.data);
        // console.log("Completed Bills:", res.data);
      }
    } catch (error) {
      console.error("Error fetching completed bills:", error);
    }
  };

  // goals
  const markGoalAsCompleted = async (id) => {
  try {
    const res = await axios.patch(
      `${URL}/goal/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (res.data.success) {
      const completed = res.data.data;

      // ✅ Remove from active list
      setGoals((prev) => prev.filter((goal) => goal._id !== id));

      // ✅ Add to completed list
      setCompletedGoals((prev) => [...prev, completed]);
    }
  } catch (error) {
    console.error("Error in marking goal as completed", error);
  }
  };

  const getCompletedGoals = async () => {
  try {
    const res = await axios.get(`${URL}/goal/completedgoals`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.data) {
      setCompletedGoals(res.data);
      return res.data;   // ✅ return the data so component can use it
    }
  } catch (error) {
    console.error("Error fetching completed goals:", error);
    return [];
  }
  };

  // splits
  const markSplitAsCompleted = async (id) => {
  try {
    const res = await axios.patch(
      `${URL}/split/markcompleted/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (res.data.success) {
      const completed = res.data.data;

      // ✅ remove from active list
      setSplits((prev) => prev.filter((s) => s._id !== id));

      // ✅ add to completed list
      setCompletedSplits((prev) => [...prev, completed]);
    }
  } catch (err) {
    console.error("Error completing split:", err);
  }
};        

  const getCompletedSplits = async () => {
 try {
    const res = await axios.get(`${URL}/split/completedsplits`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.data && res.data.success) {
      setCompletedSplits(res.data.data);
      console.log(completedSplits)
    } else {
      setCompletedSplits([]);
    }
  } catch (error) {
    console.error("Error ", error);
  }
};






  // User search

  const[searchUser,setSearchUser] = useState([])
  const[participants,setParticipants] = useState([])

  const addParticipant = (reqUser) => {
    setParticipants((prev)  => {
      if(!prev.find((u) => u._id === reqUser._id)){
        return[...prev,reqUser]
      }
    })
  } 


  const value = {
    token,setToken,user,setUser,logout, // Auth
    URL,
    deleteItem, // global delete
    expenses,setExpenses, //  Expenses
    credit,setCredit,getCompletedCredit,archiveCredit,markCreditAsCompleted,creditCount ,//credit
    debit,setDebit,archiveDebit,setArchiveDebit,markDedbitAsCompleted,getCompletedDebit,debitCount, //debits
    goals,setGoals,completeGoals,setCompletedGoals,markGoalAsCompleted,getCompletedGoals, //goals
    bills,setBills,completedBills,setCompletedBills,markBillsAsCompleted,getCompletedBills, // bills
    splits,setSplits,completedSplits,setCompletedSplits,markSplitAsCompleted,getCompletedSplits,//splits
    searchUser,setSearchUser,
    participants,setParticipants,addParticipant //splits
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
