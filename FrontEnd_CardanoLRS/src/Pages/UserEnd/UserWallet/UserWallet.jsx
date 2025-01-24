import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserWallet.css";
import WalletConnect from "./../../../Components/Wallet/WalletConnect";

const UserWallet = () => {
  const navigate = useNavigate();

  useEffect(() => {
 
     const token = sessionStorage.getItem("token");

     if(!token){
       navigate("/UserSignIn");
     }

   }, [navigate]);

  const handleCustomConnect = () => {
    alert("Successfully Connected Your Wallet !");
  };
  return (
    <>
      <Header
        title="Wallet"
        backgroundColor={"#18A7B8"}
        showWalletIcon={false}
      />
      <div className="UserWallet">
        <UserSideBar />
        <WalletConnect
          title="Connect your wallet"
          description="You can connect wallet like Eternal, Nami"
          buttonText="Connect Wallet"
          onConnect={handleCustomConnect}
          buttonWidth="300px"
          buttonHeight="50px"
        />
      </div>
    </>
  );
};

export default UserWallet;
