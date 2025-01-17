// import React, { useState } from "react";

// import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
// import "./CustomerList.css";

// import { FilePenLine, Trash2 } from "lucide-react";
// import Table from "../../../Components/Table/Table";
// import Header from "../../../Components/Header/header";

// const CustomerList = () => {
//   const data = [
//     {
//       id: 1,
//       name: "Souvagya Das",
//       email: "souvagyadas56@gmail.com",
//       phone: "7364820802",
//       status: "Active",
//     },
//     {
//       id: 2,
//       name: "Srijit Sarkar",
//       email: "srijitsarkar@gmail.com",
//       phone: "7364820803",
//       status: "Active",
//     },
//     {
//       id: 3,
//       name: "John Doe",
//       email: "johndoe@gmail.com",
//       phone: "1234567890",
//       status: "Inactive",
//     },
//     {
//       id: 4,
//       name: "Jane Smith",
//       email: "janesmith@gmail.com",
//       phone: "9876543210",
//       status: "Active",
//     },
//     {
//       id: 5,
//       name: "Alice Johnson",
//       email: "alicej@gmail.com",
//       phone: "5551234567",
//       status: "Active",
//     },
//     {
//       id: 6,
//       name: "Bob Brown",
//       email: "bobb@gmail.com",
//       phone: "6669876543",
//       status: "Inactive",
//     },
//     {
//       id: 7,
//       name: "Charlie White",
//       email: "charliewhite@gmail.com",
//       phone: "7776543210",
//       status: "Active",
//     },
//     {
//       id: 8,
//       name: "David Green",
//       email: "davidgreen@gmail.com",
//       phone: "8889876543",
//       status: "Inactive",
//     },
//     {
//       id: 9,
//       name: "Eve Blue",
//       email: "eveblue@gmail.com",
//       phone: "9991234567",
//       status: "Active",
//     },
//     {
//       id: 10,
//       name: "Frank Black",
//       email: "frankblack@gmail.com",
//       phone: "1011121314",
//       status: "Inactive",
//     },
//     {
//       id: 11,
//       name: "Grace Yellow",
//       email: "graceyellow@gmail.com",
//       phone: "2022233344",
//       status: "Active",
//     },
//     {
//       id: 12,
//       name: "Hank Red",
//       email: "hankred@gmail.com",
//       phone: "3033344455",
//       status: "Inactive",
//     },
//     {
//       id: 13,
//       name: "Isla Pink",
//       email: "islapink@gmail.com",
//       phone: "4044455566",
//       status: "Active",
//     },
//     {
//       id: 14,
//       name: "Jack Purple",
//       email: "jackpurple@gmail.com",
//       phone: "5055566677",
//       status: "Inactive",
//     },
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   const handleEdit = (id) => {
//     alert(`Edit user with ID: ${id}`);
//   };

//   const handleDelete = (id) => {
//     alert(`Delete user with ID: ${id}`);
//   };

//   const columns = [
//     { key: "id", label: "Id" },
//     { key: "name", label: "Name" },
//     { key: "email", label: "Email" },
//     { key: "walletAddress", label: "Wallet" },
//     { key: "status", label: "Status" },
//   ];

//   const actions = [
//     {
//       icon: <FilePenLine />,
//       className: "edit-btn",
//       onClick: handleEdit,
//     },
//     {
//       icon: <Trash2 />,
//       className: "delete-btn",
//       onClick: handleDelete,
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
//           <Table
//             data={paginatedData}
//             columns={columns}
//             actions={actions}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomerList;

// import React, { useState, useEffect } from "react";

// import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
// import "./CustomerList.css";

// import { FilePenLine, Trash2 } from "lucide-react";
// import Table from "../../../Components/Table/Table";
// import Header from "../../../Components/Header/header";

// const CustomerList = () => {
//   const [data, setData] = useState([]); // Initialize empty state for data
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   // Function to fetch data from the backend
//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/user/fetchEndUsersInfo"
//       ); // Replace with your actual backend API endpoint
//       const result = await response.json();
//       const userInfoList =
//         result.loyalty_end_users_info_rs.user_info_list.overall_info.user_info;

//       // Modify the data to combine first and last names and include wallet address
//       const modifiedData = userInfoList.map((user) => ({
//         id: user.user_id,
//         name: `${user.user_name}`, // Concatenate first and last name
//         //walletAddress: user.walletAddress || "No Wallet", // Use wallet address here
//         // status: user.status || "Active",
//         currentTier: user.tier?.tier_name || "No Tier", // Show current tier
//         walletBalance: user.wallet_info?.ada_balance || 0,
//       }));

//       setData(modifiedData); // Set the fetched data to the state
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData(); // Fetch the data when the component mounts
//   }, []);

//   const handleEdit = (id) => {
//     alert(`Edit user with ID: ${id}`);
//   };

//   const handleDelete = (id) => {
//     alert(`Delete user with ID: ${id}`);
//   };

//   const columns = [
//     { key: "id", label: "Id" },
//     { key: "name", label: "Name" },
//     { key: "currentTier", label: "Tier" }, // Changed to Wallet Address
//     { key: "walletBalance", label: "Balance" }, // Assuming phone field exists
//     // { key: "status", label: "Status" },
//   ];

//   const actions = [
//     {
//       icon: <FilePenLine />,
//       className: "edit-btn",
//       onClick: handleEdit,
//     },
//     {
//       icon: <Trash2 />,
//       className: "delete-btn",
//       onClick: handleDelete,
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
//           <Table
//             data={paginatedData}
//             columns={columns}
//             actions={actions}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomerList;

import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./CustomerList.css";
import { FilePenLine, Trash2 } from "lucide-react";
import Table from "../../../Components/Table/Table";
import Header from "../../../Components/Header/header";

const CustomerList = () => {
  const [data, setData] = useState([]); // Initialize empty state for data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
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
        name: user.user_name,
        currentTier: user.tier?.tier_name || "No Tier",
        walletBalance: user.wallet_info?.ada_balance || 0,
      }));

      setData(modifiedData); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch the data when the component mounts
  }, []);

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user with ID: ${id}`);
  };

  const columns = [
    { key: "id", label: "Id" },
    { key: "name", label: "Name" },
    { key: "currentTier", label: "Tier" }, // Show current tier
    { key: "walletBalance", label: "Balance" }, // Show wallet balance
  ];

  const actions = [
    {
      icon: <FilePenLine />,
      className: "edit-btn",
      onClick: handleEdit,
    },
    {
      icon: <Trash2 />,
      className: "delete-btn",
      onClick: handleDelete,
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
          <Table
            data={paginatedData}
            columns={columns}
            actions={actions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default CustomerList;
