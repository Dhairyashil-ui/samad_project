const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const Fine = require('../models/Fine');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/transactions/borrow - Issue a book
router.post('/borrow', protect, adminOnly, async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.isActive) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ success: false, message: 'No copies available' });

    const member = await User.findById(memberId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    // Check if member already borrowed this book
    const existing = await Transaction.findOne({ book: bookId, member: memberId, status: { $in: ['borrowed', 'overdue'] } });
    if (existing) return res.status(400).json({ success: false, message: 'Member already borrowed this book' });

    const due = dueDate ? new Date(dueDate) : (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d;
    })();

    const transaction = await Transaction.create({
      book: bookId,
      member: memberId,
      issuedBy: req.user._id,
      dueDate: due
    });

    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1, borrowCount: 1 } });
    await User.findByIdAndUpdate(memberId, { $inc: { borrowedCount: 1 } });

    await transaction.populate(['book', 'member', 'issuedBy']);
    res.status(201).json({ success: true, data: transaction, message: 'Book issued successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/transactions/:id/return - Return a book
router.put('/:id/return', protect, adminOnly, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ success: false, message: 'Book already returned' });

    const returnDate = new Date();
    let fineAmount = 0;
    let daysOverdue = 0;

    if (returnDate > transaction.dueDate) {
      daysOverdue = Math.floor((returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysOverdue * 5;
    }

    transaction.returnDate = returnDate;
    transaction.returnedTo = req.user._id;
    transaction.status = 'returned';
    transaction.fineAmount = fineAmount;
    await transaction.save();

    await Book.findByIdAndUpdate(transaction.book, { $inc: { availableCopies: 1 } });
    await User.findByIdAndUpdate(transaction.member, { $inc: { borrowedCount: -1, totalFines: fineAmount } });

    if (fineAmount > 0) {
      await Fine.create({
        member: transaction.member,
        transaction: transaction._id,
        amount: fineAmount,
        daysOverdue,
        reason: 'overdue'
      });
    }

    await transaction.populate(['book', 'member', 'returnedTo']);
    res.json({ success: true, data: transaction, fineAmount, message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/transactions/:id/renew - Renew a transaction
router.put('/:id/renew', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ success: false, message: 'Cannot renew returned book' });
    if (transaction.renewCount >= transaction.maxRenewals) return res.status(400).json({ success: false, message: 'Maximum renewals reached' });
    if (transaction.status === 'overdue') return res.status(400).json({ success: false, message: 'Cannot renew overdue book' });

    const newDue = new Date(transaction.dueDate);
    newDue.setDate(newDue.getDate() + 14);
    transaction.dueDate = newDue;
    transaction.renewCount += 1;
    await transaction.save();
    await transaction.populate(['book', 'member']);
    res.json({ success: true, data: transaction, message: 'Transaction renewed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/transactions - Get all transactions (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, memberId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (memberId) query.member = memberId;

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find(query).populate('book', 'title author isbn coverImage').populate('member', 'name email membershipId avatar').populate('issuedBy', 'name').sort('-createdAt').skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query)
    ]);
    res.json({ success: true, data: transactions, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/transactions/my - My transactions (member)
router.get('/my', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ member: req.user._id }).populate('book', 'title author isbn coverImage genre').sort('-createdAt');
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/transactions/overdue - Get overdue books
router.get('/overdue/list', protect, adminOnly, async (req, res) => {
  try {
    const overdue = await Transaction.find({
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: new Date() }
    }).populate('book', 'title author isbn').populate('member', 'name email membershipId phone');
    // Update statuses
    for (const t of overdue) {
      if (t.status !== 'overdue') {
        t.status = 'overdue';
        const daysOverdue = Math.floor((new Date() - t.dueDate) / (1000 * 60 * 60 * 24));
        t.fineAmount = daysOverdue * 5;
        await t.save();
      }
    }
    res.json({ success: true, data: overdue, count: overdue.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
