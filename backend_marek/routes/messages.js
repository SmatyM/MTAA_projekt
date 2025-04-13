const express = require('express');
const router = express.Router();
const { createMessage } = require('../controllers/messagesController');

router.post('/', createMessage);

module.exports = router;
