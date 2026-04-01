import { createContext, useContext, useState, useEffect } from "react";
import API from "../api.js";
import toast from "react-hot-toast";

const SplitBillContext = createContext();

export const SplitBillProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  //  GET ALL BILLS
  const getBills = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/split-bills");
      setBills(data.data);
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // AUTO LOAD
  useEffect(() => {
    getBills();
  }, []);

  //  CREATE BILL
  const createBill = async (billData) => {
    try {
      const { data } = await API.post("/split-bills/create", billData);
      setBills((prev) => [data, ...prev]);
      toast.success("SplitBill created successfully!");
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  //  SETTLE PAYMENT
  const settlePayment = async (id, userId, amount) => {
    try {
      setLoading(true);

      const { data } = await API.post("/bills/settle", {
        id, // ✅ use id instead of billId
        userId,
        amount,
      });

      // 🔥 Update UI instantly
      setBills((prev) =>
        prev.map((bill) => {
          if (bill._id !== id) return bill;

          return {
            ...bill,
            splits: bill.splits.map((s) =>
              s.user?.toString() === userId?.toString()
                ? {
                    ...s,
                    amountPaid: data.split.amountPaid,
                    amountOwed: data.split.amountOwed,
                  }
                : s,
            ),
          };
        }),
      );

      toast.success("Payment settled!");
    } catch (err) {
      console.error("Settle error:", err);
      toast.error("Failed to settle payment");
    } finally {
      setLoading(false);
    }
  };

  // SUMMARY
  const getSummary = async () => {
    try {
      const { data } = await API.get("/split-bills/summary");
      setSummary(data);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  const updateBill = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/split-bills/update/${id}`, updatedData);

      console.log("Updated bill:", data.bill);

      setBills((prev) =>
        prev.map((bill) => (bill._id === id ? data.bill : bill)),
      );

      toast.success("Bill updated!");
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  const deleteBill = async (id) => {
    try {
      await API.delete(`/split-bills/${id}`);
      setBills((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  return (
    <SplitBillContext.Provider
      value={{
        bills,
        summary,
        loading,
        getBills,
        createBill,
        settlePayment,
        getSummary,
        updateBill,
        deleteBill,
      }}
    >
      {children}
    </SplitBillContext.Provider>
  );
};

export const useSplitBill = () => useContext(SplitBillContext);
