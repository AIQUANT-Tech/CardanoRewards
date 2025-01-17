import React from "react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <button
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
  );
};

export default LogoutButton;
