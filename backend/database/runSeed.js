require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function seed() {
  try {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@eventsphere.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    const [existing] = await pool.query('SELECT admin_id FROM Admin WHERE email = ?', [adminEmail]);

    if (existing.length === 0) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO Admin (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        ['Platform', 'Admin', adminEmail, hashed]
      );
      console.log(`✔ Admin account created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('✔ Admin account already exists, skipping.');
    }

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
