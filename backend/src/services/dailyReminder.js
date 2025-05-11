const cron = require('node-cron');
const { User, Activity } = require('../models');
const { sendPushNotification } = require('./notificationService');
const { Op } = require('sequelize');

// Helper to get today's date in YYYY-MM-DD
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// This should run once a day, e.g., at 20:00
cron.schedule('0 20 * * *', async () => {
  const users = await User.findAll();
  const today = getTodayDateString();
  for (const user of users) {
    if (user.push_token && user.daily_steps_goal) {
      // Sum today's activity distance for the user
      const distanceToday = await Activity.sum('distance', {
        where: {
          user_id: user.id,
          created_at: {
            [Op.gte]: new Date(today + 'T00:00:00.000Z'),
            [Op.lt]: new Date(today + 'T23:59:59.999Z')
          }
        }
      });
      // Convert distance (km) to steps (average: 1 km ≈ 1312 steps)
      const stepsToday = Math.round((distanceToday || 0) * 1312);
      if (stepsToday < user.daily_steps_goal) {
        const missing = user.daily_steps_goal - stepsToday;
        await sendPushNotification(
          user.push_token,
          'Keep Moving!',
          `You are ${missing} steps away from your daily goal!`,
          { type: 'reminder', missing }
        );
      }
    }
  }
});
