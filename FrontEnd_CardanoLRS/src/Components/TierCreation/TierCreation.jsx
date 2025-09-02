import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TierCreation.css";
import  API_BASE_URL  from "../../config.js";

const TierCreation = ({ showNext = true }) => {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [tierOffers, setTierOffers] = useState({});
  const [loading, setLoading] = useState(false); // Loading for the handleNext action
  const [initialLoading, setInitialLoading] = useState(true); // Loading for the initial fetch

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tierResponse = await fetch(
          `${API_BASE_URL}/api/tier/getLoyaltyTiersInfo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyalty_tier_fetch_rq: { header: {} } }),
          }
        );

        const offerResponse = await fetch(
          `${API_BASE_URL}/api/offers/getLoyaltyOfferInfo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyalty_offer_fetch_rq: { header: {} } }),
          }
        );

        const tierData = await tierResponse.json();
        const offerData = await offerResponse.json();

        setTiers(tierData.loyalty_tier_fetch_rs.tier_list || []);
        setOffers(offerData.loyalty_offer_fetch_rs.offer_list || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch tiers or offers. Please try again.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddOffer = () => {
    if (!selectedTier) {
      toast.error("Please select a Tier.");
      return;
    }

    if (!selectedOffer) {
      toast.error("Please select an Offer.");
      return;
    }

    const selectedTierObj = tiers.find(
      (tier) => String(tier.tier_id) === String(selectedTier)
    );

    if (!selectedTierObj) {
      toast.error("Selected tier not found.");
      return;
    }

    const tierName = selectedTierObj.tier_name;

    let isAlreadyAdded = false; // Track if the offer is already added

    setTierOffers((prev) => {
      const updated = { ...prev };

      if (!updated[selectedTier]) {
        updated[selectedTier] = { tierName, offers: [] };
      }

      // Check if the offer is already added
      if (updated[selectedTier].offers.includes(selectedOffer)) {
        isAlreadyAdded = true;
      } else {
        updated[selectedTier].offers.push(selectedOffer);
      }

      return updated;
    });

    // Show the toast based on the updated state
    if (isAlreadyAdded) {
      toast.warn("This offer is already added to this tier.");
    } else {
      toast.success("Offer added to the tier!", { position: "top-right" });
    }

    setSelectedOffer("");
  };

  const handleNext = async () => {
    const mappings = Object.entries(tierOffers).flatMap(([tierId, data]) =>
      data.offers.map((offer) => ({
        tier_id: tierId,
        offer_id: offer,
        Status: "A",
      }))
    );

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/map/mappingLoyaltyOffersTiers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loyalty_offer_tier_mapping_rq: {
              mapping_info_offer_tier: mappings,
              header: { user_name: "businessuser" },
            },
          }),
        }
      );

      const data = await response.json();

      if (data.loyalty_offer_tier_mapping_rs.status === "success") {
        toast.success("Mapping saved successfully!", { position: "top-right" });
        // Navigate after 4 seconds
      } else {
        toast.error("Failed to save the mapping. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting mappings:", error);
      toast.error("An error occurred while submitting the mapping.");
    } finally {
      setTimeout(() => setLoading(false), 4000); // Stop loading after 4 seconds
    }
  };

  if (initialLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="tier-creation-container">
      <ToastContainer autoClose={2000} pauseOnHover={false} />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Submitting...</p>
          </div>
        </div>
      )}

      <div className="tier-creation-section">
        <h2>Tier and Offer Mapping</h2>
        <div className="input-group">
          <div className="input-field">
            <label>Tier Name</label>
            <select
              className="select-dropdown"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="">Select Tier</option>
              {tiers.map((tier) => (
                <option key={tier.tier_id} value={tier.tier_id}>
                  {tier.tier_name}
                </option>
              ))}
            </select>
          </div>
          <div className="offer-field">
            <label>Offer Name</label>
            <div className="dropdown-container">
              <select
                className="select-dropdown"
                value={selectedOffer}
                onChange={(e) => setSelectedOffer(e.target.value)}
              >
                <option value="">Select Offer</option>
                {offers.map((offer) => (
                  <option key={offer.offer_id} value={offer.offer_id}>
                    {offer.offer_name}
                  </option>
                ))}
              </select>
              <button className="add-btn" onClick={handleAddOffer}>
                <CirclePlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="added-tiers-section">
        <h3>Mapped Tiers and Offers</h3>
        {Object.keys(tierOffers).length > 0 ? (
          <table className="tier-offer-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Offers</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tierOffers).map(([tierId, data], index) => (
                <tr key={index}>
                  <td>{data.tierName}</td>
                  <td>
                    {data.offers
                      .map(
                        (offerId) =>
                          offers.find((offer) => offer.offer_id === offerId)
                            ?.offer_name || "Unknown Offer"
                      )
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tiers and offers mapped yet.</p>
        )}
      </div>

      <div className="button-group">
        {showNext && (
          <button className="back-btn" onClick={() => navigate("/SetupPage4")}>
            Next
          </button>
        )}

        <button className="next-btn" onClick={handleNext}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TierCreation;
