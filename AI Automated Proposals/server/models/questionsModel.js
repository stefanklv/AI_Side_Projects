// models/questionsModel.js
const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
  answers: { type: Object, required: true },
});

module.exports = mongoose.model('Questions', questionsSchema);
