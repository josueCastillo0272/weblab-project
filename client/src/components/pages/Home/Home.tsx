import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../../../shared/types";
import Feed from "./Feed/Feed";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="feed-container">
        <Feed />
      </div>

      <Link to="/newquest" className="new-quest-fab">
        <span className="new-quest-icon">+</span>
        <span>Choose a new Quest</span>
      </Link>
    </div>
  );
}
