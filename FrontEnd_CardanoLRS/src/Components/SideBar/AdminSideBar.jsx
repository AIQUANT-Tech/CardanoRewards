import React from "react";
import SideBar from "./SideBar";
import {
  LayoutDashboard,
  UserRound,
  List,
  SlidersHorizontal,
  Settings,
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
    label: "Setup",
    path: "/Setup",
    icon: <SlidersHorizontal />,
  },
  {
    label: "Settings",
    path: "/Setting",
    icon: <Settings />,
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
