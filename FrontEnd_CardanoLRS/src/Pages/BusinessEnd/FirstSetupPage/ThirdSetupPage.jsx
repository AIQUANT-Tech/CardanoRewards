import React from "react";
import "./FirstSetupPage.css";

import RewardRules from "../../../Components/RewardRules/RewardRules";

const ThirdSetup = () => {
  return (
    <>
      <div className="FirstSetup-css">
        <h1>Complete Your Account</h1>
        <div className="FirstSetup-main-body">
          <RewardRules />
        </div>
      </div>
    </>
  );
};

export default ThirdSetup;
