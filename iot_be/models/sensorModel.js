const pool = require("../db/database");

class Sensor {
  static async getLatest() {
    const [rows] = await pool.query(
      `SELECT id, temperature, humidity, light, DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp 
     FROM sensor_data 
     ORDER BY timestamp DESC 
     LIMIT 10`
    );
    return rows;
  }

  static async getAllSorted() {
    const [rows] = await pool.query(
      "SELECT id, temperature, humidity, light, DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp FROM sensor_data ORDER BY id ASC"
    );
    return rows;
  }

  static async getSensorData({
    page = 1,
    limit = 10,
    type,
    dir = "asc",
    keyword,
  }) {
    const offset = (page - 1) * limit;
    let baseQuery = `
    FROM sensor_data
  `;
    let params = [];
    const conditions = [];

    if (keyword) {
      if (type && ["temperature", "humidity", "light"].includes(type)) {
        conditions.push(`${type} = ?`);
        params.push(parseFloat(keyword));
      } else if (type === "timestamp") {
        conditions.push("timestamp LIKE ?");
        params.push(`${keyword}%`);
      } else {
        conditions.push(
          "(CAST(temperature AS CHAR) LIKE ? OR CAST(humidity AS CHAR) LIKE ? OR CAST(light AS CHAR) LIKE ? OR timestamp LIKE ?)"
        );
        params.push(
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`
        );
      }
    }

    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    // Count total
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total ${baseQuery}`,
      params
    );
    const total = countRows[0].total;

    // Fetch data
    const dataQuery = `
    SELECT 
      id, 
      temperature, 
      humidity, 
      light, 
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp 
    ${baseQuery}
    ORDER BY timestamp ${dir === "asc" ? "ASC" : "DESC"}
    LIMIT ? OFFSET ?
  `;
    const [rows] = await pool.query(dataQuery, [
      ...params,
      parseInt(limit),
      parseInt(offset),
    ]);

    return { total, data: rows };
  }
}

module.exports = Sensor;
