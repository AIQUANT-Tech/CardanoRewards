import axios from "axios";
import { Constr, Data, Lucid, Blockfrost } from "lucid-cardano";
import User from "../src/Loyalty_Mast/Loyalty_User_Mast/Loyalty_User_Mast_Schema.js";
import GuestInfo from "../Hotel_Booking_System/Hbs_Guest_Info_Schema.js";
import UserGuestMap from "../src/Scheduler/UserGuestMap.js"; // adjust path as needed
import {
  lockFunds,
  redeemFunds,
  scriptAddress,
} from "../Cardano_Smartcontract/CardanoLucidRedeemReward.js";

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    process.env.BLOCKFROST_KEY
  ),
  "Preprod"
);

async function getCurrencyToADARate(currency) {
  try {
    console.log(
      `Fetching ADA/${currency.toUpperCase()} exchange rate from CoinGecko...`
    );
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      { params: { ids: "cardano", vs_currencies: currency.toLowerCase() } }
    );
    console.log("CoinGecko Response:", response.data);
    if (
      !response.data.cardano ||
      !response.data.cardano[currency.toLowerCase()]
    ) {
      console.error("Invalid API response:", response.data);
      return null;
    }
    return 1 / response.data.cardano[currency.toLowerCase()];
  } catch (error) {
    console.error("Error fetching ADA conversion rate:", error.message);
    return null;
  }
}

async function getCurrencyToUSDRate(currency) {
  try {
    if (currency.toLowerCase() === "usd") return 1;
    console.log(
      `Fetching USD conversion rate for ${currency.toUpperCase()}...`
    );
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const rate = response.data.rates[currency.toUpperCase()];
    if (!rate) {
      console.error("Currency rate not found in response:", response.data);
      return null;
    }
    return 1 / rate;
  } catch (error) {
    console.error("Error fetching USD conversion rate:", error.message);
    return null;
  }
}

/**
 * Waits until a UTxO with a matching datum appears at the given script address.
 *
 * @param {string} scriptAddress - The script address to poll.
 * @param {object} targetDatum - The datum we expect (Lucid Constr value).
 * @param {number} pollInterval - Time (in ms) between polls (default 10 seconds).
 * @param {number} maxAttempts - Maximum number of polling attempts (default 18 ~ 3 minutes).
 */
async function waitForUTxO(
  scriptAddress,
  targetDatum,
  expectedTxHash,
  pollInterval = 10000,
  maxAttempts = 18
) {
  let attempts = 0;
  const expectedDatumHex = Data.to(targetDatum);
  while (attempts < maxAttempts) {
    const utxos = await lucid.utxosAt(scriptAddress);
    // Look for a UTxO that has the expected datum AND matches our expected txHash.
    const matchingUtxo = utxos.find(
      (utxo) =>
        utxo.datum === expectedDatumHex && utxo.txHash === expectedTxHash
    );
    if (matchingUtxo) {
      console.log("Target UTxO with expected txHash found on-chain.");
      return;
    }
    console.log(
      `UTxO not found, attempt ${attempts + 1} of ${maxAttempts}. Waiting...`
    );
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    attempts++;
  }
  throw new Error(
    "Timed out waiting for UTxO with the target datum and expected txHash"
  );
}

export const applyReward = async (req, res) => {
  try {
    const { user_id, booking_cost, reward_usage, booking_currency } = req.body;
    if (!user_id || !booking_cost || !reward_usage) {
      return res.status(400).json({
        error: "Missing required fields: user_id, booking_cost, reward_usage",
      });
    }
    if (reward_usage < 0) {
      return res.status(400).json({ error: "Reward usage must be positive" });
    }
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

    // Retrieve associated guest using UserGuestMap.
    const mapping = await UserGuestMap.findOne({ user_id: user.user_id });
    if (!mapping) {
      return res.status(404).json({ error: "User-guest mapping not found" });
    }
    const guest = await GuestInfo.findOne({ guest_id: mapping.guest_id });
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    // if (guest.reward_balance < reward_usage) {
    //   return res.status(400).json({ error: "Insufficient reward balance" });
    // }

    // Fetch real-time conversion rate (ADA per USD).
    const usdToAdaRate = await getCurrencyToADARate("usd");
    if (!usdToAdaRate) {
      return res
        .status(500)
        .json({ error: "Failed to fetch ADA conversion rate" });
    }

    // Calculate discount in USD.
    const discountUSD = reward_usage / usdToAdaRate;
    let final_cost = booking_cost_usd - discountUSD;
    if (final_cost < 0) final_cost = 0;

    // --- Build Blockchain Datum & Redeemer ---
    // Datum: UserState { uUserId, rewardBalance }
    const userStateDatum = new Constr(0, [
      Buffer.from(user_id.toString()).toString("hex"),
      BigInt(Math.floor(guest.reward_balance)),
    ]);
    // Redeemer: RedeemRequest { userId, redeemReward, referenceId, requiredReward, value, timestamp }
    const currentTimestamp = BigInt(Date.now());
    const redeemRequestRedeemer = new Constr(0, [
      Buffer.from(user_id.toString()).toString("hex"),
      BigInt(Math.floor(reward_usage)),
      Buffer.from(`ref-${user_id}-${Date.now()}`).toString("hex"),
      BigInt(Math.floor(reward_usage)),
      BigInt(Math.floor(booking_cost_usd * 1000000)), // value in lovelace (assuming 1 USD = 1,000,000 lovelace)
      currentTimestamp,
    ]);
    // --- End Blockchain Datum & Redeemer ---

    // Call blockchain function to lock funds.
    console.log("Locking funds on-chain...");
    const lockTxHash = await lockFunds(userStateDatum);
    if (!lockTxHash) {
      return res.status(500).json({ error: "Lock funds failed on blockchain" });
    }
    console.log("Funds locked, transaction hash:", lockTxHash);

    console.log("Waiting for UTxO to appear on-chain with txHash:", lockTxHash);
    await waitForUTxO(scriptAddress, userStateDatum, lockTxHash, 10000, 18);

    // Call blockchain function to redeem funds.
    console.log("Redeeming funds on-chain...");
    const redeemTxHash = await redeemFunds(
      userStateDatum,
      redeemRequestRedeemer
    );
    if (!redeemTxHash) {
      return res
        .status(500)
        .json({ error: "Redeem funds failed on blockchain" });
    }
    console.log("Funds redeemed, transaction hash:", redeemTxHash);

    // Update off-chain: Deduct reward_usage from guest reward_balance.
    guest.reward_balance = guest.reward_balance - reward_usage;
    await guest.save();

    const newRewardBalanceStr =
      typeof guest.reward_balance === "bigint"
        ? guest.reward_balance.toString()
        : guest.reward_balance;

    return res.status(200).json({
      original_booking_cost: booking_cost,
      booking_currency: currency.toUpperCase(),
      converted_booking_cost_usd: booking_cost_usd,
      discount_applied_usd: discountUSD,
      final_cost_usd: final_cost,
      used_reward_ada: reward_usage,
      new_reward_balance_ada: newRewardBalanceStr,
      lock_tx: lockTxHash,
      redeem_tx: redeemTxHash,
    });
  } catch (error) {
    console.error("Error applying reward:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
