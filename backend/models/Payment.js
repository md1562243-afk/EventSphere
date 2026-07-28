const pool = require('../config/database');

const Payment = {
  async create({ payment_method, payment_amount, booking_id }) {
    const [result] = await pool.query(
      `INSERT INTO Payment (payment_method, payment_amount, booking_id)
       VALUES (?, ?, ?)`,
      [payment_method, payment_amount, booking_id]
    );
    return result.insertId;
  },

  async findById(payment_id) {
    const [rows] = await pool.query('SELECT * FROM Payment WHERE payment_id = ?', [payment_id]);
    return rows[0];
  },

  async byBooking(booking_id) {
    const [rows] = await pool.query('SELECT * FROM Payment WHERE booking_id = ?', [booking_id]);
    return rows;
  },

  async byUser(user_id) {
    const [rows] = await pool.query(
      `SELECT p.*, e.event_name, e.event_type, b.event_date, b.event_venue, b.event_time
       FROM Payment p
       JOIN Booking b ON p.booking_id = b.booking_id
       LEFT JOIN Event e ON b.event_id = e.event_id
       WHERE b.user_id = ?
       ORDER BY p.payment_id DESC`,
      [user_id]
    );
    return rows;
  },

  async all() {
    const [rows] = await pool.query(
      `SELECT p.*, b.user_id, b.event_id, b.booking_status, b.event_date, b.event_time, b.event_venue
       FROM Payment p
       JOIN Booking b ON p.booking_id = b.booking_id
       ORDER BY p.payment_id DESC`
    );
    return rows;
  },

  async confirm(payment_id, admin_id) {
    await pool.query('UPDATE Payment SET admin_id = ? WHERE payment_id = ?', [admin_id, payment_id]);
  },

  async paidAndDue(booking_id) {
    const [rows] = await pool.query(
      'SELECT COALESCE(SUM(payment_amount), 0) AS paid FROM Payment WHERE booking_id = ?',
      [booking_id]
    );
    return { paid: rows[0].paid, due: 0 };
  },

  async totalRevenue(organizer_id) {
    let query = `
      SELECT COALESCE(SUM(p.payment_amount), 0) AS total
      FROM Payment p
      JOIN Booking b ON p.booking_id = b.booking_id
      JOIN Event e ON b.event_id = e.event_id
    `;
    const params = [];
    if (organizer_id) {
      query += ' WHERE e.organizer_id = ?';
      params.push(organizer_id);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
};

module.exports = Payment;