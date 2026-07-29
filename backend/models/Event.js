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

  // Public listing: only Approved events from Approved organizers.
  // booking_count + the earliest booking's date/time/venue are computed so the
  // frontend can split results into "What We Offer" (bookable templates) vs
  // "Events Hosted" (a specific one-off, already-booked event) — see comment
  // in BrowseEvents.jsx for the exact rule and its known edge case.
  async search({ q, type, minPrice, maxPrice, sort, organizer_id, includeCustom = false, page = 1, limit = 12 }) {
    let query = `
      SELECT e.*, o.first_name AS organizer_first_name, o.last_name AS organizer_last_name,
             (SELECT COUNT(*) FROM Booking b WHERE b.event_id = e.event_id) AS booking_count,
             (SELECT b2.event_date FROM Booking b2 WHERE b2.event_id = e.event_id ORDER BY b2.booking_id ASC LIMIT 1) AS hosted_date,
             (SELECT b2.event_time FROM Booking b2 WHERE b2.event_id = e.event_id ORDER BY b2.booking_id ASC LIMIT 1) AS hosted_time,
             (SELECT b2.event_venue FROM Booking b2 WHERE b2.event_id = e.event_id ORDER BY b2.booking_id ASC LIMIT 1) AS hosted_venue
      FROM Event e JOIN Organizer o ON e.organizer_id = o.organizer_id WHERE 1=1`;
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

  // Admin review list: every event regardless of status, with booking_count
  // shown for context (not used to block approval — admin can approve any
  // Pending event, of either type, from here).
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