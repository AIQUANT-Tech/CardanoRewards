import React from "react";
import "./global.css";
import First from "../../../assets/First.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/SignInPage");
  };
  return (
    <div className="main-container">
      <div className="image-container">
        <img src={First} alt="Loyalty Illustration" className="image" />
      </div>

      <div className="buttons">
        <h1 className="btn btn-business">Continue as Business User</h1>
        <button className="btn btn-continue" onClick={handleClick}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
