import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const loyaltyTierSchema = new mongoose.Schema({
  tier_id: {
    type: Number,
    unique: true,
  },
  tier_name: {
    type: String,
    required: true,
  },
  tier_desc: {
    type: String,
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
    enum: ['A', 'I', 'D'], 
    required: true,
  },
});

loyaltyTierSchema.plugin(AutoIncrement, { inc_field: 'tier_id' });

const LoyaltyTier = mongoose.model('LoyaltyTier', loyaltyTierSchema);

export default LoyaltyTier;
