const pool = require("../db/database");

const saveSensorData = async ({ temperature, humidity, light_intensity }) => {
  const now = new Date();
  const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const timestamp = vietnamTime.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await pool.query(
    `INSERT INTO sensor_data (timestamp, temperature, humidity, light_intensity) VALUES (?, ?, ?, ?)`,
    [timestamp, temperature, humidity, light_intensity]
  );

  return result;
};

const logDeviceAction = async ({ device_id, action }) => {
  const now = new Date();
  const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const timestamp = vietnamTime.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await pool.query(
    `INSERT INTO device_history (device_id, action, timestamp) VALUES (?, ?, ?)`,
    [device_id, action, timestamp]
  );

  return result;
};

module.exports = {
  saveSensorData,
  logDeviceAction,
};
