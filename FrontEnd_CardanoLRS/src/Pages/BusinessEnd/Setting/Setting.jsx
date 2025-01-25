// import React, { useState } from "react";
// import Header from "../../../Components/Header/header";
// import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
// import TierCreation from "../../../Components/TierCreation/TierCreation";
// import OfferCreationForm from "../../../Components/OfferCreationForm/OfferCreationForm";
// import TierCreationForm from "../../../Components/OfferCreationForm/TierCreationForm";
// import RewardRules from "../../../Components/RewardRules/RewardRules";
// import "./Setting.css";

// const Setting = () => {
//   const [activeTab, setActiveTab] = useState("addTier");

//   const components = [
//     <TierCreation key="tier-creation" />,
//     <OfferCreationForm key="offer-creation" />,
//     <TierCreationForm key="tier-creation-form" />,
//     <RewardRules key="reward-rules" />,
//   ];

//   return (
//     <>
//       <Header title="Setting" />
//       <div className="Setting-css">
//         <AdminSideBar />
//         <div className="Setting-main-body">
//           <div className="tab-buttons">
//             <button
//               className={activeTab === "addTier" ? "active" : ""}
//               onClick={() => setActiveTab("addTier")}
//             >
//               Add Tier
//             </button>
//             <button
//               className={activeTab === "addOffer" ? "active" : ""}
//               onClick={() => setActiveTab("addOffer")}
//             >
//               Add Offer
//             </button>
//             <button
//               className={activeTab === "tierMapOffer" ? "active" : ""}
//               onClick={() => setActiveTab("tierMapOffer")}
//             >
//               Tier Map Offer
//             </button>
//             <button
//               className={activeTab === "rewardRules" ? "active" : ""}
//               onClick={() => setActiveTab("rewardRules")}
//             >
//               Reward Rules
//             </button>
//           </div>

//           <div className="tab-content">
//             {activeTab === "addTier" && (
//               <div>
//                 <TierCreationForm showNextButton={false} />
//               </div>
//             )}
//             {activeTab === "addOffer" && (
//               <div>
//                 <OfferCreationForm showNextButton={false} />
//               </div>
//             )}
//             {activeTab === "tierMapOffer" && (
//               <div>
//                 <TierCreation showNext={false} />
//               </div>
//             )}
//             {activeTab === "rewardRules" && (
//               <div>
//                 <RewardRules showNext={false} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Setting;

import React, { useState } from "react";
import Header from "../../../Components/Header/header";
import AdminSideBar from "../../../Components/SideBar/AdminSideBar";
import TierCreation from "../../../Components/TierCreation/TierCreation";
import OfferCreationForm from "../../../Components/OfferCreationForm/OfferCreationForm";
import TierCreationForm from "../../../Components/OfferCreationForm/TierCreationForm";
import RewardRules from "../../../Components/RewardRules/RewardRules";
import "./Setting.css";

const Setting = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    // {
    //   label: "Step 1: Add Tier",
    //   component: <TierCreationForm showNextButton={false} />,
    // },
    // {
    //   label: "Step 2: Add Offer",
    //   component: <OfferCreationForm showNextButton={false} />,
    // },
    {
      label: "Step 3: Map Offers to Tiers",
      component: <TierCreation showNext={false} />,
    },
    {
      label: "Step 4: Reward Rules",
      component: <RewardRules showNext={false} />,
    },
  ];

  return (
    <>
      <Header title="Setting" />
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

export default Setting;
