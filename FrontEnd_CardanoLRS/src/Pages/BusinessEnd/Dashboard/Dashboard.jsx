import React from "react";

import Card from "../../../Components/Card/Card";
import "./Dashboard.css";
import { Gauge, Bitcoin, Clock } from "lucide-react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import Header from "../../../Components/Header/header";

const Dashboard = () => {
  return (
    <>
      <Header title="Dashboard" />
      <div className="DashBoard-css">
        <AdminSideBar />
        <div className="Dashboard-main-body">
          <div className="Welcome-text">
            <h1 className="Welcome">Welcome Souvagya!</h1>
            <h1 className="Second-text">
              Enjoy Our Most Secure Loyalty Reward System.
            </h1>
          </div>

          <div className="main-dash">
            <Card
              icon={<Gauge style={{ width: "40px", height: "40px" }} />}
              primaryText="Total Members:"
              secondaryText="2000"
              backgroundColor={"#f8d6d6"}
            />
            <Card
              icon={<Bitcoin style={{ width: "40px", height: "40px" }} />}
              primaryText="Rewards Given:"
              secondaryText="7000"
              backgroundColor={"#f8d6d6"}
            />
            <Card
              icon={<Clock style={{ width: "40px", height: "40px" }} />}
              primaryText="Pending Rewards:"
              secondaryText="8000"
              backgroundColor={"#f8d6d6"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
