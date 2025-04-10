const mqtt = require("mqtt");
const dotenv = require("dotenv");
const {
  handleSensorData,
  handleDeviceData,
} = require("../controllers/mqttController");

dotenv.config({ path: "./config.env" });

const mqttOptions = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  protocol: "mqtt",
};

const client = mqtt.connect(mqttOptions);

client.on("connect", () => {
  console.log("Kết nối đến MQTT thành công");

  client.subscribe(["data/sensor", "device/data"], (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log("Đã subscribe vào các topic: data/sensor, device/data");
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    switch (topic) {
      case "data/sensor":
        await handleSensorData(data);
        break;

      case "device/data":
        await handleDeviceData(data);
        break;

      default:
        console.log("Unknown topic:", topic);
    }
  } catch (err) {
    console.error("Error parsing message:", err.message);
  }
});

module.exports = client;
