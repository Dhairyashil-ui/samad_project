const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/reservations - Reserve a book
router.post('/', protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) return res.status(404).json({ success: false, message: 'Book not found' });

    const existing = await Reservation.findOne({ book: bookId, member: req.user._id, status: { $in: ['pending', 'ready'] } });
    if (existing) return res.status(400).json({ success: false, message: 'You already have a reservation for this book' });

    const queueCount = await Reservation.countDocuments({ book: bookId, status: 'pending' });
    const reservation = await Reservation.create({
      book: bookId,
      member: req.user._id,
      queuePosition: queueCount + 1
    });
    await reservation.populate(['book', 'member']);
    res.status(201).json({ success: true, data: reservation, message: `Reserved successfully. Queue position: ${reservation.queuePosition}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/reservations - All reservations (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const reservations = await Reservation.find(query).populate('book', 'title author isbn coverImage').populate('member', 'name email membershipId avatar').sort('-createdAt');
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/reservations/my - My reservations
router.get('/my', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ member: req.user._id }).populate('book', 'title author isbn coverImage genre').sort('-createdAt');
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/reservations/:id/cancel - Cancel reservation
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, member: req.user._id });
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    if (reservation.status === 'collected') return res.status(400).json({ success: false, message: 'Already collected' });
    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/reservations/:id/ready - Mark as ready (admin)
router.put('/:id/ready', protect, adminOnly, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status: 'ready', notificationSent: true }, { new: true }).populate(['book', 'member']);
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, data: reservation, message: 'Reservation marked as ready' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
