import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./FirstSetupPage.css";

import RewardRules from "../../../Components/RewardRules/RewardRules";

const ThirdSetup = () => {
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
          <RewardRules />
        </div>
      </div>
    </>
  );
};

export default ThirdSetup;
