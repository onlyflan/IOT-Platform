const express = require("express");
const sensorController = require("../controllers/sensorController");

const router = express.Router();

router.get("/latest", sensorController.getLatest);
router.get("/data", sensorController.getSensorData);

module.exports = router;
