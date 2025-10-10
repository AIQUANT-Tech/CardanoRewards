// routes/transactionRoutes.js
import express from "express";
import { getTransactionsByUserId } from "./Loyalty_User_Wallet_Transaction_Controller.js";

const router = express.Router();

// GET /api/transactions/user/:user_id
router.get("/user/:username", getTransactionsByUserId);

export default router;
