import LoyaltyEndUserTierMap from "./Loyalty_Enduser_Tier_Map_Schema.js";
import LoyaltyTier from "../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js";
import User from "../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";

const generateNumericUUID = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const editEndUserInfo = async (req, res) => {
  try {
    const { user_info } = req.body.loyalty_end_user_edit_rq.user_info_list;

    for (const userDetail of user_info) {
      const { user_id, tier } = userDetail;

      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(404).json({
          message: `User with ID ${user_id} not found.`,
        });
      }

      const tierExists = await LoyaltyTier.findOne({ tier_id: tier.tier_id });
      if (!tierExists) {
        return res.status(400).json({
          message: `Tier with ID ${tier.tier_id} does not exist.`,
        });
      }

      const existingMapping = await LoyaltyEndUserTierMap.findOne({ user_id });

      if (existingMapping) {
        existingMapping.tier_id = tier.tier_id;
        existingMapping.modified_at = new Date();
        existingMapping.modified_by = "user";
        existingMapping.last_tier_assigned_at = new Date();

        await existingMapping.save();
      } else {
        const newMapping = new LoyaltyEndUserTierMap({
          mapping_id: generateNumericUUID(),
          user_id,
          tier_id: tier.tier_id,
          created_by: "user",
          modified_by: "user",
          modified_at: new Date(),
          last_tier_assigned_at: new Date(),
          status: "A",
        });
        // Till this it is working
        console.log("----------------I am here-----------------");
        console.log("Printing newMapping: ", newMapping);

        await newMapping.save();
      }
    }

    return res.status(200).json({
      loyalty_end_user_edit_rs: {
        status: "success",
      },
    });
  } catch (error) {
    console.error("Error editing end user tier:", error);
    return res.status(500).json({
      message: "An error occurred while editing end user tier information",
    });
  }
};
