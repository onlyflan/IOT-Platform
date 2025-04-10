const Device = require("../models/deviceModel");
const pool = require("../db/database");

exports.toggleDevice = async (req, res) => {
  try {
    const { device_id, action } = req.body;

    if (!["ON", "OFF"].includes(action)) {
      return res.status(400).json({
        status: "fail",
        message: "Action must be either 'ON' or 'OFF'",
      });
    }

    const timestamp = new Date();

    const vietnamTime = new Date(timestamp.getTime() + 7 * 60 * 60 * 1000);

    const formattedTimestamp = vietnamTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const [result] = await pool.query(
      "INSERT INTO device_history (device_id, action, timestamp) VALUES (?, ?, ?)",
      [device_id, action, formattedTimestamp]
    );

    res.status(201).json({
      status: "success",
      message: "Device state updated successfully",
      data: {
        device_id,
        action,
        timestamp: formattedTimestamp,
        history_id: result.insertId,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getDeviceData = async (req, res) => {
  try {
    const { page = 1, limit = 10, timestamp, dir = "asc" } = req.query;

    let baseQuery = `
      FROM device_history dh
      JOIN devices d ON dh.device_id = d.id
    `;

    let whereClause = "";
    let params = [];

    if (timestamp) {
      whereClause = " WHERE dh.timestamp LIKE ?";
      params.push(`${timestamp}%`);
    }

    // Query for total count (filtered)
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total ${baseQuery} ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Query for actual data
    let dataQuery = `
      SELECT 
        dh.id, 
        dh.device_id, 
        dh.action, 
        DATE_FORMAT(dh.timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp, 
        d.device_label 
      ${baseQuery} ${whereClause}
      ORDER BY dh.timestamp ${dir.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    params.push(parseInt(limit), parseInt(offset));

    const [devices] = await pool.query(dataQuery, params);

    res.status(200).json({
      status: "success",
      message: "Device data retrieved successfully",
      count: total,
      results: devices.length,
      data: devices,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

module.exports = exports;
