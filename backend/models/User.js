const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'librarian', 'member'], default: 'member' },
  isActive: { type: Boolean, default: true },
  membershipId: { type: String, unique: true, sparse: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  borrowedCount: { type: Number, default: 0 },
  totalFines: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate membershipId
userSchema.pre('save', async function(next) {
  if (!this.membershipId) {
    const count = await mongoose.model('User').countDocuments();
    this.membershipId = `LV${String(count + 1001).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
