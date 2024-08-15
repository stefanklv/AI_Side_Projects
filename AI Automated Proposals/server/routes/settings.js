const express = require('express');
const router = express.Router();
const Settings = require('../models/settingsModel');

// Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings.length > 0 ? settings : [{}]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save settings
router.post('/', async (req, res) => {
  const { logo, businessName, color, preparedBy, contactInfo } = req.body;

  try {
    let settings = await Settings.findOne();
    if (settings) {
      // Update existing settings
      settings.logo = logo;
      settings.businessName = businessName;
      settings.color = color;
      settings.preparedBy = preparedBy;
      settings.contactInfo = contactInfo;
    } else {
      // Create new settings
      settings = new Settings({ logo, businessName, color, preparedBy, contactInfo });
    }
    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
