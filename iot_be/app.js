const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const sensorRoutes = require("./routes/sensorRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/sensors", sensorRoutes);
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/auth", userRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route không tồn tại!" });
});

module.exports = app;
