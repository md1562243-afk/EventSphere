require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function seed() {
  try {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@eventsphere.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    const hashed = await bcrypt.hash(adminPassword, 10);

    // ON DUPLICATE KEY UPDATE ensures seed admin is always restored even if deleted
    await pool.query(
      `INSERT INTO Admin (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         password = VALUES(password)`,
      ['Platform', 'Admin', adminEmail, hashed]
    );

    console.log(`✔ Seed admin ensured: ${adminEmail}`);
    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();