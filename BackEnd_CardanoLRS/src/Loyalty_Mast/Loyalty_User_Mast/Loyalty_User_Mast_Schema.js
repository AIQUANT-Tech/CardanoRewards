import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  wallet_address: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['End User', 'Business User'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  last_login: {
    type: Date,
    required: true,
  },
  Status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

const User = mongoose.model('User', userSchema);


export default User;
