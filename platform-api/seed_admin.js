const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'saas_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const seed = async () => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('Connected to database...');

        // 1. Ensure Admin Role Exists
        console.log('Checking roles...');
        const [roles] = await connection.query('SELECT id FROM roles WHERE name = "admin"');
        let roleId;
        if (roles.length === 0) {
            console.log('Creating admin role...');
            const [res] = await connection.query('INSERT INTO roles (name, description) VALUES ("admin", "System Administrator")');
            roleId = res.insertId;
        } else {
            roleId = roles[0].id;
            console.log(`Admin role exists (ID: ${roleId})`);
        }

        // 2. Create Admin User
        const email = 'admin@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Checking users...');
        const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        let userId;

        if (users.length === 0) {
            console.log('Creating admin user...');
            const [res] = await connection.query(
                'INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)',
                ['Admin User', email, hashedPassword, 'active']
            );
            userId = res.insertId;
            console.log(`Admin user created (ID: ${userId})`);
        } else {
            userId = users[0].id;
            console.log(`Admin user already exists (ID: ${userId})`);
        }

        // 3. Assign Role
        console.log('Checking user roles...');
        const [userRoles] = await connection.query(
            'SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?',
            [userId, roleId]
        );

        if (userRoles.length === 0) {
            console.log('Assigning admin role to user...');
            await connection.query(
                'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                [userId, roleId]
            );
            console.log('Role assigned.');
        } else {
            console.log('User already has admin role.');
        }

        console.log('-----------------------------------');
        console.log('SEEDING SUCCESSFUL');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('-----------------------------------');

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await connection.end();
    }
};

seed();
