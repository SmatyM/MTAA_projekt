const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST nahranie obrázku
router.post('/', upload.single('file'), (req, res) => {
  res.json({ path: req.file.path }); // Cesta k súboru
});

module.exports = router;