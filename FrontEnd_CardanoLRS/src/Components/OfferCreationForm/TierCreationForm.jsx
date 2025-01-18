import React, { useState } from "react";
import "./OfferCreationForm.css"; // Ensure this file is correctly styled
import { useNavigate } from "react-router-dom";

const TierCreationForm = () => {
  const [tiers, setTiers] = useState([{ name: "", description: "" }]);
  const [loading, setLoading] = useState(false); // For loading spinner
  const navigate = useNavigate();

  // Add a new tier
  const handleAddTier = () => {
    setTiers([...tiers, { name: "", description: "" }]);
  };

  // Remove an existing tier
  const handleRemoveTier = (index) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
  };

  // Handle input change for a specific tier
  const handleInputChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
  };

  // Submit tiers to the backend API
  const handleNext = async () => {
    try {
      setLoading(true); // Show loading spinner
      const requestBody = {
        loyalty_tier_crud_rq: {
          tier_list: tiers.map((tier) => ({
            tier_name: tier.name,
            tier_desc: tier.description,
            status: "Active", // Default status, customize if needed
          })),
          header: {
            user_name: "test_user", // Replace with real user data
          },
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/tier/createLoyaltyTiers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.loyalty_tier_crud_rs.status === "success") {
        console.log("Tiers submitted successfully!");
        navigate("/SetupPage3"); // Navigate to the next page
      } else {
        console.error("Failed to submit tiers");
        alert("Failed to submit tiers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting tiers:", error);
      alert("An error occurred while submitting tiers. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
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
                placeholder="Enter tier description"
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
                  onClick={() => handleRemoveTier(index)}
                >
                  −
                </button>
              )}
              {index === tiers.length - 1 && (
                <button className="add-tier-button" onClick={handleAddTier}>
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="form-navigation">
        <button
          className="navigation-button next-button"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default TierCreationForm;
