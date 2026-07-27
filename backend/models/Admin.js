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
    const [rows] = await pool.query(
      `SELECT a.admin_id, a.first_name, a.last_name, a.email,
              GROUP_CONCAT(ap.phone_no SEPARATOR ', ') AS phone_numbers
       FROM Admin a
       LEFT JOIN Admin_Phone ap ON ap.admin_id = a.admin_id
       GROUP BY a.admin_id
       ORDER BY a.admin_id`
    );
    return rows;
  },

  async create({ first_name, last_name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO Admin (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword]
    );
    return result.insertId;
  },

  async addPhone(admin_id, phone_no) {
    await pool.query('INSERT IGNORE INTO Admin_Phone (admin_id, phone_no) VALUES (?, ?)', [admin_id, phone_no]);
  },

  async getPhones(admin_id) {
    const [rows] = await pool.query('SELECT phone_no FROM Admin_Phone WHERE admin_id = ?', [admin_id]);
    return rows.map((r) => r.phone_no);
  },

  async removePhone(admin_id, phone_no) {
    await pool.query('DELETE FROM Admin_Phone WHERE admin_id = ? AND phone_no = ?', [admin_id, phone_no]);
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