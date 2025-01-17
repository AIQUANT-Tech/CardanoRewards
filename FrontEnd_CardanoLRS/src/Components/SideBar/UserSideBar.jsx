import React from "react";
import SideBar from "./SideBar";
import { LayoutDashboard, UserRound, Wallet } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/UserDashboard",
    icon: <LayoutDashboard />,
  },
  {
    label: "Profile",
    path: "/UserProfile",
    icon: <UserRound />,
  },
  {
    label: "Wallet",
    path: "/UserWallet",
    icon: <Wallet />,
  },
];

const UserSideBar = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBar menuItems={menuItems} backgroundColor="#7ce1ee" />
    </div>
  );
};

export default UserSideBar;
