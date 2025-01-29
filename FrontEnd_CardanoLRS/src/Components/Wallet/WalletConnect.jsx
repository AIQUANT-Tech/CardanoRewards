import React, { useEffect, useState } from "react";
import "./WalletConnect.css";

const WalletConnect = (props) => {
  const [wallet, setWallet] = useState();

  useEffect(() => {
    const wallet = sessionStorage.getItem("wallet");
    setWallet(wallet);
  }, [wallet]);

  const {
    title = "",
    description = "",
    buttonText = "",
    onConnect = () => alert("Default connect action"),
    buttonWidth = "150px",
    buttonHeight = "40px",
  } = props;

  return (
    <div className="Outer-wallet-container">
      <div className="wallet-container">
        {title && <h2 className="wallet-title">{title}</h2>}
        {description && <p className="wallet-description">{description}</p>}
        <button
          className="wallet-button"
          style={{
            width: buttonWidth,
            height: buttonHeight,
            backgroundColor: wallet ? "#818181" : "#18a7b8",
          }}
          disabled={wallet ? true : false}
          onClick={onConnect}
        >
          {buttonText}
        </button>
        <div className="wallet-address">
          <p>Your address: {wallet}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
