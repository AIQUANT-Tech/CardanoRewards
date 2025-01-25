// import React, { useState } from "react";
// import { BrowserWallet } from "@meshsdk/core";
// import "./WalletConnect.css";

// const WalletConnect = (props) => {
//   const {
//     title = "Connect Your Wallet",
//     description = "Select a wallet to connect to the Cardano blockchain.",
//     buttonText = "Connect Wallet",
//     onConnect = () => {},
//     buttonWidth = "150px",
//     buttonHeight = "40px",
//   } = props;

//   const [wallets, setWallets] = useState([]);
//   const [connectedWallet, setConnectedWallet] = useState(null);

//   const handleConnect = async () => {

//     const availableWallets = BrowserWallet.getInstalledWallets();

//     if (availableWallets.length === 0) {
//       alert("No Cardano wallets found. Please install a compatible wallet.");
//       return;
//     }

//     const wallet = BrowserWallet.enable(availableWallets[0]);
//     setConnectedWallet(await wallet);

//     if (onConnect) {
//       onConnect(wallet);
//     }
//   };

//   return (
//     <div className="Outer-wallet-container">
//       <div className="wallet-container">
//         {title && <h2 className="wallet-title">{title}</h2>}
//         {description && <p className="wallet-description">{description}</p>}
//         <button
//           className="wallet-button"
//           style={{
//             width: buttonWidth,
//             height: buttonHeight,
//           }}
//           onClick={handleConnect}
//         >
//           {buttonText}
//         </button>
//         {connectedWallet && (
//           <p className="wallet-status">
//             Connected to: {connectedWallet.name}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WalletConnect;
