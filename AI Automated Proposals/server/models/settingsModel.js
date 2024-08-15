const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  logo: String,
  businessName: String,
  color: String,
  preparedBy: String,
  contactInfo: String
});

module.exports = mongoose.model('Settings', settingsSchema);
