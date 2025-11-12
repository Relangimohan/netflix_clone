/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Serve static files from the React frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any request that doesn't match an API route, send back the frontend's index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});