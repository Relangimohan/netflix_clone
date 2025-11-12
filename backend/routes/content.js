/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @route   GET api/content
// @desc    Get all content
// @access  Public (should be private in a real app)
router.get('/', async (req, res) => {
    try {
        const content = await Content.find().sort({ createdAt: -1 });
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;