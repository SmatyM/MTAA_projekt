/*const express = require('express');
const router = express.Router();
const locationService = require('../services/locationService');
const { logEvent } = require('../middleware/firebaseMiddleware');

router.post('/start', (req, res) => {
    locationService.startTracking();
    logEvent(req.user.id, 'tracking_started');
    res.status(200).json({ message: 'Tracking started' });
});

router.post('/location', (req, res) => {
    const { latitude, longitude } = req.body;
    locationService.addLocation(latitude, longitude);
    res.status(200).json({ message: 'Location added' });
});

router.post('/stop', async (req, res) => {
    try {
        const metrics = await locationService.stopTracking(req.user.id);
        logEvent(req.user.id, 'tracking_stopped', metrics);
        res.status(200).json(metrics);
    } catch (error) {
        logEvent(req.user.id, 'tracking_error', { error: error.message });
        res.status(400).json({ error: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const workouts = await locationService.getUserWorkouts(req.user.id);
        logEvent(req.user.id, 'workouts_fetched', { count: workouts.length });
        res.status(200).json(workouts);
    } catch (error) {
        logEvent(req.user.id, 'workouts_error', { error: error.message });
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const locationService = require('../services/locationService');
const { authenticate } = require('../middleware/authMiddleware'); // Pridané

// Použitie auth middleware pre všetky tracking routes
router.use(authenticate);

router.post('/start', (req, res) => {
    locationService.startTracking();
    res.status(200).json({ message: 'Tracking started' });
});

router.post('/location', (req, res) => {
    const { latitude, longitude } = req.body;
    locationService.addLocation(latitude, longitude);
    res.status(200).json({ message: 'Location added' });
});

router.post('/stop', async (req, res) => {
    try {
        const metrics = await locationService.stopTracking(req.user.id);
        res.status(200).json(metrics);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const workouts = await locationService.getUserWorkouts(req.user.id); // Teraz req.user bude existovať
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;