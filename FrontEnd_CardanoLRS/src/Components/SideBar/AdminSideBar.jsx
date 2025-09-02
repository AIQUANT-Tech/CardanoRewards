import React from "react";
import SideBar from "./SideBar";
import {
  LayoutDashboard,
  UserRound,
  List,
  ChevronsLeftRightEllipsis,
  Coins,
  BadgePercent,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    label: "Profile",
    path: "/Profile",
    icon: <UserRound />,
  },
  {
    label: "Customer List",
    path: "/CustomerList",
    icon: <List />,
  },
  {
    label: "Tier",
    path: "/Tier",
    icon: <Coins />,
  },
  {
    label: "Offer",
    path: "/Offers",
    icon: <BadgePercent />,
  },
  {
    label: "Map",
    path: "/Mapping",
    icon: <ChevronsLeftRightEllipsis />,
  },
];

const AdminSideBar = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBar menuItems={menuItems} backgroundColor="#f8d6d6" />
    </div>
  );
};

export default AdminSideBar;
