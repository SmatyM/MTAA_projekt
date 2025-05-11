const express = require('express');
const router = express.Router();
const { Activity } = require('../models');
const authenticateToken = require('../middleware/auth');

// GET všetky aktivity
router.get('/', async (req, res) => {
  const activities = await Activity.findAll();
  res.json(activities);
});

// POST nová aktivita
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, distance, duration } = req.body;
    
    const activity = await Activity.create({
      type,
      distance,
      duration,
      user_id: req.user.id // ID z JWT tokenu
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT aktualizácia aktivity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('PUT /activities/:id', req.params.id, req.body);
    const activity = await Activity.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!activity) return res.status(404).json({ error: 'Aktivita neexistuje alebo nemáte oprávnenie' });
    const updateData = {};
    if (req.body.distance !== undefined) updateData.distance = req.body.distance;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;
    const [updated] = await Activity.update(updateData, { where: { id: req.params.id } });
    console.log('Update result:', updated);
    if (updated) {
      res.json({ message: 'Activity updated' });
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE aktivita
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id // Kontrola, či aktivita patrí používateľovi
      }
    });

    if (!activity) {
      return res.status(404).json({ error: 'Aktivita neexistuje alebo nemáte oprávnenie' });
    }

    await activity.destroy();
    res.status(204).end(); // 204 No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/activities/my - Vráti aktivity prihláseného používateľa
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { user_id: req.user.id } // Filtruje podľa ID z tokenu
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;