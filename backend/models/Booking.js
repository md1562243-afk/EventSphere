const pool = require('../config/database');

const Booking = {
  async create(data) {
    const { event_id, event_date, event_time, event_venue, special_notes, user_id } = data;
    const [result] = await pool.query(
      `INSERT INTO Booking (event_id, event_date, event_time, event_venue, special_notes, user_id, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [event_id || null, event_date, event_time, event_venue, special_notes || null, user_id]
    );
    return result.insertId;
  },

  async findById(booking_id) {
    const [rows] = await pool.query(
      `SELECT b.*, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
              e.event_name, e.event_type, e.organizer_id
       FROM Booking b
       JOIN User u ON b.user_id = u.user_id
       LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE b.booking_id = ?`,
      [booking_id]
    );
    return rows[0];
  },

  async byUser(user_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.event_name, e.event_type
       FROM Booking b LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE b.user_id = ? ORDER BY b.booking_id DESC`,
      [user_id]
    );
    return rows;
  },

  async byOrganizer(organizer_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.event_name, u.first_name AS user_first_name, u.last_name AS user_last_name
       FROM Booking b
       JOIN Event e ON b.event_id = e.event_id
       JOIN User u ON b.user_id = u.user_id
       WHERE e.organizer_id = ? ORDER BY b.booking_id DESC`,
      [organizer_id]
    );
    return rows;
  },

  async all(filters = {}) {
    let query = `SELECT b.*, u.first_name AS user_first_name, u.last_name AS user_last_name,
                 e.event_name, e.event_type
                 FROM Booking b
                 JOIN User u ON b.user_id = u.user_id
                 LEFT JOIN Event e ON b.event_id = e.event_id WHERE 1=1`;
    const params = [];
    if (filters.status) {
      query += ' AND b.booking_status = ?';
      params.push(filters.status);
    }
    query += ' ORDER BY b.booking_id DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async assignEvent(booking_id, event_id) {
    await pool.query('UPDATE Booking SET event_id = ? WHERE booking_id = ?', [event_id, booking_id]);
  },

  async setStatus(booking_id, status, admin_id) {
    const params = admin_id ? [status, admin_id, booking_id] : [status, booking_id];
    const query = admin_id
      ? 'UPDATE Booking SET booking_status = ?, admin_id = ? WHERE booking_id = ?'
      : 'UPDATE Booking SET booking_status = ? WHERE booking_id = ?';
    await pool.query(query, params);
  },

  async countByStatus(status) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Booking WHERE booking_status = ?', [status]);
    return rows[0].total;
  },

  async countByUser(user_id) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Booking WHERE user_id = ?', [user_id]);
    return rows[0].total;
  }
};

module.exports = Booking;
