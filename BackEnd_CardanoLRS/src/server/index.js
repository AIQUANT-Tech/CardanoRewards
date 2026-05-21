import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./db/Config.js";
import loyaltyOfferRoutes from "../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Routes.js";
import LoyaltyTierRoutes from "../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Routes.js";
import LoyaltyMapOfferTier from "../Loyalty_Mapping/Loyalty_Tier_Offer_Map/Loyalty_Tier_Offer_Map_Routes.js";
import LoyaltyRuleTransaction from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Routes.js";
import LoyaltyUser from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Routes.js";
import LoyaltyOfferUserMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Route.js";
import HbsRoutes from "../../Hotel_Booking_System/Hbs_Routes.js";
import schedulerRoutes from "../Scheduler/schedulerRoutes.js";
import rewardbalance from "../Total_Reward/Reward_Balance.js";
import { startScheduler } from "../Scheduler/scheduler.js";

import userTransaction from "../Loyalty_Rule_and_Transaction/Loyalty_User_Wallet_Transaction/Loyalty_User_Wallet_Transaction_Routes.js";

dotenv.config();

const DEMO_MODE = process.env.DEMO_MODE === "true";

const app = express();

dbConnection();
startScheduler();

app.use(express.json());
app.use(cors());

app.use("/lrs/api/offers", loyaltyOfferRoutes);
app.use("/lrs/api/tier", LoyaltyTierRoutes);
app.use("/lrs/api/map", LoyaltyMapOfferTier);
app.use("/lrs/api/rule", LoyaltyRuleTransaction);
app.use("/lrs/api/user", LoyaltyUser);
app.use("/lrs/api/map/user", LoyaltyOfferUserMap);
app.use("/lrs/api/hotel_booking_system/", HbsRoutes);
app.use("/lrs/api/scheduler", schedulerRoutes);

app.use("/lrs/api/rewardBalanceTotal", rewardbalance);
app.use("/lrs/api/usertransaction", userTransaction);

if (!DEMO_MODE) {
  const { default: transactionRoutes } = await import("../../Cardano_Smartcontract/ChainRoute.js");
  const { default: rewardTransactionRoute } = await import("../../Cardano_Smartcontract_RewardGeneration/CardanoLucidRoute.js");
  const { default: reward } = await import("../../Reward_Spending/Apply_Reward_Route.js");
  app.use("/lrs/api/transaction", transactionRoutes);
  app.use("/lrs/api/rewardTransaction", rewardTransactionRoute);
  app.use("/lrs/api/reward", reward);
}

app.listen(5003, () => {
  console.log(`Server is running on port 5003`);
});

export default app;
