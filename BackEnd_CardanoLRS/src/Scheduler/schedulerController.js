import BookingInfo from "../../Hotel_Booking_System/Hbs_Booking_Info_Schema.js";
import GuestInfo from "../../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
import User from "../Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import UserGuestMap from "./UserGuestMap.js";
import LoyaltyEndUserTierMap from "../Loyalty_Mapping/Loyalty_Enduser_Tier_Map/Loyalty_Enduser_Tier_Map_Schema.js"; // ✅ Added Tier Mapping

export const processUserMappingFeed = async () => {
  try {
    const bookings = await BookingInfo.find();
    console.log(`Processing ${bookings.length} bookings...`);

    for (const booking of bookings) {
      try {
        // Check if mapping already exists
        const existingMapping = await UserGuestMap.findOne({
          user_id: booking.guest_id, // Ensure correct mapping
        });

        if (existingMapping) {
          console.log(
            `Skipping existing mapping for guest_id: ${booking.guest_id}`
          );
          continue;
        }

        // Find guest
        const guest = await GuestInfo.findOne({ guest_id: booking.guest_id });
        if (!guest) {
          console.warn(`Guest not found for guest_id: ${booking.guest_id}`);
          continue;
        }

        // Find or create user
        let user = await User.findOne({ email: guest.email });

        if (!user) {
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
            ` Created new user: ${user.email} (guest_id: ${guest.guest_id})`
          );
        }

        // **Auto-increment `user_guest_map_id`**

        // Create User-Guest Mapping
        const userGuestMap = new UserGuestMap({
          //           user_guest_map_id: newUserGuestMapId,
          user_id: user.user_id,
          guest_id: guest.guest_id,
          Status: true,
          created_at: new Date(),
        });

        await userGuestMap.save();
        // **Tier Mapping Logic**
        if (guest.tier_id) {
          // Check if a tier mapping exists
          const existingTierMapping = await LoyaltyEndUserTierMap.findOne({
            user_id: user.user_id,
            tier_id: guest.tier_id,
          });

          if (!existingTierMapping) {
            console.log("I am here.....");

            const latestTierMap = await LoyaltyEndUserTierMap.findOne().sort({
              mapping_id: -1,
            });
            const newMappingId = latestTierMap
              ? latestTierMap.mapping_id + 1
              : 1;

            // Create a new Tier Mapping
            const tierMapping = new LoyaltyEndUserTierMap({
              mapping_id: newMappingId,
              user_id: user.user_id,
              tier_id: guest.tier_id,
              created_at: new Date(),
              modified_at: new Date(),
              last_tier_assigned_at: new Date(),
              created_by: "System",
              modified_by: "System",
              status: "A", // Active
            });

            await tierMapping.save();
            console.log(
              `Assigned Tier ${guest.tier_id} to User ${user.user_id}`
            );
          } else {
            console.log(
              ` User ${user.user_id} is already mapped to Tier ${guest.tier_id}`
            );
          }
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
