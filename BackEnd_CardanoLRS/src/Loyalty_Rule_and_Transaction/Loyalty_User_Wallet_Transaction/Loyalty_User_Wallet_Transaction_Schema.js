import mongoose from "mongoose";

const loyaltyUserWalletTransactionSchema = new mongoose.Schema({
  transaction_id: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: Number,
    required: true,
    ref: 'User', 
  },
  transaction_date: {
    type: Date,
    required: true,
  },
  transaction_amount: {
    type: Number,
    required: false, 
  },
  transaction_type: {
    type: String,
    enum: ['credit', 'debit', 'transfer'], 
    required: true,
  },
  transaction_desc: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I'], // Active, Inactive
    required: true,
  },
});

const LoyaltyUserWalletTransaction = mongoose.model('LoyaltyUserWalletTransaction', loyaltyUserWalletTransactionSchema);

export default LoyaltyUserWalletTransaction;
