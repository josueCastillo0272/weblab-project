import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../../shared/types";
import "./Home.css";

export default function Home() {
  const { user } = useOutletContext<AuthContext>();

  return (
    <div className="home-container">
      {/* Video Feed */}
      <div className="feed-container">
        <h1>Welcome, {user?.name || "Traveler"}</h1>
        <p style={{ color: "#666" }}>Your journey begins here.</p>

        {/* Placeholder for feed content */}
        <div className="feed-item">
          <h3>Recent Activity</h3>
          <p>No new updates yet.</p>
        </div>
      </div>

      {/* "Choose a New Quest" Button (Bottom Right) */}
      <Link to="/newquest" className="new-quest-fab">
        <span className="new-quest-icon">+</span>
        <span>Choose a new Quest</span>
      </Link>
    </div>
  );
}
