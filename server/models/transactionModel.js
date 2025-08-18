import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },

    amount: { type: Number, required: true },

    date: { type: Date, required: true },

    category: {
      type: String,
      enum: [
        'Food', 'Transport', 'Rent', 'Entertainment',
        'Shopping', 'Medical', 'Sports', 'Other',
      ],
      
    },

    method: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Wallet'],
      
    },

    notes: { type: String },

    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      default: 'expense',
    },
    lastModified: { type: Date, default: Date.now },
  },
   
  { timestamps: true }
);
transactionSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});



const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
