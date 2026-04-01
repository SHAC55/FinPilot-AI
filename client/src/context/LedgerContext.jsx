import { createContext, useContext, useState, useEffect } from "react";
import API from "../api.js";

const LedgerContext = createContext();

export const LedgerProvider = ({ children }) => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  //   GET ALL LEDGER ENTRIES

  const getLedger = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/ledger"); // make sure backend route exists
      setLedger(data.data);
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto load on mount
  useEffect(() => {
    getLedger();
  }, []);

  // ADD LEDGER

  const addLedger = async (ledgerData) => {
    try {
      const { data } = await API.post("/ledger/add", ledgerData);
      setLedger((prev) => [data.data, ...prev]);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  // DELETE LEDGER

  const deleteLedger = async (id) => {
    try {
      await API.delete(`/ledger/delete/${id}`);
      setLedger((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };


    //  MARK AS COMPLETED
   
  const markLedgerCompleted = async (id) => {
    try {
      const { data } = await API.patch(`/ledger/complete/${id}`);

      setLedger((prev) =>
        prev.map((item) => (item._id === id ? data.data : item)),
      );
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (
    <LedgerContext.Provider
      value={{
        ledger,
        loading,
        getLedger,
        addLedger,
        deleteLedger,
        markLedgerCompleted,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => useContext(LedgerContext);
