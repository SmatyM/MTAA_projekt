const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');

// GET /api/user/me - Get current logged-in user's info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'first_name', 'last_name']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/user/me - Update current logged-in user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const { height, weight, date_of_birth } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;