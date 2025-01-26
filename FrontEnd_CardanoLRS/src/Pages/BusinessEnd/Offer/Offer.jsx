import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";

import "./Offer.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfferCreationForm from "../../../Components/OfferCreationForm/OfferCreationForm";

const Offer = () => {
  const [activeTab, setActiveTab] = useState("editOffer");

  const [offerFormData, setOfferFormData] = useState({
    offer_id: "",
    offer_name: "",
    offer_desc: "",
    status: "",
  });

  const [offerOptions, setOfferOptions] = useState({
    offer_list: [],
    statuses: ["Active", "Inactive"],
  });

  console.log(offerOptions);

  useEffect(() => {
    // Fetch offer data from backend
    const fetchOfferData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/offers/getLoyaltyOfferInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loyalty_offer_fetch_rq: {
                header: {
                  user_name: "businessUser",
                  product: "LRS",
                  request_type: "FETCH_LOYALTY_OFFER",
                },
              },
            }),
          }
        );

        const data = await response.json();
        if (data.loyalty_offer_fetch_rs?.offer_list?.length > 0) {
          setOfferOptions({
            offer_list: data.loyalty_offer_fetch_rs.offer_list,
            statuses: ["Active", "Inactive"], // Static for now; change as needed
          });
        }
      } catch (error) {
        console.error("Error fetching offer data:", error);
        alert("Error fetching offer data. Please try again.");
      }
    };

    fetchOfferData();
  }, [offerFormData]);

  const handleOfferInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "offer_id") {
      const selectedOffer = offerOptions.offer_list.find(
        (offer) => String(offer.offer_id) === String(value)
      );

      // Update the form data if a matching offer is found
      if (selectedOffer) {
        setOfferFormData({
          ...offerFormData,
          offer_id: selectedOffer.offer_id,
          offer_name: selectedOffer.offer_name,
          offer_desc: selectedOffer.offer_desc,
          status: selectedOffer.status === "Active" ? "Active" : "Inactive",
        });
      }
    } else {
      setOfferFormData({ ...offerFormData, [name]: value });
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        loyalty_offer_crud_rq: {
          header: {
            user_name: "businessUser",
            product: "LRS",
            request_type: "EDIT_LOYALTY_OFFER",
          },
          offer_list: [
            {
              ...offerFormData,
              status: offerFormData.status === "Active" ? "A" : "I",
            },
          ],
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/offers/editLoyaltyOffers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.loyalty_offer_crud_rs.status === "success") {
        toast.success("Offer updated successfully!");
        setOfferFormData({
          offer_id: "",
          offer_name: "",
          offer_desc: "",
          status: "",
        });
      } else {
        toast.error("Failed to update offer.");
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Error updating offer. Please try again.");
    }
  };

  return (
    <>
      <Header title="Offer" />
      <div className="Setup-css">
        <AdminSideBar />
        <div className="Setup-main-body">
          <div className="tab-buttons">
            <button
              className={activeTab === "editOffer" ? "active" : ""}
              onClick={() => setActiveTab("editOffer")}
            >
              Edit Offer
            </button>
            <button
              className={activeTab === "addOffer" ? "active" : ""}
              onClick={() => setActiveTab("addOffer")}
            >
              Add Offer
            </button>
          </div>
          <div className="offer-tab-content">
            {activeTab === "editOffer" && (
              <div className="edit-offer">
                <h2>Edit Offer</h2>
                <form onSubmit={handleOfferSubmit}>
                  <label>
                    Offer Name:
                    <select
                      name="offer_id"
                      value={offerFormData.offer_id}
                      onChange={handleOfferInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Offer
                      </option>
                      {offerOptions.offer_list.map((offer) => (
                        <option key={offer.offer_id} value={offer.offer_id}>
                          {offer.offer_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Status:
                    <select
                      name="Status"
                      value={offerFormData.status}
                      onChange={handleOfferInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {offerOptions.statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Offer Description:
                    <textarea
                      name="offer_desc"
                      value={offerFormData.offer_desc}
                      onChange={handleOfferInputChange}
                      placeholder="Enter offer description"
                      required
                    ></textarea>
                  </label>
                  <button type="setup-submit">Save Offer</button>
                </form>
              </div>
            )}
            {activeTab === "addOffer" && (
              <div className="add-offer">
                <OfferCreationForm showNextButton={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Offer;
