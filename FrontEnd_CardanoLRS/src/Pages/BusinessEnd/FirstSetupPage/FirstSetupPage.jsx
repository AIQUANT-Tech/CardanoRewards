import React from "react";
import "./FirstSetupPage.css";

import OfferCreationForm from "../../../Components/OfferCreationForm/OfferCreationForm";

const FirstSetup = () => {
  return (
    <>
      <div className="FirstSetup-css">
        <h1>Complete Your Account</h1>
        <div className="FirstSetup-main-body">
          <OfferCreationForm />
        </div>
      </div>
    </>
  );
};

export default FirstSetup;
