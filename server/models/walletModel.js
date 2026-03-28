import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // performance boost
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["cash", "bank", "upi", "crypto"],
      required: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    limit: {
      type: Number,
      required: true,
      min: 0,
    },

    spent: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


//  Virtual field 
walletSchema.virtual("remaining").get(function () {
  return this.limit - this.spent;
});

//  Ensure virtuals show in API response
walletSchema.set("toJSON", { virtuals: true });
walletSchema.set("toObject", { virtuals: true });



export default mongoose.model("Wallet", walletSchema);

walletSchema.index({ user: 1, name: 1 }, { unique: true });