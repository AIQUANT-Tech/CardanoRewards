// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { CirclePlus } from "lucide-react";
// import "./TierCreation.css";

// const TierCreation = () => {
//   const navigate = useNavigate();
//   const [tiers, setTiers] = useState([]);
//   const [offers, setOffers] = useState([]);
//   const [selectedTier, setSelectedTier] = useState("");
//   const [selectedOffer, setSelectedOffer] = useState("");
//   const [tierOffers, setTierOffers] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch tiers and offers from the backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const tierResponse = await fetch(
//           "http://localhost:5000/api/tier/getLoyaltyTiersInfo",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ loyalty_tier_fetch_rq: { header: {} } }),
//           }
//         );

//         const offerResponse = await fetch(
//           "http://localhost:5000/api/offers/getLoyaltyOfferInfo",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ loyalty_offer_fetch_rq: { header: {} } }),
//           }
//         );

//         const tierData = await tierResponse.json();
//         const offerData = await offerResponse.json();

//         setTiers(tierData.loyalty_tier_fetch_rs.tier_list || []);
//         setOffers(offerData.loyalty_offer_fetch_rs.offer_list || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         alert("Failed to fetch tiers or offers. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAddOffer = () => {
//     if (!selectedTier) {
//       alert("Please select a Tier.");
//       return;
//     }
//     if (!selectedOffer) {
//       alert("Please select an Offer.");
//       return;
//     }

//     setTierOffers((prev) => {
//       const updated = { ...prev };
//       if (!updated[selectedTier]) {
//         updated[selectedTier] = [];
//       }
//       if (!updated[selectedTier].includes(selectedOffer)) {
//         updated[selectedTier].push(selectedOffer);
//       } else {
//         alert("This offer is already added to this tier.");
//       }
//       return updated;
//     });

//     setSelectedOffer("");
//   };

//   const handleNext = async () => {
//     const mappings = Object.entries(tierOffers).flatMap(([tier, offers]) =>
//       offers.map((offer) => ({
//         tier_id: tier,
//         offer_id: offer,
//         Status: "Active",
//       }))
//     );

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/map/mappingLoyaltyOffersTiers",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             loyalty_offer_tier_mapping_rq: {
//               mapping_info_offer_tier: mappings,
//               header: { user_name: "admin" },
//             },
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.loyalty_offer_tier_mapping_rs.status === "success") {
//         alert("Mapping saved successfully!");
//         navigate("/nextPage");
//       } else {
//         alert("Failed to save the mapping. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting mappings:", error);
//       alert("An error occurred while submitting the mapping.");
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="tier-creation-container">
//       <div className="tier-creation-section">
//         <h2>Tier and Offer Mapping</h2>
//         <div className="input-group">
//           <div className="input-field">
//             <label>Tier Name</label>
//             <select
//               className="select-dropdown"
//               value={selectedTier}
//               onChange={(e) => setSelectedTier(e.target.value)}
//             >
//               <option value="">Select Tier</option>
//               {tiers.map((tier) => (
//                 <option key={tier.tier_id} value={tier.tier_id}>
//                   {tier.tier_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="offer-field">
//             <label>Offer Name</label>
//             <div className="dropdown-container">
//               <select
//                 className="select-dropdown"
//                 value={selectedOffer}
//                 onChange={(e) => setSelectedOffer(e.target.value)}
//               >
//                 <option value="">Select Offer</option>
//                 {offers.map((offer) => (
//                   <option key={offer.offer_id} value={offer.offer_id}>
//                     {offer.offer_name}
//                   </option>
//                 ))}
//               </select>
//               <button className="add-btn" onClick={handleAddOffer}>
//                 <CirclePlus />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="added-tiers-section">
//         <h3>Mapped Tiers and Offers</h3>
//         {Object.keys(tierOffers).length > 0 ? (
//           <table className="tier-offer-table">
//             <thead>
//               <tr>
//                 <th>Tier</th>
//                 <th>Offers</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(tierOffers).map(([tierId, offerIds], index) => {
//                 // Find the tier name by its ID
//                 const tier = tiers.find((t) => t.tier_id === tierId);
//                 console.log("Tier:", tier);

//                 const tierName = tier ? tier.tier_name : "Unknown Tier";

//                 // Find the offer names by their IDs
//                 const offerNames = offerIds
//                   .map(
//                     (offerId) =>
//                       offers.find((o) => o.offer_id === offerId)?.offer_name ||
//                       "Unknown Offer"
//                   )
//                   .join(", ");

//                 return (
//                   <tr key={index}>
//                     <td>{tierName}</td>
//                     <td>{offerNames}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <p>No tiers and offers mapped yet.</p>
//         )}
//       </div>

//       <div className="button-group">
//         <button className="back-btn" onClick={() => navigate("/previousPage")}>
//           Back
//         </button>
//         <button className="next-btn" onClick={handleNext}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TierCreation;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import "./TierCreation.css";

const TierCreation = () => {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(""); // Tier selected
  const [selectedOffer, setSelectedOffer] = useState(""); // Offer selected
  const [tierOffers, setTierOffers] = useState({}); // Store selected tier-offer mappings
  const [loading, setLoading] = useState(true);

  // Fetch tiers and offers from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tierResponse = await fetch(
          "http://localhost:5000/api/tier/getLoyaltyTiersInfo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyalty_tier_fetch_rq: { header: {} } }),
          }
        );

        const offerResponse = await fetch(
          "http://localhost:5000/api/offers/getLoyaltyOfferInfo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyalty_offer_fetch_rq: { header: {} } }),
          }
        );

        const tierData = await tierResponse.json();
        const offerData = await offerResponse.json();

        // console.log("Fetched tiers:", tierData); // Debug log
        // console.log("Fetched offers:", offerData); // Debug log

        setTiers(tierData.loyalty_tier_fetch_rs.tier_list || []);
        setOffers(offerData.loyalty_offer_fetch_rs.offer_list || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch tiers or offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add the selected offer to the selected tier
  const handleAddOffer = () => {
    if (!selectedTier) {
      alert("Please select a Tier.");
      return;
    }
    console.log("Selected Tier:", selectedTier);

    if (!selectedOffer) {
      alert("Please select an Offer.");
      return;
    }

    console.log("Selected Offer:", selectedOffer);

    const selectedTierObj = tiers.find(
      (tier) => String(tier.tier_id) === String(selectedTier)
    );

    console.log("Selected Tier Object:", selectedTierObj);

    if (!selectedTierObj) {
      alert("Selected tier not found.");
      return;
    }

    const tierName = selectedTierObj.tier_name;

    // Add offer to tierOffers state
    setTierOffers((prev) => {
      const updated = { ...prev };
      if (!updated[selectedTier]) {
        updated[selectedTier] = { tierName, offers: [] };
      }
      if (!updated[selectedTier].offers.includes(selectedOffer)) {
        updated[selectedTier].offers.push(selectedOffer);
      } else {
        alert("This offer is already added to this tier.");
      }
      return updated;
    });

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

    try {
      const response = await fetch(
        "http://localhost:5000/api/map/mappingLoyaltyOffersTiers",
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
      console.log("Data", data);

      if (data.loyalty_offer_tier_mapping_rs.status === "success") {
        alert("Mapping saved successfully!");
        navigate("/SetupPage4");
      } else {
        alert("Failed to save the mapping. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting mappings:", error);
      alert("An error occurred while submitting the mapping.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="tier-creation-container">
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
        <button className="back-btn" onClick={() => navigate("/previousPage")}>
          Back
        </button>
        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TierCreation;
