const pool = require('../config/database');

const Booking = {
  async create({ event_id, event_date, event_time, event_venue, user_id }) {
    const [result] = await pool.query(
      `INSERT INTO Booking (event_id, event_date, event_time, event_venue, user_id, booking_status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [event_id, event_date, event_time, event_venue, user_id]
    );
    return result.insertId;
  },

  async findById(booking_id) {
    const [rows] = await pool.query('SELECT * FROM Booking WHERE booking_id = ?', [booking_id]);
    return rows[0];
  },

  async byUser(user_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.event_name, e.event_type, e.ticket_price
       FROM Booking b
       LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE b.user_id = ?
       ORDER BY b.booking_id DESC`,
      [user_id]
    );
    return rows;
  },

  async byOrganizer(organizer_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.event_name, e.event_type
       FROM Booking b
       JOIN Event e ON b.event_id = e.event_id
       WHERE e.organizer_id = ?
       ORDER BY b.booking_id DESC`,
      [organizer_id]
    );
    return rows;
  },

  async all({ status } = {}) {
    let query = `SELECT b.*, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
                        e.event_name, e.event_type
                 FROM Booking b
                 JOIN User u ON b.user_id = u.user_id
                 LEFT JOIN Event e ON b.event_id = e.event_id`;
    const params = [];
    if (status) {
      query += ' WHERE b.booking_status = ?';
      params.push(status);
    }
    query += ' ORDER BY b.booking_id DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async setStatus(booking_id, booking_status, admin_id) {
    if (admin_id) {
      await pool.query('UPDATE Booking SET booking_status = ?, admin_id = ? WHERE booking_id = ?', [booking_status, admin_id, booking_id]);
    } else {
      await pool.query('UPDATE Booking SET booking_status = ? WHERE booking_id = ?', [booking_status, booking_id]);
    }
  },

  async assignEvent(booking_id, event_id) {
    await pool.query('UPDATE Booking SET event_id = ? WHERE booking_id = ?', [event_id, booking_id]);
  },

  async delete(booking_id) {
    await pool.query('DELETE FROM Booking WHERE booking_id = ?', [booking_id]);
  }
};

module.exports = Booking;