import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import TierCreation from "../../../Components/TierCreation/TierCreation";

import RewardRules from "../../../Components/RewardRules/RewardRules";
import "./Mapping.css";
import { useNavigate } from "react-router-dom";

const Mapping = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
 
     const token = sessionStorage.getItem("token");

     if(!token){
       navigate("/SignInPage");
     }

   }, [navigate]);

  const steps = [
    {
      label: "Step 1: Map Offers to Tiers",
      component: <TierCreation showNext={false} />,
    },
    {
      label: "Step 2: Reward Rules",
      component: <RewardRules showNext={false} />,
    },
  ];

  return (
    <>
      <Header title="Mapping" />
      <div className="Setting-css">
        <AdminSideBar />
        <div className="Setting-main-body">
          <div className="steps-navigation">
            {steps.map((step, index) => (
              <button
                key={index}
                className={activeStep === index + 1 ? "active" : ""}
                onClick={() => setActiveStep(index + 1)}
              >
                {step.label}
              </button>
            ))}
          </div>

          <div className="tab-content">{steps[activeStep - 1].component}</div>
        </div>
      </div>
    </>
  );
};

export default Mapping;
