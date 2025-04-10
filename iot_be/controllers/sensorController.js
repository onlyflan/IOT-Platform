const Sensor = require("../models/sensorModel");

exports.getLatest = async (req, res) => {
  try {
    const sensors = await Sensor.getLatest();
    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu cảm biến mới nhất thành công",
      results: sensors.length,
      data: sensors,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const { page, limit, type, dir, keyword } = req.query;

    let sensors = [];
    let total = 0;

    if (!page && !limit && !type && !dir && !keyword) {
      sensors = await Sensor.getAllSorted();
      total = sensors.length;
    } else {
      const result = await Sensor.getSensorData({
        page,
        limit,
        type,
        dir,
        keyword,
      });

      sensors = result.data;
      total = result.total;
    }

    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu cảm biến thành công",
      count: total,
      results: sensors.length,
      data: sensors,
    });
  } catch (err) {
    console.error("Sensor error:", err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

module.exports = exports;
