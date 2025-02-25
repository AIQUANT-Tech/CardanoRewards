import express from "express";
import { applyReward } from "./Apply_Reward_Controller.js";

const router = express.Router();

// Map the POST endpoint to the controller function.
router.post("/applyReward", applyReward);

export default router;
