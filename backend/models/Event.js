const pool = require('../config/database');

const Event = {
  async create(data) {
    const { event_name, event_type, event_date, event_time, event_venue, ticket_price, organizer_id, admin_id = null, status = 'Pending' } = data;
    const [result] = await pool.query(
      `INSERT INTO Event (event_name, event_type, event_date, event_time, event_venue, ticket_price, organizer_id, admin_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event_name, event_type, event_date, event_time, event_venue, ticket_price, organizer_id, admin_id, status]
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

  // Public browse: only organizer-created events (admin_id IS NULL) that are Approved
  // User-requested custom events have admin_id set — those are excluded
  // Pass includeCustom: true for admin/organizer dashboards that should see everything
  async search({ q, type, date, venue, minPrice, maxPrice, sort, organizer_id, includeCustom = false, page = 1, limit = 12 }) {
    let query = 'SELECT e.*, o.first_name AS organizer_first_name, o.last_name AS organizer_last_name FROM Event e JOIN Organizer o ON e.organizer_id = o.organizer_id WHERE 1=1';
    const params = [];

    if (!includeCustom) {
      // organizer-created public events have admin_id = NULL
      // user-requested custom events have admin_id set by admin during assignment
      query += ' AND e.admin_id IS NULL AND e.status = "Approved" AND o.status = "Approved"';
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
    if (date) {
      query += ' AND e.event_date = ?';
      params.push(date);
    }
    if (venue) {
      query += ' AND e.event_venue LIKE ?';
      params.push(`%${venue}%`);
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
      highest_price: 'e.ticket_price DESC',
      upcoming: 'e.event_date ASC'
    };
    query += ` ORDER BY ${sortMap[sort] || sortMap.newest}`;

    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await pool.query(query, params);
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

  async setStatus(event_id, status, admin_id) {
    await pool.query('UPDATE Event SET status = ?, admin_id = ? WHERE event_id = ?', [status, admin_id, event_id]);
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