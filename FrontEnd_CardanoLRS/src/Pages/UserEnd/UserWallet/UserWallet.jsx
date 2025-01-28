import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header/header";
import UserSideBar from "../../../Components/SideBar/UserSideBar";
import WalletConnect from "../../../Components/Wallet/WalletConnect"; // Ensure WalletConnect is properly imported
import "./UserWallet.css";

const UserWallet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("Connect Wallet");
  const [availableWallets, setAvailableWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const wallet = sessionStorage.getItem("wallet");

    if (wallet) {
      setDescription("Wallet Connected!");
    }

    if (!token) {
      navigate("/UserSignIn");
    }

    // Detect available wallets
    const wallets = [];
    if (window.cardano) {
      for (const walletName in window.cardano) {
        if (window.cardano[walletName]?.enable) {
          wallets.push(walletName);
        }
      }
    }

    setAvailableWallets(wallets);
  }, [navigate]);

  const handleCustomConnect = async () => {
    if (!selectedWallet) {
      alert("Please select a wallet to connect.");
      return;
    }

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
      alert(
        "Please install a Cardano wallet extension (e.g., Nami, Yoroi, Eternal)."
      );
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
        <div className="wallet-selection">
          <h2>Available Wallets</h2>
          <div className="wallet-type">
            {availableWallets.length > 0 ? (
              <div>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="wallet-dropdown"
                >
                  <option value="" disabled>
                    Select a wallet
                  </option>
                  {availableWallets.map((wallet) => (
                    <option key={wallet} value={wallet}>
                      {wallet.charAt(0).toUpperCase() + wallet.slice(1)} Wallet
                    </option>
                  ))}
                </select>
                <WalletConnect
                  title="Connect your wallet"
                  description="You can connect wallets like Nami, Yoroi, or Eternal."
                  buttonText={loading ? "Connecting..." : description}
                  onConnect={handleCustomConnect}
                  buttonWidth="300px"
                  buttonHeight="50px"
                />
              </div>
            ) : (
              <p>
                No supported wallets found. Please install a Cardano wallet
                extension.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserWallet;
