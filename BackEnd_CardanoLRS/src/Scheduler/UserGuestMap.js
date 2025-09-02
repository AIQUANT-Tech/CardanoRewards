import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const userGuestMapSchema = new mongoose.Schema({
  user_guest_map_id: {
    type: Number, // ✅ Changed from String to Number
    unique: true,
  },
  user_id: {
    type: Number, // ✅ Matches User schema
    required: true,
    ref: "User",
  },
  guest_id: {
    type: Number, // ✅ Matches GuestInfo schema
    required: true,
    ref: "GuestInfo",
  },
  Status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Auto-increment `user_guest_map_id`
userGuestMapSchema.plugin(AutoIncrement, { inc_field: "user_guest_map_id" });

const UserGuestMap = mongoose.model("UserGuestMap", userGuestMapSchema);
export default UserGuestMap;
