import React, {useEffect} from "react";
import "./FirstSetupPage.css";
import TierCreationForm from "../../../Components/OfferCreationForm/TierCreationForm";
import { useNavigate } from "react-router-dom";

const TierSetup = () => {
  const navigate = useNavigate();

   useEffect(() => {
  
      const token = sessionStorage.getItem("token");

      if(!token){
        navigate("/SignInPage");
      }

    }, [navigate]);

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
