import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="error-view">
      <div className="error-overlay">
        <h1 className="error-message">
          404
          <br />
          Page not found
        </h1>
        <Link to="/home" className="error-home-link">
          Go Back to SideQuest
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
