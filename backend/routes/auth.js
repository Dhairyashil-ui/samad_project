const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || ''}/login?error=auth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL || ''}/auth/success?token=${token}`);
  }
);

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone, address },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
