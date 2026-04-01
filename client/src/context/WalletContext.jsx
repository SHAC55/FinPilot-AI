import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import API from "../api.js";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  //  Get all wallets
  const getWallets = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/wallet/allwallets");
      setWallets(data.wallets);
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // autoload wallets on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getWallets();
    }
  }, []);

  //  Create wallet
  const createWallet = async (walletData) => {
    try {
      const { data } = await API.post("/wallet/create", walletData);
      setWallets((prev) => [data.wallet, ...prev]);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  //  Update wallet
  const updateWallet = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/wallet/${id}`, updatedData);

      setWallets((prev) => prev.map((w) => (w._id === id ? data.wallet : w)));
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  //  Delete wallet
  const deleteWallet = async (id) => {
    try {
      await API.delete(`/wallet/${id}`);
      setWallets((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  // Get transactions by wallet
  const getTransactionsByWallet = async (walletId) => {
    try {
      const { data } = await API.get(`/wallet/transactions/${walletId}`);
      setTransactions(data.transactions);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        loading,
        getWallets,
        createWallet,
        updateWallet,
        deleteWallet,
        transactions,
        getTransactionsByWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
