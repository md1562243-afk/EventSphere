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

  async randomApproved() {
    const [rows] = await pool.query(
      `SELECT organizer_id, first_name, last_name, email
       FROM Organizer
       WHERE status = 'Approved'
       ORDER BY RAND()
       LIMIT 1`
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

  // Hard delete with full cascade:
  // 1. Find all events by this organizer
  // 2. Delete bookings for those events (payments auto-delete via CASCADE)
  // 3. Delete events (browse auto-deletes via CASCADE)
  // 4. Delete organizer phones
  // 5. Delete organizer
  async delete(organizer_id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Get all events created by this organizer
      const [events] = await conn.query('SELECT event_id FROM Event WHERE organizer_id = ?', [organizer_id]);
      const eventIds = events.map((e) => e.event_id);

      // 2. Delete bookings tied to those events (Payment cascades automatically)
      if (eventIds.length > 0) {
        const placeholders = eventIds.map(() => '?').join(',');
        await conn.query(`DELETE FROM Booking WHERE event_id IN (${placeholders})`, eventIds);
      }

      // 3. Delete all events by this organizer (Browse cascades automatically)
      await conn.query('DELETE FROM Event WHERE organizer_id = ?', [organizer_id]);

      // 4. Delete organizer phone numbers
      await conn.query('DELETE FROM Organizer_Phone WHERE organizer_id = ?', [organizer_id]);

      // 5. Delete the organizer
      await conn.query('DELETE FROM Organizer WHERE organizer_id = ?', [organizer_id]);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = Organizer;