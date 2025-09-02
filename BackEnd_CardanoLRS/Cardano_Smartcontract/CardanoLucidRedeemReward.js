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

// Matching Number Validator Script (to lock funds)
const script = {
  type: "PlutusV2",
  script: process.env.SCRIPT_CBOR,
};

// Derive script address
export const scriptAddress = lucid.utils.validatorToAddress(script);
console.log(scriptAddress);

// Lock ADA at the script
export const lockFunds = async (dataToLock) => {
  if (typeof dataToLock !== "object" || dataToLock === null) {
    throw new Error("Datum must be a valid JSON object");
  }
  console.log("Working On Locking The Funds");

  // const transformedData = encode(dataToLock).toString("hex");
  // console.log("Transformed Datum:", JSON.stringify(dataToLock, null, 2));

  // const cborDatum = encode(dataToLock).toString("hex");
  // console.log("Encoded CBOR Datum:", cborDatum);

  // console.log("Encoded Redeemer:", transformedData);

  // console.log(scriptAddress);

  try {
    const utxos = await lucid.utxosAt(scriptAddress);
    if (!utxos || utxos.length === 0) {
      throw new Error("No UTxOs found at the given address");
    }

    const tx = await lucid
      .newTx()
      .payToContract(
        scriptAddress,
        {
          inline: Data.to(dataToLock),
          scriptRef: script,
        },
        { lovelace: BigInt(process.env.AMMOUNT_ADA) }
      )
      .complete();

    // console.log("working upto here!");

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
  } catch (error) {
    console.error("Error locking funds:", error);
    throw new Error("Error locking funds");
  }
};

export async function redeemFunds(datumToRedeem, redeemer) {
  try {
    // Validate input datum
    if (typeof datumToRedeem !== "object" || datumToRedeem === null) {
      throw new Error("Invalid datum: Expected a valid JSON object.");
    }

    console.log("Working On Unlocking The Funds");

    const datumCbor = Data.to(datumToRedeem);
    // console.log("🔹 Encoded Datum (CBOR):", datumCbor);

    // Fetch script UTxOs and find the one matching your datum
    const scriptUtxos = await lucid.utxosAt(scriptAddress);
    const utxoToRedeem = scriptUtxos.find((utxo) => utxo.datum === datumCbor);
    if (!utxoToRedeem) throw new Error("No valid UTxO with datum found!");
    // console.log("🔹 Selected UTxO to redeem:", utxoToRedeem);

    // console.log("🔹 Encoded Redeemer (CBOR):", Data.to(redeemer));

    // ----------------------------
    // Step 1: Build a draft transaction to calculate fee.
    // ----------------------------
    let txBuilderDraft = lucid.newTx();

    // If the UTxO does NOT have a scriptRef, then try to get a reference input.
    // Otherwise, if it has a scriptRef, we do nothing extra.
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

    // Build draft transaction with a dummy output (0 lovelace) so we can calculate the fee.
    txBuilderDraft = txBuilderDraft
      .collectFrom([utxoToRedeem], Data.to(redeemer))
      .addSigner(await lucid.wallet.address())
      .payToAddress(await lucid.wallet.address(), { lovelace: 0n });

    // Complete the draft transaction so Lucid calculates the fee.
    const draftTx = await txBuilderDraft.complete();
    // console.log("Draft Transaction Built:", draftTx);
    console.log("Draft Calculated fee:", draftTx.fee);

    // ----------------------------
    // Step 2: Rebuild the transaction with the correct output.
    // ----------------------------
    // Calculate the amount to send: total input (from the UTxO) minus the fee.
    const totalInput = utxoToRedeem.assets.lovelace; // BigInt
    const feeBigInt = BigInt(draftTx.fee); // Explicit conversion to BigInt
    const amountToSend = totalInput - feeBigInt;
    if (amountToSend <= 0n) {
      throw new Error("Not enough funds to cover the fee.");
    }
    console.log("Calculated amount to send:", amountToSend);

    // Build final transaction.
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

    txBuilderFinal = txBuilderFinal
      .collectFrom([utxoToRedeem], Data.to(redeemer))
      .addSigner(await lucid.wallet.address())
      .payToAddress(await lucid.wallet.address(), { lovelace: amountToSend });

    const finalTx = await txBuilderFinal.complete();
    // console.log("Final Transaction Built:", finalTx);
    console.log("Final Calculated fee:", finalTx.fee);

    const signedTx = await finalTx.sign().complete();
    const txHash = await signedTx.submit();
    console.log("Funds redeemed successfully with transaction:", txHash);
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

    //const redeemers = txDetails.witness.redeemers || [];

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

export const lockFundsController = async (req, res) => {
  const { datum } = req.body;
  console.log(datum);

  if (!datum) {
    return res.status(400).json({ error: "No data provided to lock" });
  }

  try {
    const txHash = await lockFunds(datum);
    res.status(200).json({ txHash });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error locking funds", details: error.message });
  }
};

export const redeemFundsController = async (req, res) => {
  const { datum, redeemer } = req.body;

  if (!redeemer) {
    return res.status(400).json({ error: "No redeemer provided to unlock" });
  }
  if (!datum) {
    return res.status(400).json({ error: "No datum provided to unlock" });
  }
  try {
    const txHash = await redeemFunds(datum, redeemer);
    res.status(200).json({ txHash });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error redeeming funds", details: error.message });
  }
};

export const TxDetails = async (req, res) => {
  const { tx } = req.body;
  console.log(tx);

  if (!tx) {
    return res.status(400).json({ error: "No redeemer provided to lock" });
  }
  try {
    const details = await getTransactionDetails(tx);
    res.status(200).json({ details });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error redeeming funds", details: error.message });
  }
};
