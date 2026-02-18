const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

// Get Dashboard Stats (Admin Only)
router.get('/stats', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const [usersCount] = await db.query('SELECT COUNT(*) as total FROM users');
        const [systemsCount] = await db.query('SELECT COUNT(*) as total FROM systems');
        const [subsCount] = await db.query('SELECT COUNT(*) as total FROM subscriptions WHERE status = "active"');
        const [revenue] = await db.query('SELECT SUM(amount) as total FROM payments WHERE status = "success"');

        // Fetch monthly revenue for chart (last 12 months)
        const [monthlyRevenue] = await db.query(`
            SELECT 
                DATE_FORMAT(paid_at, '%b') as month,
                SUM(amount) as total
            FROM payments 
            WHERE status = 'success' 
            AND paid_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY MONTH(paid_at), DATE_FORMAT(paid_at, '%b')
            ORDER BY MIN(paid_at)
        `);

        // Fetch recent activities
        const [recentActivity] = await db.query(`
            SELECT 
                p.subscription_id,
                p.amount,
                p.paid_at,
                u.name as user_name,
                sys.name as system_name
            FROM payments p
            JOIN subscriptions s ON p.subscription_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN systems sys ON s.system_id = sys.id
            WHERE p.status = 'success'
            ORDER BY p.paid_at DESC
            LIMIT 5
        `);

        res.json({
            totalUsers: usersCount[0].total,
            totalSystems: systemsCount[0].total,
            activeSubscriptions: subsCount[0].total,
            totalRevenue: revenue[0].total || 0,
            monthlyRevenue: monthlyRevenue,
            recentActivity: recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Payments (Admin Only)
router.get('/payments', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                p.*, 
                u.name as user_name 
            FROM payments p
            JOIN subscriptions s ON p.subscription_id = s.id
            JOIN users u ON s.user_id = u.id
            ORDER BY p.paid_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
