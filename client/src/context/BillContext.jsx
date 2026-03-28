// src/context/BillContext.jsx

import { createContext, useState } from "react";
import { BillAPI } from "../services/api";

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [completedBills, setCompletedBills] = useState([]);

  const markCompleted = async (id) => {
    try {
      const res = await BillAPI.markCompleted(id);

      if (res.data.success) {
        setBills((prev) => prev.filter((i) => i._id !== id));
        setCompletedBills((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await BillAPI.getCompleted();
      setCompletedBills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BillContext.Provider
      value={{
        bills,
        setBills,
        completedBills,
        markCompleted,
        fetchCompleted,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};