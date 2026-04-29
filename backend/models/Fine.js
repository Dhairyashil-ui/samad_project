const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  amount: { type: Number, required: true, min: 0 },
  reason: {
    type: String,
    enum: ['overdue', 'lost', 'damaged', 'other'],
    default: 'overdue'
  },
  daysOverdue: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidDate: { type: Date },
  paidTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, enum: ['cash', 'online', 'waived'], default: 'cash' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Fine', fineSchema);
