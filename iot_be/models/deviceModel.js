// models/deviceModel.js
const pool = require("../db/database");

class Device {
  static async toggleDevice(device_name, device_label, action) {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      `INSERT INTO device_history (device_name, device_label, action, timestamp)
       VALUES (?, ?, ?, ?)`,
      [device_name, device_label, action, timestamp]
    );
    return result.insertId;
  }

  static async fetchDeviceData({ page, limit, timestamp, dir = "desc" }) {
    let query = `SELECT id, device_name, device_label, action,
                      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp
               FROM device_history`;
    const params = [];

    if (timestamp) {
      query += " WHERE timestamp LIKE ?";
      params.push(`${timestamp}%`);
    }

    query += ` ORDER BY timestamp ${dir.toUpperCase()}`;

    // Nếu không có phân trang → lấy toàn bộ
    let totalQuery = `SELECT COUNT(*) as total FROM device_history`;
    let totalWhereParams = [];

    if (timestamp) {
      totalQuery += " WHERE timestamp LIKE ?";
      totalWhereParams.push(`${timestamp}%`);
    }

    const [countResult] = await pool.query(totalQuery, totalWhereParams);
    const total = countResult[0].total;

    if (page && limit) {
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));
    }

    const [rows] = await pool.query(query, params);

    return { total, data: rows };
  }

  static async getLatestStates() {
    const [rows] = await pool.query(`
      SELECT dh.device_name, dh.device_label, dh.action
      FROM device_history dh
      INNER JOIN (
        SELECT device_name, MAX(timestamp) AS latest
        FROM device_history
        GROUP BY device_name
      ) latest_records
      ON dh.device_name = latest_records.device_name
         AND dh.timestamp = latest_records.latest
    `);
    return rows;
  }
}

module.exports = Device;
