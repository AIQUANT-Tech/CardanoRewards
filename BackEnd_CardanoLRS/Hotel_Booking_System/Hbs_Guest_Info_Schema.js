import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const GuestInfoSchema = new mongoose.Schema({
  guest_id: {
    type: Number, // ✅ Changed from String to Number
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  phone_number: {
    type: String,
    required: true,
  },
  tier_id: {
    type: Number,
    required: true,
  },
  reward_balance: {
    type: Number,
    required: false,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Apply auto-increment to `guest_id`
GuestInfoSchema.plugin(AutoIncrement, { inc_field: "guest_id" });

const GuestInfo = mongoose.model("GuestInfo", GuestInfoSchema);

export default GuestInfo;
