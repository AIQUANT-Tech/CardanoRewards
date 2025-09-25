import bcrypt from "bcryptjs";
import User from "../../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import LoyaltyTier from "../../Loyalty_Mast/Loyalty_Tier_Mast/Loyalty_Tier_Mast_Schema.js";
import LoyaltyOffer from "../../Loyalty_Mast/Loyalty_Offer_Mast/Loyalty_Offer_Mast_Schema.js";
import LoyaltyUserWalletTransaction from "../../Loyalty_Rule_and_Transaction/Loyalty_User_Wallet_Transaction/Loyalty_User_Wallet_Transaction_Schema.js";
import LoyaltyTierWiseRuleSetup from "../../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js";
import LoyaltyEndUserTierMap from "../../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";

import { generateToken } from "../../auth/jwtUtil.js";

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

export const loginInfoForBusinessUser = async (req, res) => {
  try {
    const { loyalty_end_user_login_rq } = req.body;
    const { email, password } = loyalty_end_user_login_rq.user_info;

    // Validate request type
    if (
      loyalty_end_user_login_rq.header.request_type !== "BUSINESS_USER_LOGIN"
    ) {
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

    const token = generateToken(user);

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
    console.log(user.user_id);

    const transactions = await LoyaltyUserWalletTransaction.find({
      user_id: user._id,
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
      loyalty_business_user_login_rs: {
        status: "success",
        token,
        message: "Login successful",
        user_info: {
          user_id: user.user_id,
          username: user.first_name + " " + user.last_name,
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

export const loginInfoForEndUser = async (req, res) => {
  try {
    const { email, password } = req.body.loyalty_end_user_login_rq.user_info;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and loyalty_end_user_login_rqpassword are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user);

    // Verify role
    if (user.role !== "End User") {
      return res.status(403).json({ message: "User is not an End user" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const tier_details = await LoyaltyEndUserTierMap.findOne({
      user_id: user.user_id,
    });

    const userTier = await LoyaltyTier.findOne({
      tier_id: tier_details.tier_id,
    });

    const tierDetails = {
      tier_id: userTier.tier_id,
      tier_name: userTier.tier_name,
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

    // Return user information
    return res.status(200).json({
      loyalty_end_user_login_rs: {
        status: "success",
        token,
        message: "Login successful",
        user_info: {
          user_id: user.user_id,
          username: user.first_name + " " + user.last_name,
          email: user.email,
          tier: tierDetails,
          assigned_offers: offers,
          wallet_info: walletInfo,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user" });
  }
};

export const fetchAllUsersWithBalance = async (req, res) => {
  try {
    // Find all users
    const users = await User.find({});

    const results = [];

    for (const user of users) {
      // Get tier details
      const tierMap = await LoyaltyEndUserTierMap.findOne({
        user_id: user.user_id,
      });

      const tier = tierMap
        ? await LoyaltyTier.findOne({ _id: tierMap.tier_id })
        : null;

      console.log(tier);

      // Get wallet transactions
      const transactions = await LoyaltyUserWalletTransaction.find({
        user_id: user.user_id,
      });

      const totalCredited = transactions
        .filter((tx) => tx.transaction_type === "credit")
        .reduce((sum, tx) => sum + tx.transaction_amount, 0);

      const totalRedeemed = transactions
        .filter((tx) => tx.transaction_type === "debit")
        .reduce((sum, tx) => sum + tx.transaction_amount, 0);

      const pending = transactions
        .filter((tx) => tx.status === "A")
        .reduce((sum, tx) => sum + tx.transaction_amount, 0);

      const lastCreditedTx = transactions
        .filter((tx) => tx.transaction_type === "credit")
        .sort((a, b) => b.date - a.date)[0];

      results.push({
        user_name: user?.first_name + " " + user?.last_name,
        user_id: user.user_id,
        email: user.email,
        tierName: tier ? tier.tier_name : "No Tier",
        tier_id: tier ? tier._id : null,
        tier_desc: tier?.tier_desc,
        totalBalance: totalCredited - totalRedeemed,
        creditedOn: lastCreditedTx ? lastCreditedTx.date : null,
        redeemed: totalRedeemed,
        pending,
      });
    }

    return res.status(200).json({
      status: "success",
      users: results,
    });
  } catch (error) {
    console.error("Error fetching all users with balance:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while fetching user balances",
    });
  }
};

// Fetch PARTICULAR user by user_id
export const fetchUserWithBalance = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.guestId;

    console.log("From FetchUSerByGuestId: ", userId);

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }

    // Get tier details
    const tierMap = await LoyaltyEndUserTierMap.findOne({
      user_id: user.user_id,
    });
    const tier = tierMap
      ? await LoyaltyTier.findOne({ tier_id: tierMap.tier_id })
      : null;

    // Get wallet transactions
    const transactions = await LoyaltyUserWalletTransaction.find({
      user_id: user.user_id,
    });

    console.log("TRANSACTION: ", transactions);

    const totalCredited = transactions
      .filter((tx) => tx.transaction_type === "credit")
      .reduce((sum, tx) => sum + tx.transaction_amount, 0);

    const totalRedeemed = transactions
      .filter((tx) => tx.transaction_type === "debit")
      .reduce((sum, tx) => sum + tx.transaction_amount, 0);

    const pending = transactions
      .filter((tx) => tx.status === "A")
      .reduce((sum, tx) => sum + tx.transaction_amount, 0);

    const lastCreditedTx = transactions
      .filter((tx) => tx.transaction_type === "credit")
      .sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      )[0];

    console.log("LST CREDIT:", lastCreditedTx);

    return res.status(200).json({
      status: "success",
      user: {
        user_id: user.user_id,
        email: user.email,
        tierName: tier ? tier.tier_name : "No Tier",
        totalBalance: totalCredited - totalRedeemed,
        creditedOn: lastCreditedTx ? lastCreditedTx.transaction_date : null,
        redeemed: totalRedeemed,
        pending,
      },
    });
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while fetching the user balance",
    });
  }
};

export const fetchUsersByHotelGroup = async (req, res) => {
  try {
    const { hotelGroupId } = req.params;

    if (!hotelGroupId) {
      return res.status(400).json({
        status: "failure",
        message: "hotelGroupId is required",
      });
    }

    const users = await User.find({ hotel_group_id: hotelGroupId });

    console.log("USERS: ", users);

    if (users.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No users found for this hotelGroupId",
      });
    }

    // Prepare user details with tier + balance info
    const userInfoList = [];

    for (const user of users) {
      // --- Tier details ---
      const tierMap = await LoyaltyEndUserTierMap.findOne({
        user_id: user.user_id,
      });

      const tier = tierMap
        ? await LoyaltyTier.findOne({ tier_id: tierMap.tier_id })
        : null;

      console.log("TIER: ", tier);

      // --- Wallet transactions ---

      const transactions = await LoyaltyUserWalletTransaction.find({
        user_id: user._id,
      });

      const totalCredited = transactions
        .filter((tx) => tx.transaction_type === "credit")
        .reduce((sum, tx) => sum + tx.transaction_amount, 0);

      const totalSpent = transactions
        .filter(
          (tx) =>
            tx.transaction_type === "debit" ||
            tx.transaction_type === "transfer"
        )
        .reduce((sum, tx) => sum + tx.transaction_amount, 0);

      const lastCreditedTx = transactions
        .filter((tx) => tx.transaction_type === "credit")
        .sort((a, b) => b.transaction_date - a.transaction_date)[0];

      // --- Prepare response object ---
      const userData = {
        user_id: user.user_id,
        email: user.email,
        username: user.first_name
          ? `${user.first_name} ${user.last_name || ""}`
          : "No Name",
        role: user.role,
        hotel_group_id: user.hotel_group_id,
        hotel_ids: user.hotel_ids,
        tier: tier
          ? {
              tier_id: tier.tier_id,
              tier_name: tier.tier_name,
            }
          : {
              tier_id: null,
              tier_name: "No Tier",
            },
        balance: {
          totalBalance: totalCredited - totalSpent,
          creditedOn: lastCreditedTx ? lastCreditedTx.created_at : null,
          earned: totalCredited,
          spent: totalSpent,
        },
      };

      userInfoList.push(userData);
    }

    return res.status(200).json({
      status: "success",
      total_users: users.length,
      hotel_group_id: hotelGroupId,
      users: userInfoList,
    });
  } catch (error) {
    console.error("Error fetching users by hotelGroupId:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while fetching users",
    });
  }
};

// export const fetchGuestDetailsAgainstHotelgroupid = async (req, res) => {
//   try {
//     const { hotelGroupId, userId } = req.params;

//     if (!hotelGroupId || !userId) {
//       return res.status(400).json({
//         status: "failure",
//         message: "hotelGroupId and userId are required",
//       });
//     }

//     // Find user in this hotel group
//     const user = await User.findOne({
//       _id: userId,
//       hotel_group_id: hotelGroupId,
//     });

//     if (!user) {
//       return res.status(404).json({
//         status: "failure",
//         message: "User not found in this hotel group",
//       });
//     }

//     // --- Tier details ---
//     const tierMap = await LoyaltyEndUserTierMap.findOne({
//       user_id: user.user_id,
//     });
//     const tier = tierMap
//       ? await LoyaltyTier.findOne({ tier_id: tierMap.tier_id })
//       : null;

//     // --- Wallet transactions ---
//     const transactions = await LoyaltyUserWalletTransaction.find({
//       user_id: user._id,
//     });

//     const totalCredited = transactions
//       .filter((tx) => tx.transaction_type === "credit")
//       .reduce((sum, tx) => sum + tx.transaction_amount, 0);

//     const totalSpent = transactions
//       .filter(
//         (tx) =>
//           tx.transaction_type === "debit" || tx.transaction_type === "transfer"
//       )
//       .reduce((sum, tx) => sum + tx.transaction_amount, 0);

//     const lastCreditedTx = transactions
//       .filter((tx) => tx.transaction_type === "credit")
//       .sort((a, b) => b.transaction_date - a.transaction_date)[0];

//     // --- Prepare detailed response ---
//     const guestDetails = {
//       user_id: user.user_id,
//       email: user.email,
//       username: user.first_name
//         ? `${user.first_name} ${user.last_name || ""}`
//         : "No Name",
//       role: user.role,
//       hotel_group_id: user.hotel_group_id,
//       hotel_ids: user.hotel_ids,
//       tier: tier
//         ? {
//             tier_id: tier.tier_id,
//             tier_name: tier.tier_name,
//           }
//         : {
//             tier_id: null,
//             tier_name: "No Tier",
//           },
//       balance: {
//         totalBalance: totalCredited - totalSpent,
//         creditedOn: lastCreditedTx ? lastCreditedTx.created_at : null,
//         earned: totalCredited,
//         spent: totalSpent,
//       },
//       transactions: transactions.map((tx) => ({
//         transaction_id: tx.transaction_id,
//         date: tx.transaction_date,
//         amount: tx.transaction_amount,
//         type: tx.transaction_type,
//         desc: tx.transaction_desc,
//         status: tx.status,
//       })),
//     };

//     return res.status(200).json({
//       status: "success",
//       guest: guestDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching guest details:", error);
//     return res.status(500).json({
//       status: "failure",
//       message: "An error occurred while fetching guest details",
//     });
//   }
// };

export const fetchGuestDetailsAgainstHotelgroupid = async (req, res) => {
  try {
    const { hotelGroupId, email } = req.params;
    console.log("Inside: ", hotelGroupId, email);

    if (!hotelGroupId || !email) {
      return res.status(400).json({
        status: "failure",
        message: "hotelGroupId and email are required",
      });
    }

    // Find user by email and hotel_group_id
    const user = await User.findOne({
      email,
      hotel_group_id: hotelGroupId,
    });

    console.log("USERS: ", user);

    if (!user) {
      return res.status(200).json({
        status: "failure",
        message: "User not found in this hotel group with given email",
      });
    }

    // --- Tier details ---
    const tierMap = await LoyaltyEndUserTierMap.findOne({
      user_id: user.user_id,
    });
    console.log(tierMap);

    const tier = tierMap
      ? await LoyaltyTier.findOne({ _id: tierMap.tier_id })
      : null;

    console.log(tier);

    const transactions = await LoyaltyUserWalletTransaction.find({
      user_id: user.user_id,
    });

    const totalCredited = transactions
      .filter((tx) => tx.transaction_type === "credit")
      .reduce((sum, tx) => sum + tx.transaction_amount, 0);

    const totalSpent = transactions
      .filter(
        (tx) =>
          tx.transaction_type === "debit" || tx.transaction_type === "transfer"
      )
      .reduce((sum, tx) => sum + tx.transaction_amount, 0);

    const lastCreditedTx = transactions
      .filter((tx) => tx.transaction_type === "credit")
      .sort((a, b) => b.transaction_date - a.transaction_date)[0];

    // --- Prepare detailed response ---
    const guestDetails = {
      user_id: user.user_id,
      email: user.email,
      username: user.first_name
        ? `${user.first_name} ${user.last_name || ""}`
        : "No Name",
      role: user.role,
      hotel_group_id: user.hotel_group_id,
      hotel_ids: user.hotel_ids,
      tier: tier
        ? {
            tier_id: tier.tier_id,
            tier_name: tier.tier_name,
          }
        : {
            tier_id: tier.tier_id || tier._id,
            tier_name: "No Tier",
          },
      balance: {
        totalBalance: totalCredited - totalSpent,
        creditedOn: lastCreditedTx ? lastCreditedTx.created_at : null,
        earned: totalCredited,
        spent: totalSpent,
      },
      transactions: transactions.map((tx) => ({
        transaction_id: tx.transaction_id,
        date: tx.transaction_date,
        amount: tx.transaction_amount,
        type: tx.transaction_type,
        desc: tx.transaction_desc,
        status: tx.status,
      })),
    };

    return res.status(200).json({
      status: "success",
      guest: guestDetails,
    });
  } catch (error) {
    console.error("Error fetching guest details:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while fetching guest details",
    });
  }
};

export const changeUserTier = async (req, res) => {
  try {
    const { userId } = req.body;
    const { newTierId } = req.body;

    if (!userId || !newTierId) {
      return res.status(400).json({
        status: "failure",
        message: "userId and newTierId are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }

    // Check if tier exists
    const tier = await LoyaltyTier.findOne({ _id: newTierId });
    if (!tier) {
      return res.status(404).json({
        status: "failure",
        message: "Tier not found",
      });
    }

    // Update or create mapping in LoyaltyEndUserTierMap
    let tierMap = await LoyaltyEndUserTierMap.findOne({
      user_id: user.user_id,
    });

    if (tierMap) {
      tierMap.tier_id = newTierId;
      tierMap.updated_at = new Date();
      await tierMap.save();
    } else {
      tierMap = new LoyaltyEndUserTierMap({
        user_id: user.user_id,
        tier_id: newTierId,
        created_at: new Date(),
      });
      await tierMap.save();
    }

    return res.status(200).json({
      status: "success",
      message: "User tier updated successfully",
      user: {
        user_id: user.user_id,
        email: user.email,
        new_tier: {
          tier_id: tier.tier_id,
          tier_name: tier.tier_name,
          tier_desc: tier.tier_desc,
        },
      },
    });
  } catch (error) {
    console.error("Error changing user tier:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while changing user tier",
    });
  }
};

export const batchChangeUserTier = async (req, res) => {
  try {
    const { userIds, newTierId } = req.body;

    if (
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0 ||
      !newTierId
    ) {
      return res.status(400).json({
        status: "failure",
        message: "userIds (non-empty array) and newTierId are required",
      });
    }

    // Check if tier exists
    const tier = await LoyaltyTier.findOne({ _id: newTierId });
    if (!tier) {
      return res.status(404).json({
        status: "failure",
        message: "Tier not found",
      });
    }

    const results = [];

    for (const userId of userIds) {
      const user = await User.findOne({ user_id: userId });
      if (!user) {
        results.push({ userId, status: "failure", message: "User not found" });
        continue;
      }

      // Update or create mapping
      let tierMap = await LoyaltyEndUserTierMap.findOne({
        user_id: user.user_id,
      });
      if (tierMap) {
        tierMap.tier_id = newTierId;
        tierMap.updated_at = new Date();
        await tierMap.save();
      } else {
        tierMap = new LoyaltyEndUserTierMap({
          user_id: user.user_id,
          tier_id: newTierId,
          created_at: new Date(),
        });
        await tierMap.save();
      }

      results.push({
        userId: user.user_id,
        status: "success",
        newTier: {
          tier_id: tier.tier_id,
          tier_name: tier.tier_name,
          tier_desc: tier.tier_desc,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Batch tier update completed",
      results,
    });
  } catch (error) {
    console.error("Error in batchChangeUserTier:", error);
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while changing user tiers in batch",
    });
  }
};
