// src/context/SplitContext.jsx

import { createContext, useState } from "react";

export const SplitContext = createContext();

export const SplitProvider = ({ children }) => {
  const [splits, setSplits] = useState([]);
  const [completedSplits, setCompletedSplits] = useState([]);

  const [participants, setParticipants] = useState([]);

  const addParticipant = (user) => {
    setParticipants((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  return (
    <SplitContext.Provider
      value={{
        splits,
        setSplits,
        completedSplits,
        setCompletedSplits,
        participants,
        addParticipant,
      }}
    >
      {children}
    </SplitContext.Provider>
  );
};