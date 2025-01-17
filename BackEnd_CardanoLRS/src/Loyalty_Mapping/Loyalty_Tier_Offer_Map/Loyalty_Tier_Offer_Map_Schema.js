import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const loyaltyTierOfferMapSchema = new mongoose.Schema({
  mapping_id: {
    type: Number,
    unique: true,
  },
  tier_id: {
    type: Number,
    required: true,
    ref: 'LoyaltyTier', 
  },
  offer_id: {
    type: Number,
    required: true,
    ref: 'LoyaltyOffer', 
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
    enum: ['A', 'I'], 
    required: true,
  },
});

loyaltyTierOfferMapSchema.plugin(AutoIncrement, { inc_field: 'mapping_id' });

const LoyaltyTierOfferMap = mongoose.model('LoyaltyTierOfferMap', loyaltyTierOfferMapSchema);

export default LoyaltyTierOfferMap;
