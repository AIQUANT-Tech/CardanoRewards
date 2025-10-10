import express from "express";
import {
  createUser,
  fetchEndUsersInfo,
  loginInfoForEndUser,
  loginInfoForBusinessUser,
  fetchAllUsersWithBalance,
  fetchUserWithBalance,
  fetchUsersByHotelGroup,
  fetchGuestDetailsAgainstHotelgroupid,
  changeUserTier,
  batchChangeUserTier,
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

router.get("/alluserdetails", fetchAllUsersWithBalance);

router.get("/fetchdetailsbyguestid/:user_email", fetchUserWithBalance);

router.get("/hotel-group/:hotelGroupId", fetchUsersByHotelGroup);

// router.post("/logInWithWallet", loginWithWallet);

router.get(
  "/hotel-group/:hotelGroupId/users/:email/details",
  fetchGuestDetailsAgainstHotelgroupid
);

router.post("/change-tier", changeUserTier);

router.post("/batch-change-tier", batchChangeUserTier);

export default router;
