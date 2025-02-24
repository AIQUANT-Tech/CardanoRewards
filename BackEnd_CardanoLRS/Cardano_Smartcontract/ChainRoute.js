import express from "express";
// import { fetchRedeemers } from "./index.js";
import {
  lockFundsController,
  redeemFundsController,
  TxDetails,
} from "./CardanoLucidRedeemReward.js";

const router = express.Router();


router.post("/lockFunds", lockFundsController);

router.post("/redeemFunds", redeemFundsController);

router.post("/getTxDetails", TxDetails);

export default router;
