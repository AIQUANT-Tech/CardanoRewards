import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import { v4 as uuidv4 } from "uuid";

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    index: true,
    // unique: true,
    default: uuidv4,
  },
  hotel_group_id: {
    type: String,
    // required: true,
  },
  hotel_ids: [
    {
      type: String,
      // required: true,
    },
  ],
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
    enum: ["End User", "Business User"],
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

// userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

const User = mongoose.model("User", userSchema);

export default User;
