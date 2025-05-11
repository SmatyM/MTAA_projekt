const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');

// GET /api/user/me - Get current logged-in user's info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 'email', 'role', 'first_name', 'last_name',
        'height', 'weight', 'date_of_birth',
        'daily_steps_goal', 'daily_distance_goal'
      ]
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
    const { height, weight, date_of_birth, daily_steps_goal, daily_distance_goal, first_name, last_name } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    if (daily_steps_goal !== undefined) user.daily_steps_goal = daily_steps_goal;
    if (daily_distance_goal !== undefined) user.daily_distance_goal = daily_distance_goal;
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/user/push-token - Update user's push notification token
router.put('/push-token', auth, async (req, res) => {
  try {
    const { push_token } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.push_token = push_token;
    await user.save();
    res.json({ message: 'Push token updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;