import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./CustomerList.css";
import { FilePenLine, Trash2 } from "lucide-react";
import Table from "../../../Components/Table/Table";
import Header from "../../../Components/Header/header";

const CustomerList = () => {
  const [data, setData] = useState([]); // Initialize empty state for data
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const rowsPerPage = 5;

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
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
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of error
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
