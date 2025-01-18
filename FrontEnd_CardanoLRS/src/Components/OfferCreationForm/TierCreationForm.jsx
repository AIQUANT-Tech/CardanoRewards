import React, { useState } from "react";
import "./OfferCreationForm.css";
import { useNavigate } from "react-router-dom";

const TierCreationForm = () => {
  const [tiers, settiers] = useState([{ name: "", description: "" }]);
  const navigate = useNavigate();
  const handleAddtier = () => {
    settiers([...tiers, { name: "", description: "" }]);
  };

  const handleRemovetier = (index) => {
    const updatedtiers = tiers.filter((_, i) => i !== index);
    settiers(updatedtiers);
  };

  const handleInputChange = (index, field, value) => {
    const updatedtiers = [...tiers];
    updatedtiers[index][field] = value;
    settiers(updatedtiers);
  };

  const handleNext = () => {
    console.log("tiers Submitted:", tiers);
    navigate("/SetupPage3");
  };

  return (
    <div className="tier-form-container">
      <div className="form-section">
        <h2 className="form-subtitle">Tier Creation</h2>
        {tiers.map((tier, index) => (
          <div className="tier-row" key={index}>
            <div className="form-field-name">
              <label>Tier Name</label>
              <input
                type="text"
                placeholder="Enter tier name"
                value={tier.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="form-field-description">
              <label>Tier Description</label>
              <input
                type="text"
                placeholder="Enter tier Description"
                value={tier.description}
                onChange={(e) =>
                  handleInputChange(index, "description", e.target.value)
                }
              />
            </div>
            <div className="button-group">
              {tiers.length > 1 && (
                <button
                  className="remove-tier-button"
                  onClick={() => handleRemovetier(index)}
                >
                  −
                </button>
              )}
              {index === tiers.length - 1 && (
                <button className="add-tier-button" onClick={handleAddtier}>
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="form-navigation">
        <button className="navigation-button next-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TierCreationForm;
