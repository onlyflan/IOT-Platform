const pool = require("../db/database");

class Device {
  static async toggle(device_id, action) {
    // Use MySQL-compatible timestamp format
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      "INSERT INTO device_history (device_id, action, timestamp) VALUES (?, ?, ?)",
      [device_id, action, timestamp]
    );
    return result.insertId;
  }

  static async getDeviceData({ page = 1, limit = 10, timestamp, dir = "asc" }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        dh.id, 
        dh.device_id, 
        dh.action, 
        DATE_FORMAT(dh.timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp, 
        d.device_label 
      FROM device_history dh 
      JOIN devices d ON dh.device_id = d.id
    `;
    let params = [];

    if (timestamp) {
      query += " WHERE dh.timestamp LIKE ?";
      params.push(`${timestamp}%`);
    }

    query += ` ORDER BY dh.timestamp ${dir.toUpperCase()} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = Device;
