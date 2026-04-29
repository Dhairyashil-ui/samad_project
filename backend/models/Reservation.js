const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reservationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'ready', 'collected', 'cancelled', 'expired'],
    default: 'pending'
  },
  notificationSent: { type: Boolean, default: false },
  queuePosition: { type: Number, default: 1 }
}, { timestamps: true });

reservationSchema.pre('save', function(next) {
  if (!this.expiryDate) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    this.expiryDate = expiry;
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
