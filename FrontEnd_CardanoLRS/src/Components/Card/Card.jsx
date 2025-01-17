import React from "react";
import "./Card.css";

const Card = ({ icon, primaryText, secondaryText, backgroundColor }) => {
  return (
    <div className="Card" style={{ backgroundColor }}>
      <div className="Icon">{icon}</div>
      <div className="Text-container">
        <div className="Primarytext">{primaryText}</div>
        <div className="Primarytext">{secondaryText}</div>
      </div>
    </div>
  );
};

export default Card;
