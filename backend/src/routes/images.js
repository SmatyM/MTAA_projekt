const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { Image } = require('../models');
const authenticateToken = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// POST /api/images - Upload obrázka
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Žiadny súbor nebol nahraný' });
    }

    const image = await Image.create({
      filename: req.file.filename,
      path: req.file.path,
      user_id: req.user.id
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/images/:id - Získanie obrázka
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const image = await Image.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!image) {
      return res.status(404).json({ error: 'Obrázok nebol nájdený' });
    }

    res.sendFile(path.resolve(image.path));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/images/:id - Vymazanie obrázka
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const image = await Image.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!image) {
      return res.status(404).json({ error: 'Obrázok nebol nájdený' });
    }

    // Vymazanie súboru z disku
    fs.unlinkSync(image.path);
    
    // Vymazanie záznamu z DB
    await image.destroy();
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;