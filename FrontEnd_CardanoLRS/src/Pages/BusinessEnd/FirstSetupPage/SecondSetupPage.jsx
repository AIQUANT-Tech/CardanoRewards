import React from "react";
import "./FirstSetupPage.css";

import TierCreation from "../../../Components/TierCreation/TierCreation";

const SecondSetup = () => {
  return (
    <>
      <div className="FirstSetup-css">
        <h1>Complete Your Account</h1>
        <div className="FirstSetup-main-body">
          <TierCreation />
        </div>
      </div>
    </>
  );
};

export default SecondSetup;
