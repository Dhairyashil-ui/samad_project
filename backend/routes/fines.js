const express = require('express');
const router = express.Router();
const Fine = require('../models/Fine');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/fines - All fines (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { isPaid } = req.query;
    const query = {};
    if (isPaid !== undefined) query.isPaid = isPaid === 'true';
    const fines = await Fine.find(query)
      .populate('member', 'name email membershipId avatar')
      .populate('transaction')
      .populate('paidTo', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: fines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/fines/my - My fines
router.get('/my', protect, async (req, res) => {
  try {
    const fines = await Fine.find({ member: req.user._id }).populate('transaction').sort('-createdAt');
    res.json({ success: true, data: fines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/fines/:id/pay - Mark fine as paid (admin)
router.put('/:id/pay', protect, adminOnly, async (req, res) => {
  try {
    const { paymentMethod = 'cash' } = req.body;
    const fine = await Fine.findById(req.params.id);
    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });
    if (fine.isPaid) return res.status(400).json({ success: false, message: 'Fine already paid' });
    fine.isPaid = true;
    fine.paidDate = new Date();
    fine.paidTo = req.user._id;
    fine.paymentMethod = paymentMethod;
    await fine.save();
    await User.findByIdAndUpdate(fine.member, { $inc: { totalFines: -fine.amount } });
    await fine.populate(['member', 'paidTo']);
    res.json({ success: true, data: fine, message: 'Fine marked as paid' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/fines/:id/waive - Waive fine (admin)
router.put('/:id/waive', protect, adminOnly, async (req, res) => {
  try {
    const fine = await Fine.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paidDate: new Date(), paidTo: req.user._id, paymentMethod: 'waived' },
      { new: true }
    );
    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });
    await User.findByIdAndUpdate(fine.member, { $inc: { totalFines: -fine.amount } });
    res.json({ success: true, data: fine, message: 'Fine waived successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
