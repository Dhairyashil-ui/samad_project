const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/books - Get all books with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, genre, category, available, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (genre) query.genre = { $regex: genre, $options: 'i' };
    if (category) query.category = category;
    if (available === 'true') query.availableCopies = { $gt: 0 };

    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      Book.find(query).populate('category', 'name icon color').populate('addedBy', 'name').sort(sort).skip(skip).limit(Number(limit)),
      Book.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: books,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name icon color').populate('addedBy', 'name avatar');
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/books - Add new book (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const bookData = { ...req.body, addedBy: req.user._id };
    const book = await Book.create(bookData);
    if (book.category) {
      await Category.findByIdAndUpdate(book.category, { $inc: { bookCount: 1 } });
    }
    res.status(201).json({ success: true, data: book, message: 'Book added successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'ISBN already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/books/:id - Update book (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book, message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/books/:id - Delete book (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/books/stats/overview
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
  try {
    const [total, available, genres] = await Promise.all([
      Book.countDocuments({ isActive: true }),
      Book.countDocuments({ isActive: true, availableCopies: { $gt: 0 } }),
      Book.distinct('genre', { isActive: true })
    ]);
    res.json({ success: true, data: { total, available, unavailable: total - available, genres: genres.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
