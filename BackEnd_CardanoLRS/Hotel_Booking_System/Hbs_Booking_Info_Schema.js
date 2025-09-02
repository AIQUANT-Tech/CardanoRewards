// import mongoose from "mongoose";
// import mongooseSequence from "mongoose-sequence";

// const AutoIncrement = mongooseSequence(mongoose);

// const BookingInfoSchema = new mongoose.Schema({
//   booking_id: {
//     type: Number, // ✅ Changed from String to Number
//     unique: true,
//   },
//   guest_id: {
//     type: Number, // ✅ Changed from String to Number
//     required: true,
//     ref: "GuestInfo", // Foreign key reference to GuestInfo collection
//   },
//   check_in_date: {
//     type: Date,
//     required: true,
//   },
//   check_out_date: {
//     type: Date,
//     required: true,
//   },
//   booking_status: {
//     type: String,
//     required: true,
//     enum: ["confirmed", "canceled", "pending"],
//   },
//   total_amount: {
//     type: mongoose.Types.Decimal128,
//     required: true,
//   },
//   payment_status: {
//     type: String,
//     required: true,
//     enum: ["paid", "pending", "failed"],
//   },
//   payment_date: {
//     type: Date,
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   updated_at: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
// });

// // ✅ Auto-increment `booking_id`
// BookingInfoSchema.plugin(AutoIncrement, { inc_field: "booking_id" });

// BookingInfoSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });

// const BookingInfo = mongoose.model("BookingInfo", BookingInfoSchema);

// export default BookingInfo;

// import mongoose from "mongoose";
// import mongooseSequence from "mongoose-sequence";

// const AutoIncrement = mongooseSequence(mongoose);

// const BookingInfoSchema = new mongoose.Schema({
//   booking_id: {
//     type: Number, // Changed from String to Number
//     unique: true,
//   },
//   guest_id: {
//     type: Number, // Changed from String to Number
//     required: true,
//     ref: "GuestInfo", // Reference to GuestInfo collection
//   },
//   check_in_date: {
//     type: Date,
//     required: true,
//   },
//   check_out_date: {
//     type: Date,
//     required: true,
//   },
//   booking_status: {
//     type: String,
//     required: true,
//     enum: ["confirmed", "canceled", "pending"],
//   },
//   total_amount: {
//     type: mongoose.Types.Decimal128,
//     required: true,
//   },
//   payment_status: {
//     type: String,
//     required: true,
//     enum: ["paid", "pending", "failed"],
//   },
//   payment_date: {
//     type: Date,
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   updated_at: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   // Fields to prevent reprocessing
//   processed: {
//     type: Boolean,
//     default: false,
//   },
//   processed_at: {
//     type: Date,
//   },
// });

// // Auto-increment booking_id
// BookingInfoSchema.plugin(AutoIncrement, { inc_field: "booking_id" });

// // Update updated_at on each save
// BookingInfoSchema.pre("save", function (next) {
//   this.updated_at = Date.now();
//   next();
// });

// const BookingInfo = mongoose.model("BookingInfo", BookingInfoSchema);

// export default BookingInfo;

import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const BookingInfoSchema = new mongoose.Schema({
  booking_id: {
    type: Number, // Auto-incremented booking ID
    unique: true,
  },
  guest_id: {
    type: Number, // Reference to GuestInfo
    required: true,
    ref: "GuestInfo",
  },
  check_in_date: {
    type: Date,
    required: true,
  },
  check_out_date: {
    type: Date,
    required: true,
  },
  booking_status: {
    type: String,
    required: true,
    enum: ["confirmed", "canceled", "pending"],
  },
  // The original amount as provided by HBS (in original currency)
  original_total_amount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  // The ISO currency code of the original amount (e.g., "INR", "USD")
  currency: {
    type: String,
    required: true,
    default: "USD",
  },
  // The converted amount in USD (calculated before saving)
  total_spend: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["paid", "pending", "failed"],
  },
  payment_date: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Fields to prevent reprocessing
  processed: {
    type: Boolean,
    default: false,
  },
  processed_at: {
    type: Date,
  },
});

// Auto-increment booking_id
BookingInfoSchema.plugin(AutoIncrement, { inc_field: "booking_id" });

// Update updated_at on each save
BookingInfoSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const BookingInfo = mongoose.model("BookingInfo", BookingInfoSchema);

export default BookingInfo;
