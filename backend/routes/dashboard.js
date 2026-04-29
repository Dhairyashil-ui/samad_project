const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Fine = require('../models/Fine');
const Reservation = require('../models/Reservation');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/dashboard/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBooks, totalMembers, activeLoans, overdueLoans,
      totalFines, unpaidFines, pendingReservations,
      booksAddedThisMonth, newMembersThisMonth, loansThisMonth
    ] = await Promise.all([
      Book.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Transaction.countDocuments({ status: 'borrowed' }),
      Transaction.countDocuments({ status: 'overdue' }),
      Fine.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Fine.aggregate([{ $match: { isPaid: false } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Reservation.countDocuments({ status: 'pending' }),
      Book.countDocuments({ isActive: true, createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Transaction.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        totalMembers,
        activeLoans,
        overdueLoans,
        totalFinesCollected: totalFines[0]?.total || 0,
        unpaidFines: unpaidFines[0]?.total || 0,
        pendingReservations,
        booksAddedThisMonth,
        newMembersThisMonth,
        loansThisMonth
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/dashboard/recent-activity
router.get('/recent-activity', protect, adminOnly, async (req, res) => {
  try {
    const [recentLoans, recentReturns, recentMembers] = await Promise.all([
      Transaction.find({ status: 'borrowed' }).populate('book', 'title author coverImage').populate('member', 'name avatar membershipId').sort('-createdAt').limit(5),
      Transaction.find({ status: 'returned' }).populate('book', 'title author').populate('member', 'name avatar').sort('-returnDate').limit(5),
      User.find().sort('-createdAt').limit(5).select('name email avatar role joinDate membershipId')
    ]);
    res.json({ success: true, data: { recentLoans, recentReturns, recentMembers } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/dashboard/popular-books
router.get('/popular-books', protect, async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).sort('-borrowCount').limit(8).populate('category', 'name');
    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/dashboard/monthly-trend
router.get('/monthly-trend', protect, adminOnly, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await Transaction.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          borrows: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json({ success: true, data: trend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
