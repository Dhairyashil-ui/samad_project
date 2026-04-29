const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#4F46E5' },
  bookCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
