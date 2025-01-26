import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./Tier.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TierCreationForm from "../../../Components/OfferCreationForm/TierCreationForm";

const Tier = () => {
  const [activeTab, setActiveTab] = useState("editTier");
  const [tierFormData, setTierFormData] = useState({
    tier_id: "",
    tier_name: "",
    tier_desc: "",
    Status: "",
  });

  const [tierOptions, setTierOptions] = useState({
    tier_list: [],
    statuses: ["Active", "Inactive"],
  });

  console.log(tierOptions);

  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tier/getLoyaltyTiersInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loyalty_tier_fetch_rq: {
                header: {
                  user_name: "businessUser",
                  product: "LRS",
                  request_type: "FETCH_LOYALTY_TIER",
                },
              },
            }),
          }
        );

        const data = await response.json();
        if (data.loyalty_tier_fetch_rs?.tier_list?.length > 0) {
          setTierOptions({
            tier_list: data.loyalty_tier_fetch_rs.tier_list,
            statuses: ["Active", "Inactive"],
          });
        }
      } catch (error) {
        console.error("Error fetching tier data:", error);
        alert("Error fetching tier data. Please try again.");
      }
    };

    fetchTierData();

    // Fetch offer data from backend
  }, [tierFormData]);

  const handleTierInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tier_id") {
      const selectedTier = tierOptions.tier_list.find(
        (tier) => String(tier.tier_id) === String(value)
      );

      if (selectedTier) {
        setTierFormData({
          ...tierFormData,
          tier_id: selectedTier.tier_id,
          tier_name: selectedTier.tier_name,
          tier_desc: selectedTier.tier_desc,
          Status: selectedTier.status === "Active" ? "Active" : "Inactive",
        });
      }
    } else {
      setTierFormData({ ...tierFormData, [name]: value });
    }
  };

  const handleTierSubmit = async (e) => {
    e.preventDefault();
    console.log(" Status: ", tierFormData.Status);

    try {
      const payload = {
        loyalty_tier_crud_rq: {
          header: { user_name: "admin" },
          tier_list: [
            {
              ...tierFormData,
              Status: tierFormData.Status === "Active" ? "Active" : "Inactive",
            },
          ],
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/tier/editLoyaltyTiers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.loyalty_tier_crud_rs.status === "success") {
        toast.success("Tier Updated Successfully!");
        setTierFormData({
          tier_id: "",
          tier_name: "",
          tier_desc: "",
          Status: "",
        });
      } else {
        toast.error("Failed to update tier.");
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      toast.error("Error updating tier. Please try again.");
    }
  };

  return (
    <>
      <Header title="Tier" />
      <div className="Setup-css">
        <AdminSideBar />
        <div className="Setup-main-body">
          <div className="tab-buttons">
            <button
              className={activeTab === "editTier" ? "active" : ""}
              onClick={() => setActiveTab("editTier")}
            >
              Edit Tier
            </button>
            <button
              className={activeTab === "addTier" ? "active" : ""}
              onClick={() => setActiveTab("addTier")}
            >
              Add Tier
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "editTier" && (
              <div className="edit-tier">
                <h2>Edit Tier</h2>
                <form onSubmit={handleTierSubmit}>
                  <label>
                    Tier Name:
                    <select
                      name="tier_id"
                      value={tierFormData.tier_id}
                      onChange={handleTierInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Tier
                      </option>
                      {tierOptions.tier_list.map((tier) => (
                        <option key={tier.tier_id} value={tier.tier_id}>
                          {tier.tier_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Status:
                    <select
                      name="Status"
                      value={tierFormData.Status}
                      onChange={handleTierInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {tierOptions.statuses.map((Status) => (
                        <option key={Status} value={Status}>
                          {Status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Tier Description:
                    <textarea
                      name="tier_desc"
                      value={tierFormData.tier_desc}
                      onChange={handleTierInputChange}
                      placeholder="Enter tier description"
                      required
                    ></textarea>
                  </label>
                  <button type="setup-submit">Save Tier</button>
                </form>
              </div>
            )}
            {activeTab === "addTier" && (
              <div className="edit-offer">
                <TierCreationForm showNextButton={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tier;
