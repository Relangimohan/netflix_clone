/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));


app.get('/', (req, res) => {
    res.send('mana studio Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});