import React from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import "./Setup.css";

const Setup = () => {
  return (
    <>
      <Header title="Setup" />
      <div className="Setup-css">
        <AdminSideBar />
        <div className="Setup-main-body">
          <h1>Setup</h1>
        </div>
      </div>
    </>
  );
};

export default Setup;
