// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define routes
const settingsRouter = require('./routes/settings');
const templatesRouter = require('./routes/templates');
const generateRouter = require('./routes/generate');

app.use('/api/settings', settingsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/generate', generateRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
