const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create Subscription
router.post('/', async (req, res) => {
    const { user_id, system_id, plan_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO subscriptions (user_id, system_id, plan_id, status, start_date) VALUES (?, ?, ?, "pending", NOW())',
            [user_id, system_id, plan_id]
        );
        res.status(201).json({ id: result.insertId, status: 'pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Payment Callback (Simplification)
router.post('/payment-callback', async (req, res) => {
    const { subscription_id, transaction_ref, status } = req.body; // status: success/failed
    try {
        // Update payment record
        await db.query(
            'INSERT INTO payments (subscription_id, amount, status, transaction_ref, paid_at) VALUES (?, ?, ?, ?, NOW())',
            [subscription_id, 0, status, transaction_ref] // Amount would come from plan lookup in real scenario
        );

        // Update subscription status if success
        if (status === 'success') {
            await db.query('UPDATE subscriptions SET status = "active" WHERE id = ?', [subscription_id]);
        }

        res.json({ message: 'Payment processed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Subscriptions (Admin/Global)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT s.*, u.name as user_name, p.name as plan_name, sys.name as system_name \
             FROM subscriptions s \
             JOIN users u ON s.user_id = u.id \
             JOIN plans p ON s.plan_id = p.id \
             JOIN systems sys ON s.system_id = sys.id \
             ORDER BY s.start_date DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Subscriptions for a User
router.get('/user/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT s.*, p.name as plan_name, sys.name as system_name FROM subscriptions s \
             JOIN plans p ON s.plan_id = p.id \
             JOIN systems sys ON s.system_id = sys.id \
             WHERE s.user_id = ? AND s.status = "active"',
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const authenticateToken = require('../middleware/authMiddleware');

// Cross-System Verification API
// Called by System A/B/C to check if user has access
router.get('/status', authenticateToken, async (req, res) => {
    // req.user is populated by middleware from the handshake token
    // Handshake token has: user_id, company_id, system_code
    const user_id = req.user.id || req.user.user_id;
    const { company_id, system_code } = req.user;

    console.log(`[SUBSCRIPTION_CHECK] User:${user_id}, System:${system_code}`);

    try {
        const [rows] = await db.query(`
            SELECT s.status, p.name as plan_name, s.end_date 
            FROM subscriptions s
            JOIN systems sys ON s.system_id = sys.id
            JOIN plans p ON s.plan_id = p.id
            WHERE s.user_id = ? 
            AND (LOWER(sys.code) = LOWER(?) OR sys.name LIKE ?)
            AND s.status = 'active'
            ORDER BY s.end_date DESC
            LIMIT 1
        `, [user_id, system_code, `%${system_code}%`]);

        if (rows.length === 0) {
            console.warn(`[SUBSCRIPTION_DENIED] No active sub for User:${user_id}, System:${system_code}`);
            return res.json({
                active: false,
                message: 'No active subscription found for this system'
            });
        }

        res.json({
            active: true,
            plan: rows[0].plan_name,
            expire_at: rows[0].end_date,
            company_id: company_id
        });
    } catch (err) {
        console.error("[SUBSCRIPTION_ERROR]", err);
        res.status(500).json({ error: err.message });
    }
});

// Repair Endpoint: Fix all 1970/expired dates for testing
router.get('/repair-dates', async (req, res) => {
    try {
        await db.query(`
            UPDATE subscriptions 
            SET end_date = '2026-12-31', status = 'active'
            WHERE end_date IS NULL OR end_date < '2000-01-01' OR status != 'active'
        `);
        res.json({ message: 'All subscriptions repaired! Dates set to 2026-12-31.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
