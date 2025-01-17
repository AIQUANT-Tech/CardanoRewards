import React from "react";
import "./WalletConnect.css";

const WalletConnect = (props) => {
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
          }}
          onClick={onConnect}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
