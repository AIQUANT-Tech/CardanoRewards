// import React, { useState } from "react";
// import "./OfferCreationForm.css";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
// import "react-toastify/dist/ReactToastify.css"; // Importing styles for the toast

// const OfferCreationForm = () => {
//   const [offers, setOffers] = useState([{ name: "", description: "" }]);
//   const [isLoading, setIsLoading] = useState(false); // New state for loading
//   const [showLoadingContainer, setShowLoadingContainer] = useState(false);
//   const navigate = useNavigate();

//   const handleAddOffer = () => {
//     setOffers([...offers, { name: "", description: "" }]);
//   };

//   const handleRemoveOffer = (index) => {
//     const updatedOffers = offers.filter((_, i) => i !== index);
//     setOffers(updatedOffers);
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedOffers = [...offers];
//     updatedOffers[index][field] = value;
//     setOffers(updatedOffers);
//   };

//   const handleNext = () => {
//     navigate("/SetupPage2");
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true); // Show loading container
//     setShowLoadingContainer(true);
//     console.log("Offers Submitted:", offers);
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/offers/createLoyaltyOffers",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             loyalty_offer_crud_rq: {
//               offer_list: offers.map((offer) => ({
//                 offer_name: offer.name,
//                 offer_desc: offer.description,
//                 status: "Active", // Set the status as needed (Active or Inactive)
//               })),
//               header: {
//                 user_name: "yourUserNameHere", // Replace with actual username if needed
//               },
//             },
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Offers submitted successfully!"); // Success message
//         setTimeout(() => {
//           // navigate("/SetupPage2");
//           setShowLoadingContainer(false);
//         }, 2500);
//       } else {
//         toast.error(`Error: ${data.loyalty_offer_crud_rs.message}`);
//         setShowLoadingContainer(false);
//       }
//     } catch (error) {
//       console.error("Error sending offers to backend:", error);
//       toast.error("An error occurred while submitting the offers!"); // Catch error
//       setShowLoadingContainer(false);
//     } finally {
//       setIsLoading(false); // Hide loading container after operation completes
//     }
//   };

//   return (
//     <div className="offer-form-container">
//       <div className="form-section">
//         <h2 className="form-subtitle">Offer Creation</h2>
//         {offers.map((offer, index) => (
//           <div className="offer-row" key={index}>
//             <div className="form-field-name">
//               <label>Offer Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter offer name"
//                 value={offer.name}
//                 onChange={(e) =>
//                   handleInputChange(index, "name", e.target.value)
//                 }
//               />
//             </div>
//             <div className="form-field-description">
//               <label>Offer Description</label>
//               <input
//                 type="text"
//                 placeholder="Enter offer Description"
//                 value={offer.description}
//                 onChange={(e) =>
//                   handleInputChange(index, "description", e.target.value)
//                 }
//               />
//             </div>
//             <div className="button-group">
//               {offers.length > 1 && (
//                 <button
//                   className="remove-offer-button"
//                   onClick={() => handleRemoveOffer(index)}
//                 >
//                   −
//                 </button>
//               )}
//               {index === offers.length - 1 && (
//                 <button className="add-offer-button" onClick={handleAddOffer}>
//                   +
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="form-navigation">
//         <button
//           className="navigation-button next-button"
//           onClick={handleSubmit}
//           disabled={isLoading} // Disable the button while loading
//         >
//           {isLoading ? "Submitting..." : "Submit"}
//         </button>
//         <button
//           className="navigation-button next-button"
//           onClick={handleNext}
//           disabled={isLoading}
//         >
//           Next
//         </button>
//       </div>

//       {/* Loading Container */}
//       {showLoadingContainer && (
//         <div className="loading-overlay">
//           <div className="loading-container">
//             <div className="loading-spinner"></div>
//             <p>Submitting Offers...</p>
//           </div>
//         </div>
//       )}

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={true}
//       />
//     </div>
//   );
// };

// export default OfferCreationForm;

import React, { useState } from "react";
import "./OfferCreationForm.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importing styles for the toast

const OfferCreationForm = ({ showNextButton = true }) => {
  // Add prop with default value
  const [offers, setOffers] = useState([{ name: "", description: "" }]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [showLoadingContainer, setShowLoadingContainer] = useState(false);
  const navigate = useNavigate();

  const handleAddOffer = () => {
    setOffers([...offers, { name: "", description: "" }]);
  };

  const handleRemoveOffer = (index) => {
    const updatedOffers = offers.filter((_, i) => i !== index);
    setOffers(updatedOffers);
  };

  const handleInputChange = (index, field, value) => {
    const updatedOffers = [...offers];
    updatedOffers[index][field] = value;
    setOffers(updatedOffers);
  };

  const handleNext = () => {
    navigate("/SetupPage2");
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Show loading container
    setShowLoadingContainer(true);
    console.log("Offers Submitted:", offers);
    try {
      const response = await fetch(
        "http://localhost:5000/api/offers/createLoyaltyOffers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loyalty_offer_crud_rq: {
              offer_list: offers.map((offer) => ({
                offer_name: offer.name,
                offer_desc: offer.description,
                status: "Active", // Set the status as needed (Active or Inactive)
              })),
              header: {
                user_name: "yourUserNameHere", // Replace with actual username if needed
              },
            },
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Offers submitted successfully!"); // Success message
        setOffers([{ name: "", description: "" }]);
        setTimeout(() => {
          // navigate("/SetupPage2");
          setShowLoadingContainer(false);
        }, 2500);
      } else {
        toast.error(`Error: ${data.loyalty_offer_crud_rs.message}`);
        setShowLoadingContainer(false);
      }
    } catch (error) {
      console.error("Error sending offers to backend:", error);
      toast.error("An error occurred while submitting the offers!"); // Catch error
      setShowLoadingContainer(false);
    } finally {
      setIsLoading(false); // Hide loading container after operation completes
    }
  };

  return (
    <div className="offer-form-container">
      <div className="form-section">
        <h2 className="form-subtitle">Offer Creation</h2>
        {offers.map((offer, index) => (
          <div className="offer-row" key={index}>
            <div className="offer-form-field">
              <div className="form-field-name">
                <label>Offer Name</label>
                <input
                  type="text"
                  placeholder="Enter offer name"
                  value={offer.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="form-field-description">
                <label>Offer Description</label>
                <input
                  type="text"
                  placeholder="Enter offer Description"
                  value={offer.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="button-group">
              {offers.length > 1 && (
                <button
                  className="remove-offer-button"
                  onClick={() => handleRemoveOffer(index)}
                >
                  −
                </button>
              )}
              {index === offers.length - 1 && (
                <button className="add-offer-button" onClick={handleAddOffer}>
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
          onClick={handleSubmit}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        {showNextButton && ( // Conditionally render the "Next" button
          <button
            className="navigation-button next-button"
            onClick={handleNext}
            disabled={isLoading}
          >
            Next
          </button>
        )}
      </div>

      {/* Loading Container */}
      {showLoadingContainer && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Submitting Offers...</p>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
      />
    </div>
  );
};

export default OfferCreationForm;
