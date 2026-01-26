import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-root">
      <p>Home</p>
      <Link to="/newquest" className="floating-action-btn">
        Choose a new quest!
      </Link>
    </div>
  );
}
