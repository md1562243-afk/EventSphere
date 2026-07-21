const pool = require('../config/database');

const Payment = {
  async create({ payment_method, payment_amount, booking_id, payment_plan = 'Full' }) {
    const [result] = await pool.query(
      `INSERT INTO Payment (payment_date, payment_time, payment_method, payment_plan, payment_status, payment_amount, booking_id)
       VALUES (CURDATE(), CURTIME(), ?, ?, 'Pending', ?, ?)`,
      [payment_method, payment_plan, payment_amount, booking_id]
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

  // Amount confirmed vs still outstanding for a booking, computed exactly using
  // payment_plan: for Advance, the true total is always 2x the first row's amount
  // (an even 50/50 split), so "due" is knowable even before the second row exists.
  async paidAndDue(booking_id) {
    const rows = await this.byBooking(booking_id);
    if (rows.length === 0) {
      return { paid: 0, due: 0, plan: null, payment_count: 0 };
    }
    const plan = rows[0].payment_plan;
    const paid = rows
      .filter((r) => r.payment_status === 'Confirmed')
      .reduce((sum, r) => sum + Number(r.payment_amount), 0);
    const total = plan === 'Advance' ? Number(rows[0].payment_amount) * 2 : Number(rows[0].payment_amount);
    return { paid, due: total - paid, plan, payment_count: rows.length };
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