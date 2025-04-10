const pool = require("../db/database");

// Lưu dữ liệu cảm biến vào bảng sensor_data
async function handleSensorData(data) {
  const { temperature, humidity, light_intensity, timestamp } = data;

  const sql = `
    INSERT INTO sensor_data (temperature, humidity, light_intensity, timestamp)
    VALUES (?, ?, ?, ?)
  `;

  console.log(data);
  try {
    const [result] = await pool.execute(sql, [
      temperature,
      humidity,
      light_intensity,
      timestamp || new Date(),
    ]);
    console.log("✅ Sensor data saved. ID:", result.insertId);
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
  }
}

// Lưu trạng thái thiết bị vào device_history
async function handleDeviceData(data) {
  const { device_name, action, timestamp } = data;

  try {
    // Lấy device_id theo device_name
    const [devices] = await pool.execute(
      "SELECT id FROM devices WHERE device_name = ?",
      [device_name]
    );

    if (devices.length === 0) {
      console.warn(`⚠️ Device '${device_name}' not found in database.`);
      return;
    }

    const device_id = devices[0].id;

    const sql = `
      INSERT INTO device_history (device_id, action, timestamp)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      device_id,
      action,
      timestamp || new Date(),
    ]);

    console.log("Device history saved. ID:", result.insertId);
  } catch (error) {
    console.error("Error saving device data:", error);
  }
}

module.exports = {
  handleSensorData,
  handleDeviceData,
};
