import express from "express";
import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js"; // Adjust the path as needed

const router = express.Router();

router.get("/total-reward-balance", async (req, res) => {
  try {
    const result = await GuestInfo.aggregate([
      {
        $group: {
          _id: null,
          totalRewardBalance: { $sum: "$reward_balance" },
        },
      },
    ]);

    const totalRewardBalance =
      result.length > 0 ? result[0].totalRewardBalance : 0;
    res.json({ totalRewardBalance });
  } catch (error) {
    console.error("Error calculating total reward balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
