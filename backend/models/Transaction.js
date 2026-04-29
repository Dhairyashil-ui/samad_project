const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  returnedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue', 'lost'],
    default: 'borrowed'
  },
  renewCount: { type: Number, default: 0 },
  maxRenewals: { type: Number, default: 2 },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-set dueDate to 14 days from issue
transactionSchema.pre('save', function(next) {
  if (!this.dueDate && this.issueDate) {
    const due = new Date(this.issueDate);
    due.setDate(due.getDate() + 14);
    this.dueDate = due;
  }
  // Check if overdue
  if (this.status === 'borrowed' && new Date() > this.dueDate) {
    this.status = 'overdue';
    const daysOverdue = Math.floor((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fineAmount = daysOverdue * 5; // ₹5 per day
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
