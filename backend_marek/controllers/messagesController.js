const pool = require('../models/db');

const createMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba pri vytváraní správy' });
  }
};

module.exports = { createMessage };
