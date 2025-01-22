import bcrypt from "bcryptjs";
import User from "../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import LoyaltyTier from "../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js";
import LoyaltyOffer from "../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema.js";
import LoyaltyUserWalletTransaction from "../../Loyalty_Rule_and_Transaction/Loyalty_User_Wallet_Transaction/Loyalty_User_Wallet_Transaction_Schema.js";
import LoyaltyTierWiseRuleSetup from "../../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js";
import LoyaltyEndUserTierMap from "../../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";

//Create user
export const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, wallet_address, role } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = new User({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      wallet_address,
      role,
      last_login: new Date(),
      Status: true,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        wallet_address: newUser.wallet_address,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "An error occurred while creating the user",
    });
  }
};

//Login user
// export const loginInfoForEndUser = async (req, res) => {
//   try {
//     const { loyalty_end_user_login_rq } = req.body;
//     const { email, password } = loyalty_end_user_login_rq.user_info;

//     if (loyalty_end_user_login_rq.header.request_type !== "END_USER_LOGIN") {
//       return res.status(400).json({
//         error: "Invalid request type",
//       });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         loyalty_end_user_login_rs: {
//           status: "failure",
//           message: "User not found",
//         },
//       });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         loyalty_end_user_login_rs: {
//           status: "failure",
//           message: "Invalid password",
//         },
//       });
//     }

//     const userTier = await LoyaltyTier.findById(user.tier_id);
//     const tierDetails = {
//       tier_id: userTier ? userTier.tier_id : null,
//       tier_name: userTier ? userTier.tier_name : "No Tier",
//     };

//     const assignedOffers = await LoyaltyOffer.find({ user_id: user.user_id });
//     const offers = assignedOffers.map((offer) => ({
//       offer_id: offer.offer_id,
//       offer_name: offer.offer_name,
//       offer_desc: offer.offer_desc,
//     }));

//     const transactions = await LoyaltyUserWalletTransaction.find({
//       user_id: user.user_id,
//     });
//     const walletInfo = {
//       ada_balance: 1200,
//       rewards_earned: 800,
//       rewards_spent: 300,
//       rewards_balance: 500,
//       transactions: transactions.map((transaction) => ({
//         transaction_id: transaction.transaction_id,
//         date: transaction.date,
//         amount: transaction.amount,
//         type: transaction.type,
//         desc: transaction.desc,
//       })),
//     };

//     return res.status(200).json({
//       loyalty_end_user_login_rs: {
//         status: "success",
//         message: "Login successful",
//         user_info: {
//           user_id: user.user_id,
//           email: user.email,
//           tier: tierDetails,
//           assigned_offers: offers,
//           wallet_info: walletInfo,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.status(500).json({
//       loyalty_end_user_login_rs: {
//         status: "failure",
//         message: "An error occurred during login",
//       },
//     });
//   }
// };

export const loginInfoForEndUser = async (req, res) => {
  try {
    const { loyalty_end_user_login_rq } = req.body;
    const { email, password } = loyalty_end_user_login_rq.user_info;

    // Validate request type
    if (loyalty_end_user_login_rq.header.request_type !== "END_USER_LOGIN") {
      return res.status(400).json({
        error: "Invalid request type",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        loyalty_end_user_login_rs: {
          status: "failure",
          message: "User not found",
        },
      });
    }

    // Check if the user is a "Business User"
    if (user.role === "End User") {
      return res.status(403).json({
        loyalty_end_user_login_rs: {
          status: "failure",
          message: "Access denied. End User are not allowed to log in here.",
        },
      });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(400).json({
        loyalty_end_user_login_rs: {
          status: "failure",
          message: "Invalid password",
        },
      });
    }

    // Fetch user tier details
    const userTier = await LoyaltyTier.findById(user.tier_id);
    const tierDetails = {
      tier_id: userTier ? userTier.tier_id : null,
      tier_name: userTier ? userTier.tier_name : "No Tier",
    };

    // Fetch assigned offers
    const assignedOffers = await LoyaltyOffer.find({ user_id: user.user_id });
    const offers = assignedOffers.map((offer) => ({
      offer_id: offer.offer_id,
      offer_name: offer.offer_name,
      offer_desc: offer.offer_desc,
    }));

    // Fetch wallet transactions
    const transactions = await LoyaltyUserWalletTransaction.find({
      user_id: user.user_id,
    });
    const walletInfo = {
      ada_balance: 1200,
      rewards_earned: 800,
      rewards_spent: 300,
      rewards_balance: 500,
      transactions: transactions.map((transaction) => ({
        transaction_id: transaction.transaction_id,
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        desc: transaction.desc,
      })),
    };

    // Successful response
    return res.status(200).json({
      loyalty_end_user_login_rs: {
        status: "success",
        message: "Login successful",
        user_info: {
          user_id: user.user_id,
          email: user.email,
          tier: tierDetails,
          assigned_offers: offers,
          wallet_info: walletInfo,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      loyalty_end_user_login_rs: {
        status: "failure",
        message: "An error occurred during login",
      },
    });
  }
};

//Fetch End-User info by Business
export const fetchEndUsersInfo = async (req, res) => {
  try {
    const endUsers = await User.find({ role: "End User" });
    const userInfoList = [];

    for (const user of endUsers) {
      const tier_details = await LoyaltyEndUserTierMap.findOne({
        user_id: user.user_id,
      });

      const tier = await LoyaltyTier.find({ tier_id: tier_details.tier_id });

      const rule = await LoyaltyTierWiseRuleSetup.findOne({
        tier_id: tier_details.tier_id,
      });

      const offers = await LoyaltyOffer.find({
        _id: { $in: user.assigned_offers || [] },
      });

      const userData = {
        user_id: user.user_id,
        email: user.email,
        user_name: user.first_name || "End User",
        last_name: user.last_name || "Last Name",
        tier_editable: true,
        tier: {
          tier_id: tier ? tier[0].tier_id : null,
          tier_name: tier ? tier[0].tier_name : "No Tier",
          rule_applied: rule
            ? {
                rule_id: rule.rule_id,
                rule_desc: rule.rule_desc || " ",
                conversion_rules: rule.conversion_rules || null,
              }
            : null,
        },
        assigned_offers: offers.map((offer) => ({
          offer_id: offer.offer_id,
          offer_name: offer.offer_name,
          offer_desc: offer.offer_desc,
        })),
        wallet_info: {
          ada_balance: user.wallet_info?.ada_balance || 0,
        },
      };

      userInfoList.push(userData);
    }

    return res.status(200).json({
      loyalty_end_users_info_rs: {
        user_info_list: {
          overall_info: {
            total_users: endUsers.length,
            page: req.query.page || 1,
            limit: req.query.limit || 20,
            user_info: userInfoList,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching end users info:", error);
    return res.status(500).json({
      message: "An error occurred while fetching end user information",
    });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify role
    if (user.role !== "End User") {
      return res.status(403).json({ message: "User is not an End user" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return user information
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user" });
  }
};
