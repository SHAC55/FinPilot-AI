// src/context/CreditContext.jsx

import { createContext, useState } from "react";
import { CreditAPI } from "../services/api";

export const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
  const [credit, setCredit] = useState([]);
  const [archiveCredit, setArchiveCredit] = useState([]);

  const markCompleted = async (id) => {
    try {
      const res = await CreditAPI.markCompleted(id);

      if (res.data.success) {
        setCredit((prev) => prev.filter((i) => i._id !== id));
        setArchiveCredit((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await CreditAPI.getCompleted();
      setArchiveCredit(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CreditContext.Provider
      value={{
        credit,
        setCredit,
        archiveCredit,
        markCompleted,
        fetchCompleted,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};