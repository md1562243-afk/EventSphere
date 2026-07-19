const pool = require('../config/database');

const Organizer = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Organizer WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT organizer_id, first_name, last_name, email, status FROM Organizer WHERE organizer_id = ?',
      [id]
    );
    return rows[0];
  },

  async create({ first_name, last_name, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO Organizer (first_name, last_name, email, password, status) VALUES (?, ?, ?, ?, "Pending")',
      [first_name, last_name, email, hashedPassword]
    );
    return result.insertId;
  },

  async addPhone(organizer_id, phone_no) {
    await pool.query('INSERT IGNORE INTO Organizer_Phone (organizer_id, phone_no) VALUES (?, ?)', [organizer_id, phone_no]);
  },

  async getPhones(organizer_id) {
    const [rows] = await pool.query('SELECT phone_no FROM Organizer_Phone WHERE organizer_id = ?', [organizer_id]);
    return rows.map((r) => r.phone_no);
  },

  async all(status) {
    let query = `SELECT o.organizer_id, o.first_name, o.last_name, o.email, o.status,
                        GROUP_CONCAT(op.phone_no SEPARATOR ', ') AS phone_numbers
                 FROM Organizer o
                 LEFT JOIN Organizer_Phone op ON op.organizer_id = o.organizer_id`;
    const params = [];
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    query += ' GROUP BY o.organizer_id ORDER BY o.organizer_id DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async updateStatus(organizer_id, status, admin_id) {
    await pool.query('UPDATE Organizer SET status = ?, admin_id = ? WHERE organizer_id = ?', [status, admin_id, organizer_id]);
  },

  async updateProfile(organizer_id, { first_name, last_name }) {
    await pool.query('UPDATE Organizer SET first_name = ?, last_name = ? WHERE organizer_id = ?', [first_name, last_name, organizer_id]);
  },

  async updatePassword(organizer_id, hashedPassword) {
    await pool.query('UPDATE Organizer SET password = ? WHERE organizer_id = ?', [hashedPassword, organizer_id]);
  },

  async countByStatus(status) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Organizer WHERE status = ?', [status]);
    return rows[0].total;
  },

  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Organizer');
    return rows[0].total;
  },

  async delete(organizer_id) {
    await pool.query('DELETE FROM Organizer WHERE organizer_id = ?', [organizer_id]);
  }
};

module.exports = Organizer;
