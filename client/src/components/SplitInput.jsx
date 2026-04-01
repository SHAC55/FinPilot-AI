import React from "react";

const SplitInput = ({ participants, splits, setSplits }) => {
  const handleChange = (userId, value) => {
    setSplits(prev => {
      const updated = prev.filter(s => s.user !== userId);
      return [...updated, { user: userId, amountOwed: Number(value) }];
    });
  };

  return (
    <div>
      <h4>Split Amount</h4>

      {participants.map(user => (
        <div key={user._id}>
          {user.username}
          <input
            type="number"
            onChange={(e) => handleChange(user._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default SplitInput;