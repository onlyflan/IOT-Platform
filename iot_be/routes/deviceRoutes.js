const express = require("express");
const deviceController = require("../controllers/deviceController");

const router = express.Router();

router.route("/data").get(deviceController.getDeviceData).get;
router.route("/toggle").post(deviceController.toggleDevice);
router.route("/status").get(deviceController.getCurrentDeviceStates);

module.exports = router;
