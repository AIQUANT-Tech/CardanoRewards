import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("wallet");

    setTimeout(() => {
      setLoading(false);
      toast.success("Successfully logged out!");
      const currentPath = window.location.pathname;

      console.log("Current Path:", currentPath);

      if (
        currentPath === "/UserDashboard" ||
        currentPath === "/UserProfile" ||
        currentPath === "/UserWallet" ||
        currentPath === "/UserWallet2"
      ) {
        setTimeout(() => {
          navigate("/UserSignIn");
        }, 1500);
      } else {
        setTimeout(() => {
          navigate("/SignInPage");
        }, 1500);
      }
    }, 500);
  };

  return (
    <div>
      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Logging out...</p>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          width: "110px",
          height: "40px",
          backgroundColor: "#FF3B30",
          border: "none",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          color: "#F5F5F5",
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Inika",
        }}
      >
        <LogOut color="#F5F5F5" size={20} />
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
