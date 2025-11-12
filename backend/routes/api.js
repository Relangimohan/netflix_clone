/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route   GET api/health
// @desc    Check API and DB status
// @access  Public
router.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({ 
        msg: 'Backend API is working correctly!',
        database: dbStatus
    });
});

// Content routes
router.use('/content', require('./content'));
// Auth routes
router.use('/auth', require('./auth'));

module.exports = router;