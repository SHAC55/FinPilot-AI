import React, { useState } from "react";
import API from "../api.js";

const UserSearch = ({ setParticipants }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchUsers = async (value) => {
    setQuery(value);
    const { data } = await API.get(`/auth/search?email=${value}`);
    setResults(data.data);
  };

  const addUser = (user) => {
    setParticipants(prev => [...prev, user]);
    setResults([]);
    setQuery("");
  };

  return (
    <div>
      <input
        placeholder="Search user"
        value={query}
        onChange={e => searchUsers(e.target.value)}
      />

      {results.map(user => (
        <div key={user._id} onClick={() => addUser(user)}>
          {user.username} ({user.email})
        </div>
      ))}
    </div>
  );
};

export default UserSearch;