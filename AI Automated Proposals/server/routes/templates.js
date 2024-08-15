// routes/templates.js
const express = require('express');
const router = express.Router();
const Templates = require('../models/templatesModel');

// Get templates
router.get('/', async (req, res) => {
  try {
    const templates = await Templates.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
