import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const loyaltyOfferSchema = new mongoose.Schema({
  offer_id: {
    type: Number,
    unique: true,
  },
  offer_name: {
    type: String,
    required: true,
  },
  offer_desc: {
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
  status: {
    type: String,
    enum: ['A', 'I', 'D'], // Active, Inactive, Deleted
    required: true,
  },
});

loyaltyOfferSchema.plugin(AutoIncrement, { inc_field: 'offer_id' });

const LoyaltyOffer = mongoose.model('LoyaltyOffer', loyaltyOfferSchema);

export default LoyaltyOffer;
