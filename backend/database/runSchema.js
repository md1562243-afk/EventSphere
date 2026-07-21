require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const mysql = require('mysql2/promise');

async function run() {
  const sql = fs.readFileSync('./schema.sql', 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  console.log('Connected. Running schema...');
  await connection.query(sql);
  console.log('✅ Schema applied successfully.');
  await connection.end();
}

run().catch(err => {
  console.error('❌ Error running schema:', err.message);
  process.exit(1);
});