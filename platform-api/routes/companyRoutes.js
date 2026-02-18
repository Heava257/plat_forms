const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get user's companies
router.get('/', async (req, res) => {
    // Assuming req.user is set by authMiddleware
    // For now, just getting all companies or by user_id if passed in query
    const userId = req.query.user_id;
    try {
        let query = 'SELECT * FROM companies';
        let params = [];
        if (userId) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create company
router.post('/', async (req, res) => {
    const { user_id, name } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO companies (user_id, name) VALUES (?, ?)',
            [user_id, name]
        );
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
