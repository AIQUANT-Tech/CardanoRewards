// import React, { useState, useEffect } from "react";
// import { CirclePlus, CircleMinus } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify"; // Import Toastify
// import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
// import "./RewardRules.css";
// import { useNavigate } from "react-router-dom";

// const RewardRules = () => {
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([{ amount: "", percentage: "", tier: "" }]);
//   const [tiers, setTiers] = useState([]);
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

//   useEffect(() => {
//     const fetchTiers = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/tier/getLoyaltyTiersInfo",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ loyalty_tier_fetch_rq: { header: {} } }),
//           }
//         );
//         const tierData = await response.json();
//         console.log("Fetched tiers:", tierData); // Log the response to check the structure

//         // Assuming the correct response structure
//         setTiers(tierData.loyalty_tier_fetch_rs.tier_list || []);
//       } catch (error) {
//         console.error("Error fetching tiers:", error);
//         toast.error("Failed to fetch tiers. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTiers();
//   }, []);

//   const handleBack = () => {
//     navigate("/SetupPage3");
//   };

//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const newRows = [...rows];

//     if (name === "tier") {
//       // Find the selected tier details
//       const selectedTier = tiers.find((tier) => tier.tier_id === value);
//       newRows[index][name] = value; // Set the tier_id
//       newRows[index]["tier_name"] = selectedTier?.tier_name || ""; // Set the tier_name
//     } else {
//       newRows[index][name] = value;
//     }

//     setRows(newRows);
//   };

//   const handleAddRow = () => {
//     setRows([...rows, { amount: "", percentage: "", tier: "" }]);
//   };

//   const handleRemoveRow = (index) => {
//     const newRows = rows.filter((_, i) => i !== index);
//     setRows(newRows);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true); // Show loading indicator

//     const rewardRulesData = {
//       loyalty_rule_setup_with_tier_rq: {
//         header: {
//           user_name: "user1",
//           product: "product1",
//           request_type: "LOYALTY_RULE_SETUP_SAVE",
//         },
//         tier_wise_loyalty_rule_setup: {
//           tier_wise_loyalty_rule_list: rows.map((row) => ({
//             tier_id: row.tier,
//             rule_desc: "Rule's Description", // Example description
//             conversion_rules: [
//               {
//                 min_revenue: row.amount,
//                 max_revenue: null,
//                 percentage_rate: row.percentage,
//               },
//             ],
//           })),
//         },
//       },
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/rule/saveTierwiseRuleSetup",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(rewardRulesData),
//         }
//       );
//       const data = await response.json();

//       if (data.loyalty_rule_setup_with_tier_rs.status === "success") {
//         toast.success("Tier-wise reward rules saved successfully!");
//         setTimeout(() => {
//           navigate("/SignInPage"); // Redirect after 3 seconds
//         }, 3000);
//       } else {
//         toast.error("Failed to save tier-wise reward rules.");
//       }
//     } catch (error) {
//       console.error("Error saving tier-wise rules:", error);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false); // Hide loading indicator
//     }
//   };

//   return (
//     <div className="reward-rules-container">
//       <ToastContainer /> {/* Toastify container */}
//       <div className="reward-rules">
//         <h1>Reward Rules</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="form-container">
//             {rows.map((row, index) => (
//               <div key={index} className="form-row row-layout">
//                 <div className="input-group-cur">
//                   <label htmlFor={`currency-${index}`}>Cur</label>
//                   <div className="currency-input-container">
//                     <span className="input-prefix">USD</span>
//                   </div>
//                 </div>

//                 <div className="input-group-amount">
//                   <label htmlFor={`amount-${index}`}>Min Amount</label>
//                   <input
//                     type="number"
//                     id={`amount-${index}`}
//                     name="amount"
//                     placeholder="Enter Amount"
//                     value={row.amount}
//                     onChange={(e) => handleInputChange(e, index)}
//                   />
//                 </div>

//                 <div className="input-group-percentage">
//                   <label htmlFor={`percentage-${index}`}>%</label>
//                   <input
//                     type="number"
//                     id={`percentage-${index}`}
//                     name="percentage"
//                     placeholder="%"
//                     value={row.percentage}
//                     onChange={(e) => handleInputChange(e, index)}
//                   />
//                 </div>

//                 <div className="input-group-tier">
//                   <label htmlFor={`tier-${index}`}>Tier Name</label>
//                   <select
//                     id={`tier-${index}`}
//                     name="tier"
//                     value={row.tier}
//                     onChange={(e) => handleInputChange(e, index)}
//                   >
//                     <option value="">Select</option>
//                     {loading ? (
//                       <option disabled>Loading tiers...</option>
//                     ) : (
//                       tiers.map((tier) => (
//                         <option key={tier.tier_id} value={tier.tier_id}>
//                           {tier.tier_name}
//                         </option>
//                       ))
//                     )}
//                   </select>
//                 </div>

//                 <div className="button-container">
//                   <button
//                     type="button"
//                     className="remove-button"
//                     onClick={() => handleRemoveRow(index)}
//                   >
//                     <CircleMinus size={20} />
//                   </button>
//                   {index === rows.length - 1 && (
//                     <button
//                       type="button"
//                       className="add-button"
//                       onClick={handleAddRow}
//                     >
//                       <CirclePlus size={20} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="form-actions">
//             <button type="button" className="back-button" onClick={handleBack}>
//               Back
//             </button>
//             <button
//               type="submit"
//               className="submit-button"
//               disabled={isSubmitting} // Disable button while submitting
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RewardRules;

import React, { useState, useEffect } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import "./RewardRules.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RewardRules = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([{ amount: "", percentage: "", tier: "" }]);
  const [submittedRows, setSubmittedRows] = useState([]); // Keep track of rows added via +
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state for loading indicator

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tier/getLoyaltyTiersInfo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyalty_tier_fetch_rq: { header: {} } }),
          }
        );
        const tierData = await response.json();
        setTiers(tierData.loyalty_tier_fetch_rs.tier_list || []);
      } catch (error) {
        console.error("Error fetching tiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleBack = () => {
    navigate("/SetupPage3");
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRows = [...rows];

    if (name === "tier") {
      // Find the selected tier details
      const selectedTier = tiers.find((tier) => tier.tier_id === value);
      newRows[index][name] = value; // Set the tier_id
      newRows[index]["tier_name"] = selectedTier?.tier_name || ""; // Set the tier_name
    } else {
      newRows[index][name] = value;
    }

    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { amount: "", percentage: "", tier: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rewardRulesData = {
      loyalty_rule_setup_with_tier_rq: {
        header: {
          user_name: "user1",
          product: "product1",
          request_type: "LOYALTY_RULE_SETUP_SAVE",
        },
        tier_wise_loyalty_rule_setup: {
          tier_wise_loyalty_rule_list: rows.map((row) => ({
            tier_id: row.tier,
            rule_desc: "Rule's Description", // Example description
            conversion_rules: [
              {
                min_revenue: row.amount,
                max_revenue: null,
                percentage_rate: row.percentage,
              },
            ],
          })),
        },
      },
    };

    try {
      setIsSubmitting(true); // Show loading indicator
      const response = await fetch(
        "http://localhost:5000/api/rule/saveTierwiseRuleSetup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rewardRulesData),
        }
      );
      const data = await response.json();

      if (data.loyalty_rule_setup_with_tier_rs.status === "success") {
        toast.success("Tier-wise reward rules saved successfully!"); // Success message
        setTimeout(() => {
          navigate("/SignInPage"); // Redirect after 3 seconds
        }, 3000);
      } else {
        toast.error("Failed to save tier-wise reward rules."); // Error message
      }
    } catch (error) {
      console.error("Error saving tier-wise rules:", error);
      toast.error("Error saving tier-wise reward rules."); // Error message
    } finally {
      setIsSubmitting(false); // Hide loading indicator
    }
  };

  return (
    <div className="reward-rules-container">
      <div className="reward-rules">
        <h1>Reward Rules</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {rows.map((row, index) => (
              <div key={index} className="form-row row-layout">
                <div className="input-group-cur">
                  <label htmlFor={`currency-${index}`}>Cur</label>
                  <div className="currency-input-container">
                    <span className="input-prefix">USD</span>
                  </div>
                </div>

                <div className="input-group-amount">
                  <label htmlFor={`amount-${index}`}>Min Amount</label>
                  <input
                    type="number"
                    id={`amount-${index}`}
                    name="amount"
                    placeholder="Enter Amount"
                    value={row.amount}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="input-group-percentage">
                  <label htmlFor={`percentage-${index}`}>%</label>
                  <input
                    type="number"
                    id={`percentage-${index}`}
                    name="percentage"
                    placeholder="%"
                    value={row.percentage}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="input-group-tier">
                  <label htmlFor={`tier-${index}`}>Tier Name</label>
                  <select
                    id={`tier-${index}`}
                    name="tier"
                    value={row.tier}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    <option value="">Select</option>
                    {loading ? (
                      <option disabled>Loading tiers...</option>
                    ) : (
                      tiers.map((tier) => (
                        <option key={tier.tier_id} value={tier.tier_id}>
                          {tier.tier_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="button-container">
                  {index !== 0 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <CircleMinus size={20} />
                    </button>
                  )}
                  {index === rows.length - 1 && (
                    <button
                      type="button"
                      className="add-button"
                      onClick={handleAddRow}
                    >
                      <CirclePlus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting} // Disable the button while submitting
            >
              Submit
            </button>
          </div>
        </form>

        {/* Loading Indicator Pop-up */}
        {isSubmitting && (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Submitting...</p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default RewardRules;
