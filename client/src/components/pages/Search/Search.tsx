import React, { useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../../../utilities";
import { User } from "../../../../../shared/types";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);

  const handleSearch = () => {
    get(`/api/user/search?name=${query}`).then((data) => {
      setResults(data);
    });
  };

  return (
    <div className="search-page-container">
      <h2>Find Friends</h2>
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {results.map((user) => (
          <Link key={user._id} to={`/profile/${user.username}`} className="search-result-card">
            <img src={user.profilepicture} alt={user.username} />
            <span>{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
