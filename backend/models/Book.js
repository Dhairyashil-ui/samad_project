const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  genre: { type: String, default: 'General' },
  description: { type: String, default: '' },
  publisher: { type: String, default: '' },
  publishYear: { type: Number },
  language: { type: String, default: 'English' },
  pages: { type: Number, default: 0 },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  location: { type: String, default: '' }, // shelf/rack location
  coverImage: { type: String, default: '' },
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  borrowCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', isbn: 'text', genre: 'text' });

module.exports = mongoose.model('Book', bookSchema);
