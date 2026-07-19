const pool = require('../config/database');

const Payment = {
  async create({ payment_method, payment_amount, booking_id }) {
    const [result] = await pool.query(
      `INSERT INTO Payment (payment_date, payment_time, payment_method, payment_status, payment_amount, booking_id)
       VALUES (CURDATE(), CURTIME(), ?, 'Pending', ?, ?)`,
      [payment_method, payment_amount, booking_id]
    );
    return result.insertId;
  },

  async findById(payment_id) {
    const [rows] = await pool.query(
      `SELECT p.*, b.user_id, b.event_id, e.event_name
       FROM Payment p
       JOIN Booking b ON p.booking_id = b.booking_id
       LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE p.payment_id = ?`,
      [payment_id]
    );
    return rows[0];
  },

  async byBooking(booking_id) {
    const [rows] = await pool.query('SELECT * FROM Payment WHERE booking_id = ? ORDER BY payment_id ASC', [booking_id]);
    return rows;
  },

  // Amount confirmed vs still pending for a booking — computed purely from existing Payment rows,
  // which is how the advance/remaining-due split is represented (no extra columns needed).
  async paidAndDue(booking_id) {
    const [rows] = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN payment_status = 'Confirmed' THEN payment_amount ELSE 0 END), 0) AS paid,
         COALESCE(SUM(CASE WHEN payment_status = 'Pending' THEN payment_amount ELSE 0 END), 0) AS due
       FROM Payment WHERE booking_id = ?`,
      [booking_id]
    );
    return rows[0];
  },

  async byUser(user_id) {
    const [rows] = await pool.query(
      `SELECT p.*, e.event_name FROM Payment p
       JOIN Booking b ON p.booking_id = b.booking_id
       LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE b.user_id = ? ORDER BY p.payment_id DESC`,
      [user_id]
    );
    return rows;
  },

  async all(status) {
    let query = `SELECT p.*, b.user_id, u.first_name AS user_first_name, u.last_name AS user_last_name, e.event_name
                 FROM Payment p
                 JOIN Booking b ON p.booking_id = b.booking_id
                 JOIN User u ON b.user_id = u.user_id
                 LEFT JOIN Event e ON b.event_id = e.event_id`;
    const params = [];
    if (status) {
      query += ' WHERE p.payment_status = ?';
      params.push(status);
    }
    query += ' ORDER BY p.payment_id DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async confirm(payment_id, admin_id) {
    await pool.query('UPDATE Payment SET payment_status = "Confirmed", admin_id = ? WHERE payment_id = ?', [admin_id, payment_id]);
  },

  async countByStatus(status) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Payment WHERE payment_status = ?', [status]);
    return rows[0].total;
  },

  async totalRevenue(organizer_id) {
    let query = `SELECT COALESCE(SUM(p.payment_amount),0) AS total FROM Payment p
                 JOIN Booking b ON p.booking_id = b.booking_id
                 WHERE p.payment_status = 'Confirmed'`;
    const params = [];
    if (organizer_id) {
      query += ` AND b.event_id IN (SELECT event_id FROM Event WHERE organizer_id = ?)`;
      params.push(organizer_id);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
};

module.exports = Payment;
