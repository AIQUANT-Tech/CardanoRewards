import React, { useEffect } from "react";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserDashBoard.css";
import Card from "./../../../Components/Card/Card";
import { Coins, Bitcoin, HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";
const UserDashBoard = () => {

  const navigate = useNavigate();

   useEffect(() => {
  
      const token = sessionStorage.getItem("token");

      if(!token){
        navigate("/UserSignIn");
      }

    }, [navigate]);

  return (
    <>
      <Header
        title="DashBoard"
        backgroundColor={"#18A7B8"}
        showWalletIcon={false}
      />
      <div className="UserDashBoard">
        <UserSideBar />
        <div className="UserDashboard-main-body">
          <div className="UserWelcome-text">
            <h1 className="UserWelcome">Welcome Srijit!</h1>
            <h1 className="UserSecond-text">
              Enjoy Our Most Secure Loyalty Reward System.
            </h1>
          </div>
          <div className="Usermain-dash">
            <Card
              icon={<Coins style={{ width: "40px", height: "40px" }} />}
              primaryText="Remaining Rewards:"
              secondaryText="730"
              backgroundColor="#7ce1ee"
            />
          </div>

          <div className="Usermain-dash2">
            <Card
              icon={<Bitcoin style={{ width: "40px", height: "40px" }} />}
              primaryText="Rewards Earn:"
              secondaryText="800"
              backgroundColor="#7ce1ee"
            />
            <Card
              icon={<HandCoins style={{ width: "40px", height: "40px" }} />}
              primaryText="Rewards Earn:"
              secondaryText="70"
              backgroundColor="#7ce1ee"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashBoard;
