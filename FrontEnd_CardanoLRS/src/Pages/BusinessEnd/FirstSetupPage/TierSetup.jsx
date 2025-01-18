import React from "react";
import "./FirstSetupPage.css";
import TierCreationForm from "../../../Components/OfferCreationForm/TierCreationForm";

const TierSetup = () => {
  return (
    <>
      <div className="FirstSetup-css">
        <h1>Complete Your Account</h1>
        <div className="FirstSetup-main-body">
          <TierCreationForm />
        </div>
      </div>
    </>
  );
};

export default TierSetup;
