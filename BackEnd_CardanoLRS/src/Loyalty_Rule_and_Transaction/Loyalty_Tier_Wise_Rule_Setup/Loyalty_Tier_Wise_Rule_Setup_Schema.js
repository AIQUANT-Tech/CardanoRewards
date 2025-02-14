import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const loyaltyTierWiseRuleSetupSchema = new mongoose.Schema({
  rule_id: {
    type: Number,
    unique: true,
  },
  tier_id: {
    type: Number,
    required: true,
    ref: "LoyaltyTier",
  },
  rule_desc: {
    type: String,
    required: true,
  },
  min_threshold: {
    type: Number,
    required: true,
  },
  max_threshold: {
    type: Number,
    required: false,
  },
  percentage_rate: {
    type: Number,
    required: true,
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
  Status: {
    type: String,
    enum: ["A", "I"], // Active, Inactive
    required: true,
  },
});

loyaltyTierWiseRuleSetupSchema.plugin(AutoIncrement, { inc_field: "rule_id" });

const LoyaltyTierWiseRuleSetup = mongoose.model(
  "LoyaltyTierWiseRuleSetup",
  loyaltyTierWiseRuleSetupSchema
);

export default LoyaltyTierWiseRuleSetup;

// Update in .gitignore
