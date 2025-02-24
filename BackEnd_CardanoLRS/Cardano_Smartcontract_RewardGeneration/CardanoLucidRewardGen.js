// controllers/transactionController.js
import { Lucid, Blockfrost, Constr, Data, fromHex, toHex } from "lucid-cardano";
import dotenv from "dotenv";
import cbor from "cbor";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

// Load environment variables
dotenv.config();

const { encode } = cbor;

const blockfrost = new BlockFrostAPI({ projectId: process.env.BLOCKFROST_KEY });

// Initialize Lucid
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    process.env.BLOCKFROST_KEY
  ),
  "Preprod"
);

// Connect wallet using the mnemonic
lucid.selectWalletFromSeed(process.env.MNEMONIC);

// The on-chain validator expects a LoyaltyTransaction datum.
// Its structure is: { amount, existingBalance, timestamp }.
// The following script information must match your compiled Plutus script.
const script = {
  type: "PlutusV2",
  script: process.env.SCRIPT_CBOR_REWARDGEN,
};

// Derive script address from the validator script
const scriptAddress = lucid.utils.validatorToAddress(script);
console.log("Script Address:", scriptAddress);

// LOCK FUNDS
// Lock ADA at the script using a LoyaltyTransaction datum.
const lockFundsRewardGen = async (dataToLock) => {
  if (typeof dataToLock !== "object" || dataToLock === null) {
    throw new Error("Datum must be a valid JSON object");
  }

  // Expecting dataToLock to contain: amount, existingBalance, timestamp
  const { amount, existingBalance, timestamp } = dataToLock;
  if (amount < 0) {
    throw new Error("Amount must be non-negative");
  }

  // Construct the LoyaltyTransaction datum.
  // The order of fields must match your Haskell data type.
  const loyaltyDatum = new Constr(0, [
    BigInt(amount),
    BigInt(existingBalance),
    BigInt(timestamp),
  ]);
  const datumCbor = Data.to(loyaltyDatum);

  console.log(
    "Transformed LoyaltyTransaction Datum:",
    JSON.stringify({ amount, existingBalance, timestamp }, null, 2)
  );
  console.log("Encoded CBOR Datum:", datumCbor);

  try {
    // Optionally, you might check for existing UTxOs at the script address.
    const utxos = await lucid.utxosAt(scriptAddress);
    console.log("UTxOs at script address:", utxos);

    const tx = await lucid
      .newTx()
      .payToContract(
        scriptAddress,
        { inline: datumCbor, scriptRef: script },
        { lovelace: BigInt(process.env.AMMOUNT_ADA) }
      )
      .complete();

    console.log("Transaction built, signing and submitting...");
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    console.log("Funds locked with transaction:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error locking funds:", error);
    throw new Error("Error locking funds: " + error.message);
  }
};

// REDEEM FUNDS
// Redeem funds by consuming the UTxO at the script and producing a new one
// with an updated LoyaltyTransaction datum (i.e. updated balance).
async function redeemFundsRewardGen(datumToRedeem, redeemer) {
  try {
    // Validate input datum
    if (typeof datumToRedeem !== "object" || datumToRedeem === null) {
      throw new Error("Invalid datum: Expected a valid JSON object.");
    }

    // Extract original fields from the provided datum.
    const { amount, existingBalance, timestamp } = datumToRedeem;
    // Construct the originally locked datum.
    const lockedDatum = new Constr(0, [
      BigInt(amount),
      BigInt(existingBalance),
      BigInt(timestamp),
    ]);
    const datumCbor = Data.to(lockedDatum);
    console.log("🔹 Original Locked Datum (CBOR):", datumCbor);

    // Compute updated datum using the same logic as storeRewardDetails:
    // updatedBalance = existingBalance + amount.
    const updatedExistingBalance = BigInt(existingBalance) + BigInt(amount);
    const updatedDatum = new Constr(0, [
      BigInt(amount),
      updatedExistingBalance,
      BigInt(timestamp),
    ]);
    const updatedDatumCbor = Data.to(updatedDatum);
    console.log("🔹 Updated Datum (CBOR):", updatedDatumCbor);

    // Prepare a dummy redeemer (the on-chain validator ignores the redeemer).
    const redeemerCbor = Data.to(new Constr(0, []));
    console.log("🔹 Using dummy redeemer (CBOR):", redeemerCbor);

    // Fetch script UTxOs and find the one matching your original datum.
    const scriptUtxos = await lucid.utxosAt(scriptAddress);
    const utxoToRedeem = scriptUtxos.find((utxo) => utxo.datum === datumCbor);
    if (!utxoToRedeem)
      throw new Error("No valid UTxO with the provided datum found!");
    console.log("🔹 Selected UTxO to redeem:", utxoToRedeem);

    // ----------------------------
    // Step 1: Build a draft transaction to calculate fee.
    // ----------------------------
    let txBuilderDraft = lucid.newTx();

    // If the UTxO does NOT have a scriptRef, try to attach a reference input.
    if (!utxoToRedeem.scriptRef) {
      const paymentUtxos = await lucid.utxosAt(await lucid.wallet.address());
      const separateReferenceUtxo = paymentUtxos.find(
        (utxo) => utxo.txHash !== utxoToRedeem.txHash
      );
      if (separateReferenceUtxo) {
        console.log(
          "✅ Using separate reference input:",
          separateReferenceUtxo.txHash
        );
        txBuilderDraft = txBuilderDraft.readFrom([separateReferenceUtxo]);
      } else {
        console.log(
          "✅ No separate reference input found; attaching spending validator manually."
        );
        txBuilderDraft = txBuilderDraft.attachSpendingValidator(script);
      }
    } else {
      console.log(
        "✅ UTxO has a script reference; no need to attach validator manually."
      );
    }

    // Create a draft transaction that collects the UTxO and produces a dummy output
    // to the script with the updated datum (0 lovelace for fee calculation).
    txBuilderDraft = txBuilderDraft
      .collectFrom([utxoToRedeem], redeemerCbor)
      .payToContract(
        scriptAddress,
        { inline: updatedDatumCbor },
        { lovelace: 0n }
      )
      .addSigner(await lucid.wallet.address());

    const draftTx = await txBuilderDraft.complete();
    console.log("Draft Transaction Built:", draftTx);
    console.log("Draft Calculated fee:", draftTx.fee);

    // ----------------------------
    // Step 2: Rebuild the transaction with the correct output.
    // ----------------------------
    // Calculate the new amount to lock: total input minus fee.
    const totalInput = utxoToRedeem.assets.lovelace; // BigInt
    const feeBigInt = BigInt(draftTx.fee);
    const newLockedAmount = totalInput - feeBigInt;
    if (newLockedAmount <= 0n) {
      throw new Error("Not enough funds to cover the fee.");
    }
    console.log("Calculated amount to lock in contract:", newLockedAmount);

    let txBuilderFinal = lucid.newTx();
    if (!utxoToRedeem.scriptRef) {
      const paymentUtxos = await lucid.utxosAt(await lucid.wallet.address());
      const separateReferenceUtxo = paymentUtxos.find(
        (utxo) => utxo.txHash !== utxoToRedeem.txHash
      );
      if (separateReferenceUtxo) {
        console.log(
          "✅ Using separate reference input:",
          separateReferenceUtxo.txHash
        );
        txBuilderFinal = txBuilderFinal.readFrom([separateReferenceUtxo]);
      } else {
        console.log(
          "✅ No separate reference input found; attaching spending validator manually."
        );
        txBuilderFinal = txBuilderFinal.attachSpendingValidator(script);
      }
    } else {
      console.log(
        "✅ UTxO has a script reference; no need to attach validator manually."
      );
    }

    // Build the final transaction:
    // - It collects the UTxO using the dummy redeemer.
    // - It outputs a new UTxO to the script address with the updated datum and all remaining funds.
    txBuilderFinal = txBuilderFinal
      .collectFrom([utxoToRedeem], redeemerCbor)
      .addSigner(await lucid.wallet.address())
      .payToContract(
        scriptAddress,
        { inline: updatedDatumCbor },
        { lovelace: newLockedAmount }
      );

    const finalTx = await txBuilderFinal.complete();
    console.log("Final Transaction Built:", finalTx);
    console.log("Final Calculated fee:", finalTx.fee);

    const signedTx = await finalTx.sign().complete();
    const txHash = await signedTx.submit();
    console.log(
      "Funds redeemed successfully with updated state. Transaction:",
      txHash
    );
    return txHash;
  } catch (error) {
    console.error("❌ Error redeeming funds:", error.message);
    throw new Error("Transaction failed: " + error.message);
  }
}

const getTransactionDetails = async (txHash) => {
  try {
    const txDetails = await blockfrost.txsRedeemers(txHash);
    if (!txDetails) {
      console.log("Transaction not found or details unavailable.");
      return;
    }
    if (txDetails.length > 0) {
      console.log("Redeemer Data:", JSON.stringify(txDetails, null, 2));
      const tx = JSON.stringify(txDetails, null, 2);
      return tx;
    } else {
      console.log("No redeemers found in this transaction.");
    }
  } catch (error) {
    console.error("Error fetching transaction redeemers:", error);
  }
};

// Controller methods for the routes
export const lockFundsRewardGenController = async (req, res) => {
  const { datum } = req.body;
  console.log("Lock Funds Datum:", datum);
  if (!datum) {
    return res.status(400).json({ error: "No data provided to lock" });
  }
  try {
    const txHash = await lockFundsRewardGen(datum);
    res.status(200).json({ txHash });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error locking funds", details: error.message });
  }
};

export const redeemFundsRewardGenController = async (req, res) => {
  const { datum, redeemer } = req.body;
  if (!datum) {
    return res.status(400).json({ error: "No datum provided to unlock" });
  }
  // Redeemer content is ignored by the on-chain validator.
  try {
    const txHash = await redeemFundsRewardGen(datum, redeemer);
    res.status(200).json({ txHash });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error redeeming funds", details: error.message });
  }
};

export const TxDetails = async (req, res) => {
  const { tx } = req.body;
  console.log("Transaction hash:", tx);
  if (!tx) {
    return res.status(400).json({ error: "No transaction hash provided" });
  }
  try {
    const details = await getTransactionDetails(tx);
    res.status(200).json({ details });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching transaction details",
      details: error.message,
    });
  }
};
