// src/context/DebitContext.jsx

import { createContext, useState } from "react";
import { DebitAPI } from "../services/api";

export const DebitContext = createContext();

export const DebitProvider = ({ children }) => {
  const [debit, setDebit] = useState([]);
  const [archiveDebit, setArchiveDebit] = useState([]);

  const markCompleted = async (id) => {
    try {
      const res = await DebitAPI.markCompleted(id);

      if (res.data.success) {
        setDebit((prev) => prev.filter((i) => i._id !== id));
        setArchiveDebit((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await DebitAPI.getCompleted();
      setArchiveDebit(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DebitContext.Provider
      value={{
        debit,
        setDebit,
        archiveDebit,
        markCompleted,
        fetchCompleted,
      }}
    >
      {children}
    </DebitContext.Provider>
  );
};