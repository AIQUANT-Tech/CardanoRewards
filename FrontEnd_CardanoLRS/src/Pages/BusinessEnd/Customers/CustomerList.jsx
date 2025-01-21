import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./CustomerList.css";
import { FilePenLine } from "lucide-react";
import Table from "../../../Components/Table/Table";
import Header from "../../../Components/Header/header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [tiers, setTiers] = useState([]); // State to hold fetched tiers
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // State for the user to be edited
  const [newTier, setNewTier] = useState(""); // State for the new tier
  const rowsPerPage = 5;

  // Fetch the loyalty tiers from the backend
  const fetchTiers = async () => {
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
              // No additional parameters needed here
            },
          }),
        }
      );
      const result = await response.json();
      if (result.loyalty_tier_fetch_rs) {
        setTiers(result.loyalty_tier_fetch_rs.tier_list);
      }
    } catch (error) {
      console.error("Error fetching loyalty tiers:", error);
    }
  };

  // Fetch the user data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/user/fetchEndUsersInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loyalty_end_users_info_rq: {
              header: {
                user_name: "businessUser",
                product: "LRS",
                request_type: "FETCH_END_USER_INFO",
              },
            },
          }),
        }
      );

      const result = await response.json();
      const userInfoList =
        result.loyalty_end_users_info_rs.user_info_list.overall_info.user_info;

      const modifiedData = userInfoList.map((user) => ({
        id: user.user_id,
        name: user.user_name + " " + user.last_name,
        email: user.email || "No Email",
        currentTier: user.tier?.tier_name || "No Tier",
        walletBalance: user.wallet_info?.ada_balance || 0,
      }));

      setData(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTiers(); // Fetch loyalty tiers on component mount
  }, []);

  const handleEdit = (id) => {
    const userToEdit = data.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setNewTier(userToEdit.currentTier); // Initialize the current tier
  };

  const handleTierChange = (e) => {
    setNewTier(e.target.value); // Update the new tier when user selects a new tier
  };

  const handleSaveChanges = async () => {
    if (!newTier) {
      alert("Please select a valid tier.");
      return;
    }

    try {
      const requestBody = {
        loyalty_end_user_edit_rq: {
          user_info_list: {
            user_info: [
              {
                user_id: String(editingUser.id), // Ensure user_id is a string
                tier: {
                  tier_id: newTier, // Correct tier_id
                },
              },
            ],
          },
        },
      };

      console.log("Request Body: ", JSON.stringify(requestBody));

      const response = await fetch(
        "http://localhost:5000/api/map/user/editEndUserInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response: ", result);

      if (result.loyalty_end_user_edit_rs.status === "success") {
        toast.success("User tier updated successfully.");
        fetchData();
        setEditingUser(null);
      } else {
        // alert("Error updating tier.");
        toast.error("Error updating tier.");
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      toast.error("Error updating tier, Pleasen Select a valid tier.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null); // Close the modal
  };

  const columns = [
    { key: "id", label: "Id" },
    { key: "name", label: "Name" },
    { key: "currentTier", label: "Tier" },
    { key: "email", label: "Email" },
    { key: "walletBalance", label: "Balance" },
  ];

  const actions = [
    {
      icon: <FilePenLine />,
      className: "edit-btn",
      onClick: handleEdit,
    },
  ];

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <Header title="Customers" />
      <ToastContainer />
      <div className="Customer-css">
        <AdminSideBar />
        <div className="Customer-main-body">
          {loading ? (
            <div className="loading-container-customer">
              <div className="loading-spinner-customer"></div>
              <h4 className="loading-text">Loading</h4>
            </div>
          ) : (
            <>
              <Table
                data={paginatedData}
                columns={columns}
                actions={actions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              {editingUser && (
                <div className="edit-tier-container">
                  <div className="edit-tier-modal">
                    <h2>Edit Tier for {editingUser.name}</h2>
                    <label htmlFor="tier-select">Select Tier:</label>
                    <select
                      id="tier-select"
                      value={newTier}
                      onChange={handleTierChange}
                    >
                      <option value="">Select Tier</option>
                      {tiers.map((tier) => (
                        <option key={tier.tier_id} value={tier.tier_id}>
                          {tier.tier_name}
                        </option>
                      ))}
                    </select>
                    <div className="edit-tier-buttons">
                      <button
                        onClick={handleSaveChanges}
                        className="footer-button"
                      >
                        Save Changes
                      </button>
                      <button onClick={handleCancel} className="footer-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerList;
