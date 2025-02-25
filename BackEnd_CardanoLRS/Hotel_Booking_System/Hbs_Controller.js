// import GuestInfo from "./Hbs_Guest_Info_Schema.js";
// import BookingInfo from "./Hbs_Booking_Info_Schema.js";

// export const processGuestBookingInfo = async (req, res) => {
//   try {
//     const { guest_booking_info_rq } = req.body;

//     if (!guest_booking_info_rq || !guest_booking_info_rq.guest_list) {
//       return res.status(400).json({ error: "Invalid request format" });
//     }

//     const bookings = [];

//     for (const guestData of guest_booking_info_rq.guest_list) {
//       const {
//         guest_id,
//         first_name,
//         last_name,
//         email,
//         phone_number,
//         tier_id,
//         reward_balance,
//         booking_id,
//         check_in_date,
//         check_out_date,
//         booking_status,
//         total_amount,
//         payment_status,
//         payment_date,
//       } = guestData;

//       // Check if guest already exists by email
//       let guest = await GuestInfo.findOne({ email });
//       if (!guest) {
//         // Create a new guest if not found
//         guest = new GuestInfo({
//           guest_id,
//           first_name,
//           last_name,
//           email,
//           phone_number,
//           tier_id,
//           reward_balance,
//           created_at: new Date(),
//         });
//         await guest.save();
//         console.log(`Created new guest: ${email}`);
//       } else {
//         // Update guest information if needed
//         guest.first_name = first_name;
//         guest.last_name = last_name;
//         guest.phone_number = phone_number;
//         guest.tier_id = tier_id;
//         await guest.save();
//         console.log(`Updated existing guest: ${email}`);
//       }

//       // Check if a booking with the same booking_id already exists
//       const existingBooking = await BookingInfo.findOne({ booking_id });
//       if (existingBooking) {
//         console.log(
//           `Booking with id ${booking_id} already exists. Skipping this booking.`
//         );
//         continue;
//       }

//       // Create booking document using the guest's guest_id (from existing or newly created guest)
//       const booking = new BookingInfo({
//         booking_id,
//         guest_id: guest.guest_id,
//         check_in_date: new Date(check_in_date),
//         check_out_date: new Date(check_out_date),
//         booking_status,
//         total_amount,
//         payment_status,
//         payment_date: new Date(payment_date),
//         created_at: new Date(),
//         updated_at: new Date(),
//       });

//       bookings.push(booking);
//     }

//     // Save all new bookings
//     if (bookings.length > 0) {
//       await BookingInfo.insertMany(bookings);
//       console.log("Bookings inserted successfully");
//     } else {
//       console.log("No new bookings to insert");
//     }

//     res
//       .status(201)
//       .json({ message: "Guest and booking data processed successfully" });
//   } catch (error) {
//     console.error("Error processing guest booking info:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };


import GuestInfo from "./Hbs_Guest_Info_Schema.js";
import BookingInfo from "./Hbs_Booking_Info_Schema.js";
import axios from "axios";

/**
 * Fetches the conversion rate to convert the given currency to USD.
 * For example, if the API returns that 1 USD = 82.5 INR, then this function returns 1/82.5.
 */
async function getCurrencyToUSDRate(currency) {
  try {
    console.log(`Fetching USD/${currency.toUpperCase()} exchange rate...`);
    // Using ExchangeRate-API (or similar) to get rates for USD.
    const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.data || !response.data.rates || !response.data.rates[currency.toUpperCase()]) {
      console.error("Invalid exchange rate response", response.data);
      return null;
    }
    // If the API returns: rates: { INR: 82.5, ... } then 1 USD = 82.5 INR.
    // To convert from INR to USD: amount_in_usd = original_amount / 82.5.
    // We return the conversion factor: 1 / rate.
    const rate = response.data.rates[currency.toUpperCase()];
    return 1 / rate;
  } catch (error) {
    console.error("Error fetching USD exchange rate:", error.message);
    return null;
  }
}

/**
 * Processes guest booking information.
 * Expects the request body to have:
 * {
 *   "guest_booking_info_rq": {
 *     "guest_list": [
 *       {
 *         "guest_id": Number,
 *         "first_name": "First",
 *         "last_name": "Last",
 *         "email": "email@example.com",
 *         "phone_number": "+123456789",
 *         "tier_id": Number,
 *         "reward_balance": Number,
 *         "booking_id": Number,
 *         "check_in_date": "2024-03-10T14:00:00Z",
 *         "check_out_date": "2024-03-15T11:00:00Z",
 *         "booking_status": "pending",
 *         "total_amount": "26085",   // Original amount (as string or number)
 *         "currency": "INR",         // Original currency code
 *         "payment_status": "pending",
 *         "payment_date": "2024-02-28T15:45:00Z"
 *       }
 *     ]
 *   }
 * }
 * 
 * The code converts the original amount to USD and stores it in `total_spend`.
 */
export const processGuestBookingInfo = async (req, res) => {
  try {
    const { guest_booking_info_rq } = req.body;

    if (!guest_booking_info_rq || !guest_booking_info_rq.guest_list) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const bookings = [];

    for (const guestData of guest_booking_info_rq.guest_list) {
      const {
        guest_id,
        first_name,
        last_name,
        email,
        phone_number,
        tier_id,
        reward_balance,
        booking_id,
        check_in_date,
        check_out_date,
        booking_status,
        total_amount, // Original amount in the provided currency
        currency,     // ISO currency code (e.g., "INR", "USD")
        payment_status,
        payment_date,
      } = guestData;

      // Check if guest already exists by email
      let guest = await GuestInfo.findOne({ email });
      if (!guest) {
        // Create a new guest if not found
        guest = new GuestInfo({
          guest_id,
          first_name,
          last_name,
          email,
          phone_number,
          tier_id,
          reward_balance,
          created_at: new Date(),
        });
        await guest.save();
        console.log(`Created new guest: ${email}`);
      } else {
        // Update guest information if needed (do not overwrite reward_balance)
        guest.first_name = first_name;
        guest.last_name = last_name;
        guest.phone_number = phone_number;
        guest.tier_id = tier_id;
        await guest.save();
        console.log(`Updated existing guest: ${email}`);
      }

      // Check if a booking with the same booking_id already exists
      const existingBooking = await BookingInfo.findOne({ booking_id });
      if (existingBooking) {
        console.log(`Booking with id ${booking_id} already exists. Skipping this booking.`);
        continue;
      }

      // Convert the original total_amount from the provided currency to USD.
      const usdRate = await getCurrencyToUSDRate(currency);
      if (!usdRate) {
        console.error(`Failed to fetch conversion rate for currency: ${currency}`);
        continue; // Skip processing this booking if conversion fails.
      }
      const total_spend = parseFloat(total_amount) * usdRate; // Convert original amount to USD

      // Create a new booking document.
      const booking = new BookingInfo({
        booking_id,
        guest_id: guest.guest_id,
        check_in_date: new Date(check_in_date),
        check_out_date: new Date(check_out_date),
        booking_status,
        original_total_amount: total_amount,
        currency,       // e.g., "INR"
        total_spend,    // Converted USD amount (e.g., 300)
        payment_status,
        payment_date: new Date(payment_date),
        created_at: new Date(),
        updated_at: new Date(),
      });

      bookings.push(booking);
    }

    // Save all new bookings
    if (bookings.length > 0) {
      await BookingInfo.insertMany(bookings);
      console.log("Bookings inserted successfully");
    } else {
      console.log("No new bookings to insert");
    }

    res
      .status(201)
      .json({ message: "Guest and booking data processed successfully" });
  } catch (error) {
    console.error("Error processing guest booking info:", error.message);
    res.status(500).json({ error: error.message });
  }
};
