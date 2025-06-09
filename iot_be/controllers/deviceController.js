const Device = require("../models/deviceModel");
const mqttClient = require("../db/mqtt_connection");

const DEVICE_MAP = {
  LED_1: { mqttKey: "led_1", label: "Đèn" },
  LED_2: { mqttKey: "led_2", label: "Quạt" },
  LED_3: { mqttKey: "led_3", label: "Máy Sưởi" },
};

exports.toggleDevice = async (req, res) => {
  try {
    const { device_name, action } = req.body;
    const mapping = DEVICE_MAP[device_name];

    if (!mapping || !["ON", "OFF"].includes(action)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid device_name or action. Valid actions: ON, OFF",
      });
    }

    const mqttKey = mapping.mqttKey;
    const expectedPayload = {
      device_name: device_name,
      action: action,
    };

    // Publish lệnh điều khiển
    const payload = JSON.stringify({
      [mqttKey]: action === "ON" ? 1 : 0,
    });

    mqttClient.publish("device/control", payload, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
        return res.status(500).json({ status: "fail", message: "MQTT error" });
      }

      console.log(`Published MQTT to device/control: ${payload}`);

      // Lắng nghe phản hồi từ ESP (topic: device/data)
      const timeout = setTimeout(() => {
        mqttClient.removeListener("message", onMessage);
        return res.status(504).json({
          status: "fail",
          message: "Timeout: Không nhận được phản hồi từ thiết bị sau 10s.",
        });
      }, 10000); // 10s timeout

      const onMessage = async (topic, message) => {
        // console.log("MQTT message:", topic, message.toString());
        if (topic !== "device/data") return;

        try {
          const parsed = JSON.parse(message.toString());

          if (
            parsed.device_name === expectedPayload.device_name &&
            parsed.action === expectedPayload.action
          ) {
            clearTimeout(timeout);
            mqttClient.removeListener("message", onMessage);

            console.log("Xác nhận từ ESP:", parsed);

            return res.status(200).json({
              status: "success",
              message: `Device ${device_name} toggled to ${action}`,
            });
          }
        } catch (error) {
          console.error("Lỗi parse message từ MQTT:", error);
        }
      };

      mqttClient.on("message", onMessage);
    });
  } catch (err) {
    console.error("toggleDevice error:", err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getDeviceData = async (req, res) => {
  try {
    const { total, data } = await Device.fetchDeviceData(req.query);

    res.status(200).json({
      status: "success",
      message: "Device data retrieved successfully",
      count: total,
      results: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getCurrentDeviceStates = async (_req, res) => {
  try {
    const data = await Device.getLatestStates();
    res.status(200).json({
      status: "success",
      message: "Current device states retrieved",
      data,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
