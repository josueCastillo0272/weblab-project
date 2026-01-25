import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">Sorry, this page is not available</h1>
        <Link to="/home" className="notfound-back">
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
