const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const { sendPushNotification } = require('../services/notificationService');

// Všetky endpointy v tomto routeri budú chránené
router.use(auth);

router.use((req, res, next) => {
  console.log('CHAT ROUTER REQUEST:', req.method, req.originalUrl);
  next();
});

// Get recent conversations for the logged-in user, including unread count
router.get('/conversations', async (req, res) => {
  console.log('GET /chat/conversations called by user:', req.user?.id);
  try {
    const userId = Number(req.user.id);
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      order: [['created_at', 'DESC']]
    });


    const conversations = {};
    messages.forEach(msg => {
      const otherId = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
      if (!conversations[otherId]) {
        conversations[otherId] = {
          trainerId: otherId,
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: 0
        };
      }
      if (msg.receiver_id == userId && msg.seen === 'false') {
        conversations[otherId].unreadCount += 1;
      }
    });

    const trainerIds = Object.keys(conversations);
    const trainers = await User.findAll({
      where: { id: trainerIds },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role']
    });

    const result = trainers.map(trainer => ({
      ...conversations[String(trainer.id)],
      email: trainer.email,
      first_name: trainer.first_name,
      last_name: trainer.last_name,
      role: trainer.role,
      userId: userId,
      trainerId: trainer.id
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Chyba pri načítaní konverzácií' });
  }
});

// Získaj všetky správy medzi dvoma používateľmi (userId a recipientId)
router.get('/:recipientId', async (req, res) => {
  try {
    const recipientId = Number(req.params.recipientId);
    const userId = Number(req.user.id);
    if (isNaN(recipientId) || isNaN(userId)) {
      return res.status(400).json({ error: 'Neplatné ID používateľa alebo príjemcu.' });
    }
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: recipientId },
          { sender_id: recipientId, receiver_id: userId }
        ]
      },
      order: [['created_at', 'ASC']]
    });
    if (!Array.isArray(messages)) {
      res.status(500).json({ error: 'Chyba pri načítaní správ' });
      return;
    }
    res.json(messages.map(msg => msg.toJSON()));
  } catch (err) {
    console.error('Error loading messages:', err);
    res.status(500).json({ error: 'Chyba pri načítaní správ' });
  }
});

// Odoslanie správy
router.post('/:recipientId', async (req, res) => {
  try {
    const recipientId = Number(req.params.recipientId);
    const userId = Number(req.user.id);
    const { content } = req.body;
    const message = await Message.create({
      content,
      sender_id: userId,
      receiver_id: recipientId,
      seen: 'false'
    });
    const recipient = await User.findByPk(recipientId);
    if (recipient && recipient.push_token) {
      await sendPushNotification(
        recipient.push_token,
        'New Message',
        `You have a new message from ${req.user.first_name || 'someone'}`,
        { type: 'message', senderId: userId }
      );
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Chyba pri odosielaní správy' });
  }
});

module.exports = router; 