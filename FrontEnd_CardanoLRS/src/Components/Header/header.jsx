import React, { useState } from "react";
import PropTypes from "prop-types";
import "./header.css";
import Logo from "../../assets/logo.png";
import { Wallet, Bell } from "lucide-react";
import LogoutButton from "./Logout";
import Notifications from "../Notification/Notification";

const Header = ({
  title,
  backgroundColor,
  showWalletIcon,
  showBellIcon,
  children,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="Header" style={{ backgroundColor }}>
      <div className="logo">
        <img src={Logo} alt="Logo" className="image-logo" />
        <h1>QUANT</h1>
      </div>
      <h1>{title}</h1>
      <div className="header2-css">
        {showWalletIcon && <Wallet style={{ width: "30px", height: "30px" }} />}
        {showBellIcon && (
          <Bell
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
            onClick={toggleNotifications}
          />
        )}
        {children}
      </div>
      {showNotifications && <Notifications onClose={toggleNotifications} />}
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  showWalletIcon: PropTypes.bool,
  showBellIcon: PropTypes.bool,
  children: PropTypes.node,
};

Header.defaultProps = {
  backgroundColor: "#f0c6c6",
  showWalletIcon: true,
  showBellIcon: true,
  children: <LogoutButton />,
};

export default Header;
