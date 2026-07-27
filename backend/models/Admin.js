const pool = require('../config/database');

const Admin = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(admin_id) {
    const [rows] = await pool.query('SELECT * FROM Admin WHERE admin_id = ?', [admin_id]);
    return rows[0];
  },

  async all() {
    const [rows] = await pool.query('SELECT admin_id, first_name, last_name, email FROM Admin ORDER BY admin_id');
    return rows;
  },

  async create({ first_name, last_name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO Admin (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword]
    );
    return result.insertId;
  },

  async delete(admin_id) {
    await pool.query('DELETE FROM Admin WHERE admin_id = ?', [admin_id]);
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Admin');
    return rows[0].total;
  }
};

module.exports = Admin;