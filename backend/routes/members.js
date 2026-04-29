const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, adminOnly, superAdmin } = require('../middleware/auth');

// @GET /api/members - Get all members (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { membershipId: { $regex: search, $options: 'i' } }];
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    const [members, total] = await Promise.all([
      User.find(query).select('-__v').sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);
    res.json({ success: true, data: members, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/members/:id - Get single member
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-__v');
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    const [activeLoans, history] = await Promise.all([
      Transaction.find({ member: req.params.id, status: { $in: ['borrowed', 'overdue'] } }).populate('book', 'title author isbn coverImage'),
      Transaction.find({ member: req.params.id, status: 'returned' }).populate('book', 'title author isbn').sort('-returnDate').limit(10)
    ]);
    res.json({ success: true, data: { member, activeLoans, history } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/members/:id/role - Update member role (admin only)
router.put('/:id/role', protect, superAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'librarian', 'member'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    const member = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member, message: `Role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/members/:id/status - Activate/Deactivate member
router.put('/:id/status', protect, superAdmin, async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    member.isActive = !member.isActive;
    await member.save();
    res.json({ success: true, data: member, message: `Member ${member.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
