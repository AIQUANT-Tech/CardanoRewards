import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../Components/Card/Card";
import "./Dashboard.css";
import { Gauge, Bitcoin, Clock } from "lucide-react";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import Header from "../../../Components/Header/header";
import API_BASE_URL from "../../../config.js";

const Dashboard = () => {
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalRewardBalance, setTotalRewardBalance] = useState(0);
  const [loadingReward, setLoadingReward] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!token) {
      navigate("/SignInPage");
    }

    if (userData) {
      setProfileData({
        name: userData.username || "Default Name",
      });
    }

    const fetchTotalMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/user/fetchEndUsersInfo`,
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
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalRewardBalance = async () => {
      try {
        setLoadingReward(true);
        const response = await fetch(
          `${API_BASE_URL}/api/rewardBalanceTotal/total-reward-balance`
        );
        const data = await response.json();
        setTotalRewardBalance(data.totalRewardBalance);
      } catch (error) {
        console.error("Error fetching total reward balance:", error);
      } finally {
        setLoadingReward(false);
      }
    };

    fetchTotalMembers();
    fetchTotalRewardBalance();
  }, [totalMembers, totalRewardBalance, navigate]);

  return (
    <>
      <Header title="Dashboard" />
      <div className="DashBoard-css">
        <AdminSideBar />
        <div className="Dashboard-main-body">
          <div className="Welcome-text">
            <h1 className="Welcome">Welcome {profileData.name}!</h1>
            <h1 className="Second-text">
              Enjoy Our Most Secure Loyalty Reward System.
            </h1>
          </div>

          <div className="main-dash">
            <Card
              icon={<Gauge style={{ width: "40px", height: "40px" }} />}
              primaryText="Total Members:"
              secondaryText={loading ? "Loading..." : totalMembers.toString()}
              backgroundColor={"#f8d6d6"}
            />
            <Card
              icon={<Bitcoin style={{ width: "40px", height: "40px" }} />}
              primaryText="Rewards Given:"
              secondaryText={
                loadingReward ? "Loading..." : totalRewardBalance.toString()
              }
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
