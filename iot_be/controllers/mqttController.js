const pool = require("../db/database");

// Lưu dữ liệu cảm biến vào bảng sensor_data
async function handleSensorData(data) {
  console.log("Received sensor data:", data);

  const { temperature, humidity, light, wind, timestamp } = data;

  const sql = `
    INSERT INTO sensor_data (temperature, humidity, light, timestamp)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(sql, [
      temperature,
      humidity,
      light,
      timestamp || new Date(),
    ]);
    console.log("Sensor data saved. ID:", result.insertId);
  } catch (error) {
    console.error("Error saving sensor data:", error);
  }
}

// Gọi khi nhận message từ topic 'device/data'
async function handleDeviceData(data) {
  console.log("Received device data:", data);

  const { device_name, action, timestamp } = data;
  console.log("Device name:", device_name);
  // Map thiết bị để có label
  const DEVICE_LABELS = {
    LED_1: "Đèn",
    LED_2: "Quạt",
    LED_3: "Máy Sưởi",
  };

  console.log("Device label name:", DEVICE_LABELS[device_name]);
  const device_label = DEVICE_LABELS[device_name] || device_name; // fallback nếu không có trong map

  const logTime =
    timestamp ||
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

  const sql = `
    INSERT INTO device_history (device_name, device_label, action, timestamp)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(sql, [
      device_name,
      device_label,
      action,
      logTime,
    ]);
    console.log(
      `Device '${device_name}' action '${action}' logged (ID: ${result.insertId})`
    );
  } catch (error) {
    console.error("Error saving device data:", error);
  }
}

module.exports = {
  handleSensorData,
  handleDeviceData,
};
