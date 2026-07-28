const pool = require('../config/database');

const Event = {
  async create(data) {
    const { event_name, event_type, ticket_price, organizer_id, admin_id = null, event_status = 'Pending' } = data;
    const [result] = await pool.query(
      `INSERT INTO Event (event_name, event_type, ticket_price, organizer_id, admin_id, event_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event_name, event_type, ticket_price, organizer_id, admin_id, event_status]
    );
    return result.insertId;
  },

  async findById(event_id) {
    const [rows] = await pool.query(
      `SELECT e.*, o.first_name AS organizer_first_name, o.last_name AS organizer_last_name, o.email AS organizer_email
       FROM Event e JOIN Organizer o ON e.organizer_id = o.organizer_id
       WHERE e.event_id = ?`,
      [event_id]
    );
    return rows[0];
  },

  async search({ q, type, minPrice, maxPrice, sort, organizer_id, includeCustom = false, page = 1, limit = 12 }) {
    let query = 'SELECT e.*, o.first_name AS organizer_first_name, o.last_name AS organizer_last_name FROM Event e JOIN Organizer o ON e.organizer_id = o.organizer_id WHERE 1=1';
    const params = [];

    if (!includeCustom) {
      query += ' AND e.event_status = "Approved" AND o.status = "Approved"';
    }

    if (organizer_id) {
      query += ' AND e.organizer_id = ?';
      params.push(organizer_id);
    }
    if (q) {
      query += ' AND (e.event_name LIKE ? OR e.event_type LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (type) {
      query += ' AND e.event_type = ?';
      params.push(type);
    }
    if (minPrice) {
      query += ' AND e.ticket_price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND e.ticket_price <= ?';
      params.push(maxPrice);
    }

    const sortMap = {
      newest: 'e.event_id DESC',
      oldest: 'e.event_id ASC',
      lowest_price: 'e.ticket_price ASC',
      highest_price: 'e.ticket_price DESC'
    };
    query += ` ORDER BY ${sortMap[sort] || sortMap.newest}`;

    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // For admin review: includes a booking_count so the UI can tell apart
  // organizer templates (0 bookings when Pending, awaiting first approval)
  // from custom-request events (always exactly 1 booking, created alongside
  // them) — used to hide the Approve action on custom-request rows.
  async adminList() {
    const [rows] = await pool.query(
      `SELECT e.*, o.first_name AS organizer_first_name, o.last_name AS organizer_last_name,
              (SELECT COUNT(*) FROM Booking b WHERE b.event_id = e.event_id) AS booking_count
       FROM Event e
       JOIN Organizer o ON e.organizer_id = o.organizer_id
       ORDER BY e.event_id DESC`
    );
    return rows;
  },

  async update(event_id, data) {
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(event_id);
    await pool.query(`UPDATE Event SET ${fields.join(', ')} WHERE event_id = ?`, params);
  },

  async setSupervisor(event_id, admin_id) {
    await pool.query('UPDATE Event SET admin_id = ? WHERE event_id = ?', [admin_id, event_id]);
  },

  async setStatus(event_id, event_status, admin_id) {
    await pool.query('UPDATE Event SET event_status = ?, admin_id = ? WHERE event_id = ?', [event_status, admin_id, event_id]);
  },

  async delete(event_id) {
    await pool.query('DELETE FROM Event WHERE event_id = ?', [event_id]);
  },

  async recordBrowse(event_id, user_id) {
    await pool.query('INSERT IGNORE INTO Browse (event_id, user_id) VALUES (?, ?)', [event_id, user_id]);
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Event');
    return rows[0].total;
  },

  async countByOrganizer(organizer_id) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM Event WHERE organizer_id = ?', [organizer_id]);
    return rows[0].total;
  }
};

module.exports = Event;