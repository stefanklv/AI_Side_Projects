// models/templatesModel.js
const mongoose = require('mongoose');

const templatesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Templates', templatesSchema);
