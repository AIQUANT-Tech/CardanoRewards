import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const RewardTransactionSchema = new mongoose.Schema({
  transaction_id: { type: Number, unique: true },
  user_id: { type: Number, required: true, ref: "User" },
  lock_tx: { type: String, required: true },
  redeem_tx: { type: String, default: "" }, // Not required at creation
  status: { type: String, default: "pending" }, // "pending", "success", or "failed"
  error: { type: String, default: "" },
  booking_currency: { type: String, required: true },
  original_booking_cost: { type: Number, required: true },
  converted_booking_cost_usd: { type: Number, required: true },
  discount_applied_usd: { type: Number, required: true },
  final_cost_usd: { type: Number, required: true },
  used_reward_ada: { type: Number, required: true },
  new_reward_balance_ada: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

RewardTransactionSchema.plugin(AutoIncrement, { inc_field: "transaction_id" });

const RewardTransaction = mongoose.model(
  "RewardTransaction",
  RewardTransactionSchema
);
export default RewardTransaction;
