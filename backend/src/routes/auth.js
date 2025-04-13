const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');

// Registrácia
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role });
  res.status(201).json(user);
});

// Prihlásenie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Nájdite používateľa
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Neplatné prihlasovacie údaje' });

    // 2. Overte heslo
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Neplatné prihlasovacie údaje' });

    // 3. Vytvorte JWT token
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, // Použije váš kľúč z .env
      { expiresIn: '1h' }
    );

    // 4. Vráťte token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;