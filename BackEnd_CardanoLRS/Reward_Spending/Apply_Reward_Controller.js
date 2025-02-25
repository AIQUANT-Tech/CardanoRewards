import axios from "axios";
import User from "../src/Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js"; // adjust path as needed
import GuestInfo from "../Hotel_Booking_System/Hbs_Guest_Info_Schema.js"; // adjust path as needed
import UserGuestMap from "../src/Scheduler/UserGuestMap.js"; // adjust path as needed

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
    console.log("CoinGecko Response:", response.data);
    if (
      !response.data.cardano ||
      !response.data.cardano[currency.toLowerCase()]
    ) {
      console.error("Invalid API response:", response.data);
      return null;
    }
    // Return the number of ADA per 1 unit of the given currency (here, USD).
    return 1 / response.data.cardano[currency.toLowerCase()];
  } catch (error) {
    console.error("Error fetching ADA conversion rate:", error.message);
    return null;
  }
}

async function getCurrencyToUSDRate(currency) {
  try {
    // If currency is already USD, conversion factor is 1.
    if (currency.toLowerCase() === "usd") return 1;

    console.log(
      `Fetching USD conversion rate for ${currency.toUpperCase()}...`
    );
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    // response.data.rates provides mapping of USD to other currencies.
    const rate = response.data.rates[currency.toUpperCase()];
    if (!rate) {
      console.error("Currency rate not found in response:", response.data);
      return null;
    }
    // 1 USD = rate units of that currency, so conversion factor = 1 / rate.
    return 1 / rate;
  } catch (error) {
    console.error("Error fetching USD conversion rate:", error.message);
    return null;
  }
}

export const applyReward = async (req, res) => {
  try {
    const { user_id, booking_cost, reward_usage, booking_currency } = req.body;

    // Validate input fields.
    if (!user_id || !booking_cost || !reward_usage) {
      return res.status(400).json({
        error: "Missing required fields: user_id, booking_cost, reward_usage",
      });
    }
    if (reward_usage < 0) {
      return res.status(400).json({
        error: "Reward usage must be positive",
      });
    }

    // Determine the currency; default to "usd" if not provided.
    const currency = booking_currency ? booking_currency.toLowerCase() : "usd";

    // Convert booking cost to USD if needed.
    let booking_cost_usd = booking_cost;
    if (currency !== "usd") {
      const conversionFactor = await getCurrencyToUSDRate(currency);
      if (!conversionFactor) {
        return res.status(500).json({
          error: `Failed to fetch conversion rate for currency: ${currency}`,
        });
      }
      booking_cost_usd = booking_cost * conversionFactor;
      console.log(
        `Converted booking cost: ${booking_cost} ${currency.toUpperCase()} = ${booking_cost_usd.toFixed(
          2
        )} USD`
      );
    }

    // Retrieve the user.
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the associated guest via UserGuestMap.
    const mapping = await UserGuestMap.findOne({ user_id: user.user_id });
    if (!mapping) {
      return res.status(404).json({ error: "User-guest mapping not found" });
    }

    // Retrieve guest info.
    const guest = await GuestInfo.findOne({ guest_id: mapping.guest_id });
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    // Check if the guest has sufficient reward balance (in ADA).
    if (guest.reward_balance < reward_usage) {
      return res.status(400).json({ error: "Insufficient reward balance" });
    }

    // Fetch the current conversion rate (ADA per USD) for USD.
    const usdToAdaRate = await getCurrencyToADARate("usd");
    if (!usdToAdaRate) {
      return res
        .status(500)
        .json({ error: "Failed to fetch ADA conversion rate" });
    }

    // Calculate discount in USD.
    // discountUSD = reward_usage (in ADA) divided by (ADA per USD)
    const discountUSD = reward_usage / usdToAdaRate;

    // Calculate final booking cost in USD.
    let final_cost = booking_cost_usd - discountUSD;
    if (final_cost < 0) final_cost = 0;

    // Deduct the used reward (in ADA) from guest's reward balance.
    guest.reward_balance = guest.reward_balance - reward_usage;
    await guest.save();

    return res.status(200).json({
      original_booking_cost: booking_cost,
      booking_currency: currency.toUpperCase(),
      converted_booking_cost_usd: booking_cost_usd,
      discount_applied_usd: discountUSD,
      final_cost_usd: final_cost,
      used_reward_ada: reward_usage,
      new_reward_balance_ada: guest.reward_balance,
    });
  } catch (error) {
    console.error("Error applying reward:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
