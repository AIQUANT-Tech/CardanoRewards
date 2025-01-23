import express from "express";
import {
  createUser,
  fetchEndUsersInfo,
  loginInfoForEndUser,
  loginInfoForBusinessUser,
} from "./Loyalty_User_Mast_Controller.js";

const router = express.Router();

//Route to register user
router.post("/createUser", createUser);

//Route to login user
router.post("/loginInfoForBusinessUser", loginInfoForBusinessUser);

//Route to fetch end user info
router.post("/fetchEndUsersInfo", fetchEndUsersInfo);

//Route to fetch End user
router.post("/loginInfoForEndUser", loginInfoForEndUser);

export default router;
