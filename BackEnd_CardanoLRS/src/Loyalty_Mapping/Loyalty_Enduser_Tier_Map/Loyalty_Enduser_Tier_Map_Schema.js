import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const loyaltyEndUserTierMapSchema = new mongoose.Schema({
  mapping_id: {
    type: Number,
    unique: true,
    required: true,
  },
  tier_id: {
    type: Number,
    required: true,
    ref: "LoyaltyTier",
  },
  user_id: {
    type: Number,
    required: true,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  modified_at: {
    type: Date,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  modified_by: {
    type: String,
    required: true,
  },
  last_tier_assigned_at: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["A", "I"],
    required: true,
  },
});

const LoyaltyEndUserTierMap = mongoose.model(
  "LoyaltyEndUserTierMap",
  loyaltyEndUserTierMapSchema
);

export default LoyaltyEndUserTierMap;
