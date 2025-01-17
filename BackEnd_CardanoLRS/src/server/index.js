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

dotenv.config();

const app = express();

dbConnection();

app.use(express.json());
app.use(cors());

app.use('/api/offers', loyaltyOfferRoutes);
app.use('/api/tier', LoyaltyTierRoutes);
app.use('/api/map', LoyaltyMapOfferTier);
app.use('/api/rule', LoyaltyRuleTransaction);
app.use('/api/user', LoyaltyUser);
app.use('/api/map/user', LoyaltyOfferUserMap);

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
  //process.env.PORT
  //${process.env.PORT}
});

export default app;

