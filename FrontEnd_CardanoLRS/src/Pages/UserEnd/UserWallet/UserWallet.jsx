import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import WalletConnect from "../../../Components/Wallet/WalletConnect"; // Ensure WalletConnect is properly imported
import "./UserWallet.css";

const UserWallet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("Connect Wallet");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const wallet = sessionStorage.getItem("wallet");

    if(wallet){
      setDescription("Wallet Connected!");
    }

    if (!token) {
      navigate("/UserSignIn");
    }
  }, [navigate]);

  const handleCustomConnect = async () => {
    setLoading(true); // Show loading state

    // Check if a Cardano wallet extension is available
    if (window.cardano) {
      try {
        // Enable wallet connection
        await window.cardano.enable();

        // Fetch the wallet address (assuming the wallet supports this method)
        const address = await window.cardano.getUsedAddresses();

        if (address && address[0]) {
          alert(`Wallet connected successfully! Address: ${address[0]}`);
          sessionStorage.setItem("wallet", address[0]);
          // navigate("/UserWallet2");
        } else {
          alert("Failed to retrieve wallet address.");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install a Cardano wallet extension (e.g., Nami, Yoroi, Eternal).");
    }

    setLoading(false); // Reset loading state
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
          description="You can connect wallets like Nami, Yoroi, or Eternal."
          buttonText={loading ? "Connecting..." : description}
          onConnect={handleCustomConnect}
          buttonWidth="300px"
          buttonHeight="50px"
        />
      </div>
    </>
  );
};

export default UserWallet;
