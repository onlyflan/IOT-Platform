const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const mqttClient = require("./db/mqtt_connection");

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
