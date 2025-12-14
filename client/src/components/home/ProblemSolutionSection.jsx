import React from "react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import "./Home.css";

const ProblemSolutionSection = () => {
  return (
    <section className="section">
      <div className="problem-solution-container">
        <div className="problem-column">
          <h3 className="column-title" style={{ color: "#d9534f" }}>
            The Problems
          </h3>
          <div className="list-item">
            <FaExclamationCircle
              className="list-icon"
              style={{ color: "#d9534f" }}
            />{" "}
            <span>Low crop prices in mandis</span>
          </div>
          <div className="list-item">
            <FaExclamationCircle
              className="list-icon"
              style={{ color: "#d9534f" }}
            />{" "}
            <span>Middlemen taking extra margin</span>
          </div>
          <div className="list-item">
            <FaExclamationCircle
              className="list-icon"
              style={{ color: "#d9534f" }}
            />{" "}
            <span>Crops wasted due to oversupply</span>
          </div>
          <div className="list-item">
            <FaExclamationCircle
              className="list-icon"
              style={{ color: "#d9534f" }}
            />{" "}
            <span>NGOs struggle with sourcing</span>
          </div>
        </div>
        <div className="solution-column">
          <h3 className="column-title" style={{ color: "#198754" }}>
            The CropShare Solution
          </h3>
          <div className="list-item">
            <FaCheckCircle className="list-icon" style={{ color: "#198754" }} />{" "}
            <span>Direct farmer-to-NGO connection</span>
          </div>
          <div className="list-item">
            <FaCheckCircle className="list-icon" style={{ color: "#198754" }} />{" "}
            <span>Quick crop listing (for sale or donation)</span>
          </div>
          <div className="list-item">
            <FaCheckCircle className="list-icon" style={{ color: "#198754" }} />{" "}
            <span>Transparent & free communication</span>
          </div>
          <div className="list-item">
            <FaCheckCircle className="list-icon" style={{ color: "#198754" }} />{" "}
            <span>Efficient, guaranteed pickup</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
