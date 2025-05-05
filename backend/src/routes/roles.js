const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');

// PUT /api/admin/change-role - Zmena roly používateľa
router.put('/change-role', 
  authenticateToken,
  async (req, res) => {
    // Validácia vstupov

    try {
      const { email, newRole } = req.body;

      // 1. Nájdeme používateľa
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Používateľ nebol nájdený' });
      }

      // 2. Aktualizujeme rolu
      await user.update({ role: newRole });

      // 3. Vrátime aktualizovaného používateľa
      res.json({
        id: user.id,
        email: user.email,
        //role: user.role,
        message: 'Rola bola úspešne zmenená'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;