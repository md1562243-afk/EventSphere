const pool = require('../config/database');

const Admin = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Admin WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT admin_id, first_name, last_name, email FROM Admin WHERE admin_id = ?', [id]);
    return rows[0];
  },

  async all() {
    const [rows] = await pool.query('SELECT admin_id, first_name, last_name, email FROM Admin');
    return rows;
  },

  async create({ first_name, last_name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO Admin (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword]
    );
    return result.insertId;
  }
};

module.exports = Admin;
