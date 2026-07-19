const pool = require('../config/database');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT user_id, first_name, last_name, email FROM User WHERE user_id = ?', [id]);
    return rows[0];
  },

  async create({ first_name, last_name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO User (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword]
    );
    return result.insertId;
  },

  async addPhone(user_id, phone_no) {
    await pool.query(
      'INSERT IGNORE INTO User_Phone (user_id, phone_no) VALUES (?, ?)',
      [user_id, phone_no]
    );
  },

  async getPhones(user_id) {
    const [rows] = await pool.query('SELECT phone_no FROM User_Phone WHERE user_id = ?', [user_id]);
    return rows.map((r) => r.phone_no);
  },

  async removePhone(user_id, phone_no) {
    await pool.query('DELETE FROM User_Phone WHERE user_id = ? AND phone_no = ?', [user_id, phone_no]);
  },

  async updatePassword(user_id, hashedPassword) {
    await pool.query('UPDATE User SET password = ? WHERE user_id = ?', [hashedPassword, user_id]);
  },

  async updateProfile(user_id, { first_name, last_name }) {
    await pool.query('UPDATE User SET first_name = ?, last_name = ? WHERE user_id = ?', [first_name, last_name, user_id]);
  },

  async all() {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email,
              GROUP_CONCAT(up.phone_no SEPARATOR ', ') AS phone_numbers
       FROM User u
       LEFT JOIN User_Phone up ON up.user_id = u.user_id
       GROUP BY u.user_id
       ORDER BY u.user_id DESC`
    );
    return rows;
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM User');
    return rows[0].total;
  },

  async delete(user_id) {
    await pool.query('DELETE FROM User WHERE user_id = ?', [user_id]);
  }
};

module.exports = User;
