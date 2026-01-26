import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-root">
      <div className="about-content">
        <div className="about-steps">
          <div className="step">
            <span className="step-number">01</span>
            <p>Spin the wheel.</p>
          </div>
          <div className="step">
            <span className="step-number">02</span>
            <p>Beat the quest.</p>
          </div>
          <div className="step">
            <span className="step-number">03</span>
            <p>Upload proof.</p>
          </div>
        </div>

        <p className="about-tagline">Go Sidequesting.</p>

        <Link to="/" className="about-back-btn">
          Enter SideQuest
        </Link>
      </div>
    </div>
  );
};

export default About;
