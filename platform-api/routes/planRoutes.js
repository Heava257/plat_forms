const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get plans for a system
router.get('/:systemId', async (req, res) => {
    const { systemId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM plans WHERE system_id = ?', [systemId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a plan
router.post('/', async (req, res) => {
    const { system_id, name, description, price, duration_months } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO plans (system_id, name, description, price, duration_days, duration_months) VALUES (?, ?, ?, ?, ?, ?)',
            [system_id, name, description, price, duration_months * 30, duration_months]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
