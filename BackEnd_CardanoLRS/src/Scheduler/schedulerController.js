// import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
// import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
// import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
// import UserGuestMap from "./UserGuestMap.js";
// import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js"; // ✅ Added Tier Mapping

// export const processUserMappingFeed = async () => {
//   try {
//     const bookings = await BookingInfo.find();
//     console.log(`Processing ${bookings.length} bookings...`);

//     for (const booking of bookings) {
//       try {
//         // Check if mapping already exists
//         const existingMapping = await UserGuestMap.findOne({
//           user_id: booking.guest_id, // Ensure correct mapping
//         });

//         if (existingMapping) {
//           console.log(
//             `Skipping existing mapping for guest_id: ${booking.guest_id}`
//           );
//           continue;
//         }

//         // Find guest
//         const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
//         if (!guest) {
//           console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
//           continue;
//         }

//         // Find or create user
//         let user = await User.findOne({ email: guest.email });

//         if (!user) {
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
//             ` Created new user: ${user.email} (guest_id: ${guest.guest_id})`
//           );
//         }

//         // **Auto-increment `user_guest_map_id`**

//         // Create User-Guest Mapping
//         const userGuestMap = new UserGuestMap({
//           //           user_guest_map_id: newUserGuestMapId,
//           user_id: user.user_id,
//           guest_id: guest.guest_id,
//           Status: true,
//           created_at: new Date(),
//         });

//         await userGuestMap.save();
//         // **Tier Mapping Logic**
//         if (guest.tier_id) {
//           // Check if a tier mapping exists
//           const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
//             user_id: user.user_id,
//             tier_id: guest.tier_id,
//           });

//           if (!existingTierMapping) {
//             console.log("I am here.....");

//             const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
//               mapping_id: -1,
//             });
//             const newMappingId = latestTierMap
//               ? latestTierMap.mapping_id + 1
//               : 1;

//             // Create a new Tier Mapping
//             const tierMapping = new LoyaltyEndUserTierMap({
//               mapping_id: newMappingId,
//               user_id: user.user_id,
//               tier_id: guest.tier_id,
//               created_at: new Date(),
//               modified_at: new Date(),
//               last_tier_assigned_at: new Date(),
//               created_by: "System",
//               modified_by: "System",
//               status: "A", // Active
//             });

//             await tierMapping.save();
//             console.log(
//               `Assigned Tier ${guest.tier_id} to User ${user.user_id}`
//             );
//           } else {
//             console.log(
//               ` User ${user.user_id} is already mapped to Tier ${guest.tier_id}`
//             );
//           }
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
// import LoyaltyTierWiseRuleSetup from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js"; // adjust the path as needed

// export const processUserMappingFeed = async () => {
//   try {
//     const bookings = await BookingInfo.find();
//     console.log(`Processing ${bookings.length} bookings...`);

//     for (const booking of bookings) {
//       try {
//         // Check if mapping already exists
//         const existingMapping = await UserGuestMap.findOne({
//           user_id: booking.guest_id,
//         });

//         if (existingMapping) {
//           console.log(
//             `Skipping existing mapping for guest_id: ${booking.guest_id}`
//           );
//           continue;
//         }

//         // Find guest
//         const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
//         if (!guest) {
//           console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
//           continue;
//         }

//         // Find or create user
//         let user = await User.findOne({ email: guest.email });
//         if (!user) {
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
//         }

//         // Create User-Guest Mapping
//         const userGuestMap = new UserGuestMap({
//           user_id: user.user_id,
//           guest_id: guest.guest_id,
//           Status: true,
//           created_at: new Date(),
//         });

//         await userGuestMap.save();

//         // Tier Mapping Logic based on reward balance
//         if (guest.reward_balance !== undefined) {
//           // Query for the eligible rule:
//           // Find a rule where reward_balance is >= min_threshold and sort by min_threshold descending.
//           const eligibleRule = await LoyaltyTierWiseRuleSetup.findOne({
//             min_threshold: { $lte: guest.reward_balance },
//             Status: "A", // Only consider active rules
//           }).sort({ min_threshold: -1 });

//           if (eligibleRule) {
//             // Check if the tier mapping for this user and tier already exists
//             const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
//               user_id: user.user_id,
//               tier_id: eligibleRule.tier_id,
//             });

//             if (!existingTierMapping) {
//               // Auto-increment mapping_id logic
//               const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
//                 mapping_id: -1,
//               });
//               const newMappingId = latestTierMap
//                 ? latestTierMap.mapping_id + 1
//                 : 1;

//               // Create new Tier Mapping using the eligible rule's tier_id
//               const tierMapping = new LoyaltyEndUserTierMap({
//                 mapping_id: newMappingId,
//                 user_id: user.user_id,
//                 tier_id: eligibleRule.tier_id,
//                 created_at: new Date(),
//                 modified_at: new Date(),
//                 last_tier_assigned_at: new Date(),
//                 created_by: "System",
//                 modified_by: "System",
//                 status: "A", // Active
//               });

//               await tierMapping.save();
//               console.log(
//                 `Assigned Tier ${eligibleRule.tier_id} to User ${user.user_id} based on reward balance ${guest.reward_balance}`
//               );
//             } else {
//               console.log(
//                 `User ${user.user_id} is already mapped to Tier ${eligibleRule.tier_id}`
//               );
//             }
//           } else {
//             console.log(
//               `No eligible tier found for reward balance: ${guest.reward_balance}`
//             );
//           }
//         } else {
//           console.warn(
//             `Reward balance not available for guest_id: ${guest.guest_id}. Tier mapping skipped.`
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

import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import UserGuestMap from "./UserGuestMap.js";
import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js";
import LoyaltyTierWiseRuleSetup from "../Loyalty_Rule_and_Transaction/Loyalty_Tier_Wise_Rule_Setup/Loyalty_Tier_Wise_Rule_Setup_Schema.js"; // adjust the path as needed

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

//         // Calculate total spending by summing all bookings for this guest
//         const bookingAggregate = await BookingInfo.aggregate([
//           { $match: { guest_id: booking.guest_id } },
//           { $group: { _id: null, totalSpent: { $sum: "$total_amount" } } },
//         ]);
//         const totalSpent =
//           bookingAggregate[0]?.totalSpent || booking.total_amount;
//         console.log(
//           `Total amount spent for guest_id ${guest.guest_id}: ${totalSpent}`
//         );

//         // Determine eligible tier rule based on totalSpent
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

export const processUserMappingFeed = async () => {
  try {
    const bookings = await BookingInfo.find();
    console.log(`Processing ${bookings.length} bookings...`);

    for (const booking of bookings) {
      try {
        // Find guest info using booking.guest_id
        const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
        if (!guest) {
          console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
          continue;
        }

        // Check if user already exists (old user) or create new one
        let user = await User.findOne({ email: guest.email });
        const isNewUser = !user;
        if (isNewUser) {
          user = new User({
            email: guest.email,
            password_hash: "password", // Placeholder password
            first_name: guest.first_name,
            last_name: guest.last_name,
            wallet_address: "wallet_address",
            role: "End User",
            last_login: new Date(),
          });
          await user.save();
          console.log(
            `Created new user: ${user.email} (guest_id: ${guest.guest_id})`
          );
        } else {
          console.log(`Existing user found: ${user.email}`);
        }

        // Create User-Guest Mapping if it does not exist
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

        // Determine the six-month window based on the current booking's payment_date.
        const currentBookingDate = new Date(booking.payment_date);
        const sixMonthsAgo = new Date(currentBookingDate);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Calculate total spending only for bookings within the last 6 months.
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
              totalSpent: { $sum: "$total_amount" },
            },
          },
        ]);
        const totalSpent =
          bookingAggregate[0]?.totalSpent || booking.total_amount;
        console.log(
          `Total amount spent for guest_id ${guest.guest_id} in the last 6 months: ${totalSpent}`
        );

        // Determine eligible tier rule based on totalSpent from the recent period
        const eligibleRule = await LoyaltyTierWiseRuleSetup.findOne({
          min_threshold: { $lte: totalSpent },
          Status: "A",
        }).sort({ min_threshold: -1 });

        if (eligibleRule) {
          // Check if a tier mapping already exists for this user
          const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
            user_id: user.user_id,
          });

          if (existingTierMapping) {
            // If user is old, update the mapping if the tier has changed
            if (existingTierMapping.tier_id !== eligibleRule.tier_id) {
              existingTierMapping.tier_id = eligibleRule.tier_id;
              existingTierMapping.modified_at = new Date();
              existingTierMapping.last_tier_assigned_at = new Date();
              await existingTierMapping.save();
              console.log(
                `Updated tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
              );
            } else {
              console.log(
                `User ${user.user_id} already assigned to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
              );
            }
          } else {
            // If no mapping exists, create a new tier mapping
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
              `Created tier mapping for User ${user.user_id} to Tier ${eligibleRule.tier_id} (Total Spent: ${totalSpent})`
            );
          }
        } else {
          console.log(`No eligible tier found for totalSpent: ${totalSpent}`);
        }
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
