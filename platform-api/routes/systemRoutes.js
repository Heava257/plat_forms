const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

// Get all systems (Admin version sees all, User version only active)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = req.user.role === 'admin'
            ? 'SELECT * FROM systems'
            : 'SELECT * FROM systems WHERE status = "active"';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add new system
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Denied' });

    const { name, code, api_url, status, demo_url, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO systems (name, code, api_url, status, demo_url, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, code, api_url, status || 'active', demo_url, image_url]
        );
        res.status(201).json({ id: result.insertId, name, code, api_url, status, demo_url, image_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update system
router.put('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Denied' });

    const { id } = req.params;
    const { name, code, api_url, status, demo_url, image_url } = req.body;
    try {
        await db.query(
            'UPDATE systems SET name = ?, code = ?, api_url = ?, status = ?, demo_url = ?, image_url = ? WHERE id = ?',
            [name, code, api_url, status, demo_url, image_url, id]
        );
        res.json({ message: 'System updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete system
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Denied' });

    const { id } = req.params;
    try {
        await db.query('DELETE FROM systems WHERE id = ?', [id]);
        res.json({ message: 'System deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
