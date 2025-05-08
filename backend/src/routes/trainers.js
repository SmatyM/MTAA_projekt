const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');

router.use(auth);

// Získaj zoznam všetkých trénerov alebo používateľov podľa role
router.get('/', async (req, res) => {
  try {
    const { q, role } = req.query;
    let where = {};
    if (role) {
      where.role = role;
    } else if (req.user && req.user.id) {
      // Always fetch the user from DB to get the latest role
      const user = await require('../models').User.findByPk(req.user.id);
      const userRole = user?.role;
      // Ak je prihlásený tréner, hľadá používateľov, inak trénerov
      where.role = userRole === 'trainer' ? 'user' : 'trainer';
    } else {
      where.role = 'trainer'; // default
    }
    if (q) {
      where = {
        ...where,
        [Op.or]: [
          { email: { [Op.iLike]: `%${q}%` } },
          { first_name: { [Op.iLike]: `%${q}%` } },
          { last_name: { [Op.iLike]: `%${q}%` } }
        ]
      };
    }
    const trainers = await User.findAll({ where, attributes: ['id', 'email', 'role', 'first_name', 'last_name'] });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: 'Chyba pri načítaní používateľov' });
  }
});

module.exports = router; 