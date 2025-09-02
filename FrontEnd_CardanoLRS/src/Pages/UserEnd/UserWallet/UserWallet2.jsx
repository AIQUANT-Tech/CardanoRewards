import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import "./UserWallet.css";
import WalletConnect from "./../../../Components/Wallet/WalletConnect";

const UserWallet2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const wallet = sessionStorage.getItem("wallet");
    setWallet(wallet);

    if (!token) {
      navigate("/UserSignIn");
    }
  }, [navigate]);

  const handleCustomConnect = () => {
    const explorerURL = `https://explorer.cardano.org/en/address/${wallet}`;
    window.open(explorerURL, "_blank");
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
