import express from "express";
// import { fetchRedeemers } from "./index.js";
import {
  lockFundsRewardGenController,
  redeemFundsRewardGenController,
  TxDetails,
} from "./CardanoLucidRewardGen.js";

const routerR = express.Router();

routerR.post("/lockFundsR", lockFundsRewardGenController);

routerR.post("/redeemFundsR", redeemFundsRewardGenController);

routerR.post("/getTxDetailsR", TxDetails);

export default routerR;
