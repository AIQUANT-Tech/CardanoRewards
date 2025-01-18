import React, { useState } from "react";
import "./TierCreation.css";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
const TierCreation = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [offers, setOffers] = useState([
    "Offer 1",
    "Offer 2",
    "Offer 3",
    "Offer 4",
    "Offer 5",
  ]);
  const [tierOffers, setTierOffers] = useState({}); // To store Tier-Offer mapping

  const tiers = ["Silver", "Gold", "Platinum"]; // Predefined tiers

  // Function to handle adding offers with tier-based limitations
  const handleAddOffer = () => {
    if (!selectedTier) {
      alert("Please select a Tier.");
      return;
    }

    if (!selectedOffer) {
      alert("Please select an Offer to add.");
      return;
    }

    // Define the maximum number of offers for each tier
    const tierLimit = {
      Silver: 2,
      Gold: 3,
      Platinum: Infinity, // No limit for Platinum
    };

    // Check if the number of offers for the selected tier exceeds the limit
    const currentOffersCount = tierOffers[selectedTier]?.length || 0;

    if (currentOffersCount >= tierLimit[selectedTier]) {
      alert(
        `You can only select a maximum of ${tierLimit[selectedTier]} offers for ${selectedTier} tier.`
      );
      return;
    }

    // Proceed to add the offer if it's not already in the list for the given tier
    setTierOffers((prev) => {
      const updatedTierOffers = { ...prev };
      if (!updatedTierOffers[selectedTier]) {
        updatedTierOffers[selectedTier] = [];
      }

      // Add the offer if it's not already in the list for the given tier
      if (!updatedTierOffers[selectedTier].includes(selectedOffer)) {
        updatedTierOffers[selectedTier].push(selectedOffer);
      } else {
        alert("This offer is already added to this tier.");
      }

      return updatedTierOffers;
    });

    setSelectedOffer(""); // Reset the offer dropdown
  };

  const handleNext = () => {
    navigate("/SetupPage4");
  };

  const handleBack = () => {
    navigate("/SetupPage2");
  };

  return (
    <div className="tier-creation-container">
      <div className="tier-creation-section">
        <h2>Tier Mapping</h2>
        <div className="input-group">
          {/* Tier Name Dropdown */}
          <div className="input-field">
            <label>Tier Name</label>
            <select
              className="select-dropdown"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="">Select Tier</option>
              {tiers.map((tier, index) => (
                <option key={index} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          {/* Offer Name Dropdown */}
          <div className="input-field offer-field">
            <label>Offer Name</label>
            <div className="dropdown-container">
              <select
                className="select-dropdown"
                value={selectedOffer}
                onChange={(e) => setSelectedOffer(e.target.value)}
              >
                <option value="">Select Offer</option>
                {offers.map((offer, index) => (
                  <option key={index} value={offer}>
                    {offer}
                  </option>
                ))}
              </select>
              <button className="add-btn" onClick={handleAddOffer}>
                <CirclePlus />
              </button>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {/* Right Section: Added Tiers and Offers */}
      <div className="added-tiers-section">
        <h3>Added Tiers and Offers</h3>
        {Object.keys(tierOffers).length > 0 ? (
          <table className="tier-offer-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Offers</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tierOffers).map((tier, index) => (
                <tr key={index}>
                  <td>{tier}</td>
                  <td>{tierOffers[tier].join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tiers or offers added yet.</p>
        )}
      </div>
    </div>
  );
};

export default TierCreation;
