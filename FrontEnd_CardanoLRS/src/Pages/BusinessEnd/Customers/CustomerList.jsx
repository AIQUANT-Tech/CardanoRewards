import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./CustomerList.css";
import { FilePenLine, Trash2 } from "lucide-react";
import Table from "../../../Components/Table/Table";
import Header from "../../../Components/Header/header";

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;

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
        email: user.email || "No Email", // Ensure email is handled properly
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
  }, []);

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
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
      <div className="Customer-css">
        <AdminSideBar />
        <div className="Customer-main-body">
          {loading ? (
            <div className="loading-container-customer">
              <div className="loading-spinner-customer"></div>
              <h4 className="loading-text">Loading</h4>
            </div>
          ) : (
            <Table
              data={paginatedData}
              columns={columns}
              actions={actions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerList;

// import React, { useState, useEffect } from "react";
// import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
// import "./CustomerList.css";
// import { FilePenLine, Trash2 } from "lucide-react";
// import Table from "../../../Components/Table/Table";
// import Header from "../../../Components/Header/header";

// const CustomerList = () => {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
//   const [editModalOpen, setEditModalOpen] = useState(false); // Control the modal visibility
//   const [updatedTier, setUpdatedTier] = useState(""); // Track the updated tier
//   const rowsPerPage = 5;

//   // Function to fetch data from the backend
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         "http://localhost:5000/api/user/fetchEndUsersInfo",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             loyalty_end_users_info_rq: {
//               header: {
//                 user_name: "businessUser",
//                 product: "LRS",
//                 request_type: "FETCH_END_USER_INFO",
//               },
//             },
//           }),
//         }
//       );

//       const result = await response.json();
//       const userInfoList =
//         result.loyalty_end_users_info_rs.user_info_list.overall_info.user_info;

//       const modifiedData = userInfoList.map((user) => ({
//         id: user.user_id,
//         name: user.user_name + " " + user.last_name,
//         email: user.email || "No Email",
//         currentTier: user.tier?.tier_name || "No Tier",
//         walletBalance: user.wallet_info?.ada_balance || 0,
//       }));

//       setData(modifiedData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle editing a user's tier
//   const handleEdit = (user) => {
//     console.log("Editing user:", user); // Debugging step
//     setSelectedUser(user); // Set the selected user to the state
//     setUpdatedTier(user.currentTier); // Pre-fill the selected tier in the modal
//     setEditModalOpen(true); // Open the edit modal
//   };

//   const handleSaveChanges = async () => {
//     if (!updatedTier) {
//       alert("Please select a valid tier.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/tier/editLoyaltyTiers",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             loyalty_tier_crud_rq: {
//               header: {
//                 user_name: "adminUser", // Assuming you're using "adminUser" for this action
//               },
//               tier_list: [
//                 {
//                   tier_id: selectedUser.id, // Assuming user id is tier_id here
//                   tier_name: updatedTier,
//                   tier_desc: "Updated tier description", // You can add logic for a tier description if needed
//                   Status: "Active", // You can add logic for the status too (Active/Inactive)
//                 },
//               ],
//             },
//           }),
//         }
//       );

//       const result = await response.json();
//       if (result.loyalty_tier_crud_rs.status === "success") {
//         alert("Tier updated successfully.");
//         setEditModalOpen(false); // Close the modal on success
//         fetchData(); // Re-fetch the data to reflect the changes
//       } else {
//         alert("Failed to update the tier.");
//       }
//     } catch (error) {
//       console.error("Error updating tier:", error);
//       alert("Error updating tier.");
//     }
//   };

//   const columns = [
//     { key: "id", label: "Id" },
//     { key: "name", label: "Name" },
//     { key: "currentTier", label: "Tier" },
//     { key: "email", label: "Email" },
//     { key: "walletBalance", label: "Balance" },
//   ];

//   const actions = [
//     {
//       icon: <FilePenLine />,
//       className: "edit-btn",
//       onClick: (user) => handleEdit(user),
//     },
//   ];

//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const paginatedData = data.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <>
//       <Header title="Customers" />
//       <div className="Customer-css">
//         <AdminSideBar />
//         <div className="Customer-main-body">
//           {loading ? (
//             <div className="loading-container-customer">
//               <div className="loading-spinner-customer"></div>
//               <h4 className="loading-text">Loading</h4>
//             </div>
//           ) : (
//             <Table
//               data={paginatedData}
//               columns={columns}
//               actions={actions}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//             />
//           )}
//         </div>
//       </div>

//       {/* Edit Tier Modal */}
//       {editModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Edit Tier for {selectedUser?.name}</h2>
//             <label>
//               Select Tier:
//               <select
//                 value={updatedTier}
//                 onChange={(e) => setUpdatedTier(e.target.value)}
//               >
//                 <option value="Silver">Silver</option>
//                 <option value="Gold">Gold</option>
//                 <option value="Platinum">Platinum</option>
//               </select>
//             </label>
//             <div className="modal-actions">
//               <button onClick={handleSaveChanges}>Save</button>
//               <button onClick={() => setEditModalOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CustomerList;
