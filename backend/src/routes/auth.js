const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
const { auth: firebaseAuth } = require('../config/firebase');
const axios = require('axios');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY; // Add this to your .env

// Registrácia
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // 1. Create user in Firebase
    let firebaseUser;
    try {
      firebaseUser = await firebaseAuth.createUser({ email, password });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        firebaseUser = await firebaseAuth.getUserByEmail(email);
      } else {
        throw err;
      }
    }
    console.log('User record:', firebaseUser);

    if (!firebaseUser || !firebaseUser.uid) {
      return res.status(500).json({ error: 'Firebase UID not returned' });
    }

    // 2. Create user in your local DB, including the Firebase UID
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      firebaseUid: firebaseUser.uid
    });

    res.status(201).json({ user, firebaseUid: firebaseUser.uid });
  } catch (error) {
    // Handle Firebase errors (e.g., email already in use)
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Prihlásenie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Local DB authentication
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // 2. Create your own JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Firebase authentication via REST API
    let firebaseToken = null;
    try {
      const fbRes = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      );
      firebaseToken = fbRes.data.idToken;
    } catch (fbErr) {
      console.error('Firebase login error:', fbErr.response?.data || fbErr.message);
      // Optionally: return error or just skip firebaseToken
    }

    // 4. Return both tokens
    res.json({ token, firebaseToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;