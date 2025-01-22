import React, { useEffect, useState } from "react";
import Card from "../../../Components/Card/Card";
import "./Dashboard.css";
import { Gauge, Bitcoin, Clock } from "lucide-react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import Header from "../../../Components/Header/header";

const Dashboard = () => {
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchTotalMembers = async () => {
      try {
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

        const data = await response.json();

        const users =
          data?.loyalty_end_users_info_rs?.user_info_list?.overall_info
            ?.total_users || [];

        setTotalMembers(users);
      } catch (error) {
        console.error("Error fetching total members:", error);
      }
    };

    fetchTotalMembers();
  }, []);

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
              secondaryText={totalMembers.toString()} // Display total members
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
