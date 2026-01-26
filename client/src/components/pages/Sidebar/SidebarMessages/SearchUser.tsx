import React from "react";
import { SearchResult } from "../../../../../../shared/types";
import "./SidebarMessages.css";

interface SearchUserProps {
  searchQuery: string;
  searchResults: SearchResult[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectUser: (userId: string) => void;
}

export default function SearchUser({
  searchQuery,
  searchResults,
  onSearchChange,
  onSelectUser,
}: SearchUserProps) {
  return (
    <div className="sm-search-box">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={onSearchChange}
        className="sm-input"
      />
      {searchResults.length > 0 && (
        <div className="sm-results">
          {searchResults.map((user) => (
            <div key={user._id} onClick={() => onSelectUser(user._id)} className="sm-result-item">
              <div
                className="sm-avatar-small"
                style={{ backgroundImage: `url(${user.profilepicture})` }}
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
