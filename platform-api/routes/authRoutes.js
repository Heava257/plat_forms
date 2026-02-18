const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query(`
            SELECT u.*, r.name as role 
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.email = ?
        `, [email]);

        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JSON_TOKEN_EXPIRE }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const authenticateToken = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.name, u.email, r.name as role 
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = ?
        `, [req.user.id]);

        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = users[0];

        // If updating email or password, verify current password
        if (newPassword || email !== user.email) {
            if (!currentPassword) return res.status(400).json({ error: 'Current password required for this change' });
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(401).json({ error: 'Incorrect current password' });
        }

        let updateQuery = 'UPDATE users SET name = ?, email = ?';
        let params = [name, email];

        if (newPassword) {
            const hashed = await bcrypt.hash(newPassword, 10);
            updateQuery += ', password = ?';
            params.push(hashed);
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.user.id);

        await db.query(updateQuery, params);
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate Handshake Token for specific system/company
router.post('/handshake', authenticateToken, async (req, res) => {
    const { system_id, company_id } = req.body;

    if (!system_id || !company_id) {
        return res.status(400).json({ error: 'System and Company selection required' });
    }

    try {
        // Fetch system code for payload
        const [systems] = await db.query('SELECT code FROM systems WHERE id = ?', [system_id]);
        if (systems.length === 0) return res.status(404).json({ error: 'System not found' });

        const handshakeToken = jwt.sign(
            {
                user_id: req.user.id,
                company_id: company_id,
                system_code: systems[0].code,
                role: req.user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '5m' } // Very short lived for security
        );

        res.json({ handshakeToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
