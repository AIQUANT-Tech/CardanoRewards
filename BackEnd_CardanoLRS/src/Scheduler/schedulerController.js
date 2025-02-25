// import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
// import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
// import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
// import UserGuestMap from "./UserGuestMap.js";
// import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";
// import LoyaltyTierWiseRuleSetup from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js"; // adjust the path as needed

// export const processUserMappingFeed = async () => {
//   try {
//     const bookings = await BookingInfo.find();
//     console.log(`Processing ${bookings.length} bookings...`);

//     for (const booking of bookings) {
//       try {
//         // Find guest info using booking.guest_id
//         const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
//         if (!guest) {
//           console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
//           continue;
//         }

//         // Check if user already exists (old user) or create new one
//         let user = await User.findOne({ email: guest.email });
//         const isNewUser = !user;
//         if (isNewUser) {
//           user = new User({
//             email: guest.email,
//             password_hash: "password", // Placeholder password
//             first_name: guest.first_name,
//             last_name: guest.last_name,
//             wallet_address: "wallet_address",
//             role: "End User",
//             last_login: new Date(),
//           });
//           await user.save();
//           console.log(
//             `Created new user: ${user.email} (guest_id: ${guest.guest_id})`
//           );
//         } else {
//           console.log(`Existing user found: ${user.email}`);
//         }

//         // Create User-Guest Mapping if it does not exist
//         const existingUserGuestMap = await UserGuestMap.findOne({
//           user_id: user.user_id,
//           guest_id: guest.guest_id,
//         });
//         if (!existingUserGuestMap) {
//           const userGuestMap = new UserGuestMap({
//             user_id: user.user_id,
//             guest_id: guest.guest_id,
//             Status: true,
//             created_at: new Date(),
//           });
//           await userGuestMap.save();
//           console.log(
//             `Created user-guest mapping for guest_id: ${guest.guest_id}`
//           );
//         } else {
//           console.log(
//             `User-guest mapping already exists for guest_id: ${guest.guest_id}`
//           );
//         }

//         // Determine the six-month window based on the current booking's payment_date.
//         const currentBookingDate = new Date(booking.payment_date);
//         const sixMonthsAgo = new Date(currentBookingDate);
//         sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//         // Calculate total spending only for bookings within the last 6 months.
//         const bookingAggregate = await BookingInfo.aggregate([
//           {
//             $match: {
//               guest_id: booking.guest_id,
//               payment_date: { $gte: sixMonthsAgo },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               totalSpent: { $sum: "$total_amount" },
//             },
//           },
//         ]);
//         const totalSpent =
//           bookingAggregate[0]?.totalSpent || booking.total_amount;
//         console.log(
//           `Total amount spent for guest_id ${guest.guest_id} in the last 6 months: ${totalSpent}`
//         );

//         // Determine eligible tier rule based on totalSpent from the recent period
//         const eligibleRule = await LoyaltyTierWiseRuleSetup.findOne({
//           min_threshold: { $lte: totalSpent },
//           Status: "A",
//         }).sort({ min_threshold: -1 });

//         if (eligibleRule) {
//           // Check if a tier mapping already exists for this user
//           const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
//             user_id: user.user_id,
//           });

//           if (existingTierMapping) {
//             // If user is old, update the mapping if the tier has changed
//             if (existingTierMapping.tier_id !== eligibleRule.tier_id) {
//               existingTierMapping.tier_id = eligibleRule.tier_id;
//               existingTierMapping.modified_at = new Date();
//               existingTierMapping.last_tier_assigned_at = new Date();
//               await existingTierMapping.save();
//               console.log(
//                 `Updated tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//               );
//             } else {
//               console.log(
//                 `User ${user.user_id} already assigned to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//               );
//             }
//           } else {
//             // If no mapping exists, create a new tier mapping
//             const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
//               mapping_id: -1,
//             });
//             const newMappingId = latestTierMap
//               ? latestTierMap.mapping_id + 1
//               : 1;

//             const tierMapping = new LoyaltyEndUserTierMap({
//               mapping_id: newMappingId,
//               user_id: user.user_id,
//               tier_id: eligibleRule.tier_id,
//               created_at: new Date(),
//               modified_at: new Date(),
//               last_tier_assigned_at: new Date(),
//               created_by: "System",
//               modified_by: "System",
//               status: "A", // Active
//             });
//             await tierMapping.save();
//             console.log(
//               `Created tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//             );
//           }
//         } else {
//           console.log(`No eligible tier found for totalSpent: ${totalSpent}`);
//         }

//         // 8. Reward Calculation:
//         // For existing users (not new) with an eligible tier, calculate and update reward_balance.
//         // New users do not receive rewards for their first booking.
//         if (!isNewUser && eligibleRule) {
//           const rewardEarned =
//             booking.total_amount * (eligibleRule.percentage_rate / 100);
//           guest.reward_balance = (guest.reward_balance || 0) + rewardEarned;
//           await guest.save();
//           console.log(
//             `Reward of ${rewardEarned} added to user ${user.email} for booking_id: ${booking.booking_id}`
//           );
//         }
//       } catch (innerError) {
//         console.error(
//           `⚠️ Error processing booking_id: ${booking.booking_id} - ${innerError.message}`
//         );
//       }
//     }

//     console.log("User mapping feed processing complete.");
//   } catch (error) {
//     console.error("Error processing user mapping feed:", error.message);
//   }
// };

// import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
// import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
// import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
// import UserGuestMap from "./UserGuestMap.js";
// import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";
// import LoyaltyTierWiseRuleSetup from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js";

// export const processUserMappingFeed = async () => {
//   try {
//     // Only fetch bookings that have not been processed
//     const bookings = await BookingInfo.find({ processed: { $ne: true } });
//     console.log(`Processing ${bookings.length} bookings...`);

//     for (const booking of bookings) {
//       try {
//         // Skip if already marked as processed (extra precaution)
//         if (booking.processed) {
//           console.log(
//             `Booking ${booking.booking_id} already processed. Skipping...`
//           );
//           continue;
//         }

//         // 1. Retrieve guest info using booking.guest_id
//         const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
//         if (!guest) {
//           console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
//           // Mark booking as processed to avoid repeated lookups
//           booking.processed = true;
//           booking.processed_at = new Date();
//           await booking.save();
//           continue;
//         }

//         // 2. Find or create user based on guest email
//         let user = await User.findOne({ email: guest.email });
//         const isNewUser = !user;
//         if (isNewUser) {
//           user = new User({
//             email: guest.email,
//             password_hash: "password", // Placeholder password
//             first_name: guest.first_name,
//             last_name: guest.last_name,
//             wallet_address: "wallet_address",
//             role: "End User",
//             last_login: new Date(),
//             reward_balance: 0, // Ensure reward_balance is initialized
//           });
//           await user.save();
//           console.log(
//             `Created new user: ${user.email} (guest_id: ${guest.guest_id})`
//           );
//         } else {
//           console.log(`Existing user found: ${user.email}`);
//         }

//         // 3. Create User-Guest Mapping if it does not exist
//         const existingUserGuestMap = await UserGuestMap.findOne({
//           user_id: user.user_id,
//           guest_id: guest.guest_id,
//         });
//         if (!existingUserGuestMap) {
//           const userGuestMap = new UserGuestMap({
//             user_id: user.user_id,
//             guest_id: guest.guest_id,
//             Status: true,
//             created_at: new Date(),
//           });
//           await userGuestMap.save();
//           console.log(
//             `Created user-guest mapping for guest_id: ${guest.guest_id}`
//           );
//         } else {
//           console.log(
//             `User-guest mapping already exists for guest_id: ${guest.guest_id}`
//           );
//         }

//         // 4. Determine the six-month window based on the booking's payment_date.
//         const currentBookingDate = new Date(booking.payment_date);
//         const sixMonthsAgo = new Date(currentBookingDate);
//         sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//         // 5. Calculate total spending for the guest over the last 6 months.
//         const bookingAggregate = await BookingInfo.aggregate([
//           {
//             $match: {
//               guest_id: booking.guest_id,
//               payment_date: { $gte: sixMonthsAgo },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               totalSpent: { $sum: "$total_amount" },
//             },
//           },
//         ]);

//         let totalSpent =
//           bookingAggregate[0]?.totalSpent || booking.total_amount;
//         // Convert Decimal128 to number if necessary
//         if (typeof totalSpent === "object" && totalSpent.toString) {
//           totalSpent = parseFloat(totalSpent.toString());
//         }
//         console.log(
//           `Total amount spent for guest_id ${guest.guest_id} in the last 6 months: ${totalSpent}`
//         );

//         // 6. Determine eligible tier rule based on totalSpent.
//         const eligibleRule = await LoyaltyTierWiseRuleSetup.findOne({
//           min_threshold: { $lte: totalSpent },
//           Status: "A",
//         }).sort({ min_threshold: -1 });

//         if (eligibleRule) {
//           // 7. Create or update the user's tier mapping.
//           const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
//             user_id: user.user_id,
//           });

//           if (existingTierMapping) {
//             // Update mapping if the tier has changed.
//             if (existingTierMapping.tier_id !== eligibleRule.tier_id) {
//               existingTierMapping.tier_id = eligibleRule.tier_id;
//               existingTierMapping.modified_at = new Date();
//               existingTierMapping.last_tier_assigned_at = new Date();
//               await existingTierMapping.save();
//               console.log(
//                 `Updated tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//               );
//             } else {
//               console.log(
//                 `User ${user.user_id} already assigned to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//               );
//             }
//           } else {
//             const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
//               mapping_id: -1,
//             });
//             const newMappingId = latestTierMap
//               ? latestTierMap.mapping_id + 1
//               : 1;

//             const tierMapping = new LoyaltyEndUserTierMap({
//               mapping_id: newMappingId,
//               user_id: user.user_id,
//               tier_id: eligibleRule.tier_id,
//               created_at: new Date(),
//               modified_at: new Date(),
//               last_tier_assigned_at: new Date(),
//               created_by: "System",
//               modified_by: "System",
//               status: "A", // Active
//             });
//             await tierMapping.save();
//             console.log(
//               `Created tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
//             );
//           }
//         } else {
//           console.log(`No eligible tier found for totalSpent: ${totalSpent}`);
//         }

//         // 8. Reward Calculation:
//         // For existing users (not new) with an eligible tier, calculate and update reward_balance.
//         // New users do not receive rewards for their first booking.
//         if (eligibleRule) {
//           const rewardEarned =
//             parseFloat(booking.total_amount.toString()) *
//             (eligibleRule.percentage_rate / 100);
//           guest.reward_balance = (guest.reward_balance || 0) + rewardEarned;
//           guest.tier_id = eligibleRule.tier_id;
//           await guest.save();
//           console.log(
//             `Reward of ${rewardEarned} added to user ${user.email} for booking_id: ${booking.booking_id}`
//           );
//         }

//         // 9. Mark the booking as processed
//         booking.processed = true;
//         booking.processed_at = new Date();
//         await booking.save();
//       } catch (innerError) {
//         console.error(
//           `⚠️ Error processing booking_id: ${booking.booking_id} - ${innerError.message}`
//         );
//       }
//     }

//     console.log("User mapping feed processing complete.");
//   } catch (error) {
//     console.error("Error processing user mapping feed:", error.message);
//   }
// };

import axios from "axios";
import bcrypt from "bcryptjs";
import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import UserGuestMap from "./UserGuestMap.js";
import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";
import LoyaltyTierWiseRuleSetup from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js";

/**
 * Fetches the exchange rate for converting the specified currency to ADA.
 * For example, calling getCurrencyToADARate("usd") returns the number of ADA per 1 USD.
 */
async function getCurrencyToADARate(currency) {
  try {
    console.log(
      `Fetching ADA/${currency.toUpperCase()} exchange rate from CoinGecko...`
    );

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids: "cardano", vs_currencies: currency.toLowerCase() },
      }
    );

    console.log("Response data:", response.data);

    if (
      !response.data.cardano ||
      !response.data.cardano[currency.toLowerCase()]
    ) {
      console.error("Invalid API response:", response.data);
      return null;
    }

    // Example: If cardano.usd = 0.35 (i.e., 1 ADA = 0.35 USD), then 1/0.35 gives the ADA per USD.
    return 1 / response.data.cardano[currency.toLowerCase()];
  } catch (error) {
    console.error("Error fetching exchange rate:", error.message);
    return null;
  }
}

/**
 * Processes bookings by mapping guests to users, assigning tiers, and calculating rewards.
 * - BookingInfo.total_spend is in USD.
 * - Reward is first calculated in USD and then converted into ADA.
 */
export const processUserMappingFeed = async () => {
  try {
    // Only fetch bookings that have not been processed
    const bookings = await BookingInfo.find({ processed: { $ne: true } });
    console.log(`Processing ${bookings.length} bookings...`);

    for (const booking of bookings) {
      try {
        // Extra precaution: skip if already processed.
        if (booking.processed) {
          console.log(
            `Booking ${booking.booking_id} already processed. Skipping...`
          );
          continue;
        }

        // 1. Retrieve guest info using booking.guest_id
        const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
        if (!guest) {
          console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
          // Mark booking as processed to avoid repeated lookups
          booking.processed = true;
          booking.processed_at = new Date();
          await booking.save();
          continue;
        }

        // 2. Find or create a user based on the guest's email
        let user = await User.findOne({ email: guest.email });
        const isNewUser = !user;
        if (isNewUser) {
          const hashedPassword = await bcrypt.hash("password", 10);
          user = new User({
            email: guest.email,
            password_hash: hashedPassword, // Placeholder password
            first_name: guest.first_name,
            last_name: guest.last_name,
            wallet_address: "wallet_address",
            role: "End User",
            last_login: new Date(),
            reward_balance: 0, // Reward balance will be stored in ADA
          });
          await user.save();
          console.log(
            `Created new user: ${user.email} (guest_id: ${guest.guest_id})`
          );
        } else {
          console.log(`Existing user found: ${user.email}`);
        }

        // 3. Create a User-Guest mapping if it does not exist
        const existingUserGuestMap = await UserGuestMap.findOne({
          user_id: user.user_id,
          guest_id: guest.guest_id,
        });
        if (!existingUserGuestMap) {
          const userGuestMap = new UserGuestMap({
            user_id: user.user_id,
            guest_id: guest.guest_id,
            Status: true,
            created_at: new Date(),
          });
          await userGuestMap.save();
          console.log(
            `Created user-guest mapping for guest_id: ${guest.guest_id}`
          );
        } else {
          console.log(
            `User-guest mapping already exists for guest_id: ${guest.guest_id}`
          );
        }

        // 4. Determine the six-month window based on the booking's payment_date.
        const currentBookingDate = new Date(booking.payment_date);
        const sixMonthsAgo = new Date(currentBookingDate);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // 5. Calculate total spending (in USD) for the guest over the last 6 months.
        const bookingAggregate = await BookingInfo.aggregate([
          {
            $match: {
              guest_id: booking.guest_id,
              payment_date: { $gte: sixMonthsAgo },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$total_spend" },
            },
          },
        ]);

        let totalSpent = bookingAggregate[0]?.totalSpent || booking.total_spend;
        // Convert Decimal128 to a number if necessary
        if (typeof totalSpent === "object" && totalSpent.toString) {
          totalSpent = parseFloat(totalSpent.toString());
        }
        console.log(
          `Total amount spent for guest_id ${guest.guest_id} in the last 6 months: ${totalSpent} USD`
        );

        // 6. Determine eligible tier rule based on totalSpent (in USD)
        const eligibleRule = await LoyaltyTierWiseRuleSetup.findOne({
          min_threshold: { $lte: totalSpent },
          Status: "A",
        }).sort({ min_threshold: -1 });

        if (eligibleRule) {
          // 7. Create or update the user's tier mapping.
          const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
            user_id: user.user_id,
          });

          if (existingTierMapping) {
            // Update mapping if the tier has changed.
            if (existingTierMapping.tier_id !== eligibleRule.tier_id) {
              existingTierMapping.tier_id = eligibleRule.tier_id;
              existingTierMapping.modified_at = new Date();
              existingTierMapping.last_tier_assigned_at = new Date();
              await existingTierMapping.save();
              console.log(
                `Updated tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent} USD)`
              );
            } else {
              console.log(
                `User ${user.user_id} already assigned to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent} USD)`
              );
            }
          } else {
            const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
              mapping_id: -1,
            });
            const newMappingId = latestTierMap
              ? latestTierMap.mapping_id + 1
              : 1;

            const tierMapping = new LoyaltyEndUserTierMap({
              mapping_id: newMappingId,
              user_id: user.user_id,
              tier_id: eligibleRule.tier_id,
              created_at: new Date(),
              modified_at: new Date(),
              last_tier_assigned_at: new Date(),
              created_by: "System",
              modified_by: "System",
              status: "A", // Active
            });
            await tierMapping.save();
            console.log(
              `Created tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent} USD)`
            );
          }
        } else {
          console.log(
            `No eligible tier found for Total Spent: ${totalSpent} USD`
          );
        }

        // 8. Reward Calculation:
        // Calculate reward in USD and then convert that reward into ADA.
        if (eligibleRule) {
          // Calculate reward (in USD) based on the booking's total_spend (already in USD)
          const rewardUsd =
            parseFloat(booking.total_spend.toString()) *
            (eligibleRule.percentage_rate / 100);

          // Convert USD reward to ADA using the conversion function:
          const usdToAdaRate = await getCurrencyToADARate("usd");
          if (!usdToAdaRate) {
            console.error("Failed to fetch USD to ADA rate");
          }
          const rewardAda = rewardUsd * usdToAdaRate;

          // Update guest.reward_balance (stored in ADA) and record the assigned tier.
          guest.reward_balance = (guest.reward_balance || 0) + rewardAda;
          guest.tier_id = eligibleRule.tier_id;
          await guest.save();
          console.log(
            `Reward of ${rewardAda} ADA (from ${rewardUsd} USD) added to user ${user.email} for booking_id: ${booking.booking_id}`
          );
        }

        // 9. Mark the booking as processed so it won't be reprocessed
        booking.processed = true;
        booking.processed_at = new Date();
        await booking.save();
      } catch (innerError) {
        console.error(
          `⚠️ Error processing booking_id: ${booking.booking_id} - ${innerError.message}`
        );
      }
    }

    console.log("User mapping feed processing complete.");
  } catch (error) {
    console.error("Error processing user mapping feed:", error.message);
  }
};
