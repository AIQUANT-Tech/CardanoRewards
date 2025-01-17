import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

const SideBar = ({ menuItems, backgroundColor }) => {
  return (
    <div className="SideBar-Container">
      <div className="SideBar-Menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? backgroundColor : "",
                  width: "172px",
                })}
                exact="true"
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
