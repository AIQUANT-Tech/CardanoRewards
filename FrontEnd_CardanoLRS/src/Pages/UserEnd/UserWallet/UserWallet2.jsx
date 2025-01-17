import React from "react";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserWallet.css";
import WalletConnect from "./../../../Components/Wallet/WalletConnect";

const UserWallet2 = () => {
  const handleCustomConnect = () => {
    alert("View Your Wallet !");
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
          title="View Your Wallet"
          buttonText="Click To See Your Wallet"
          onConnect={handleCustomConnect}
          buttonWidth="300px"
          buttonHeight="170px"
        />
      </div>
    </>
  );
};

export default UserWallet2;
