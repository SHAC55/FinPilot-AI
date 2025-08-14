import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amountPaid: Number,
    amountOwed: Number
  }],
  totalAmount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

const Split = mongoose.model('Split', splitSchema);
export default Split;
