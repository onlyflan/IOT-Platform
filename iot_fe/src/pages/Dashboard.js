import { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Typography, Spin, Alert, message } from "antd";
import DeviceControl from "../components/DeviceControl";
import LineChart from "../components/LineChart";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceStates, setDeviceStates] = useState({});
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
  });

  const cardHeaderStyle = {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
  };

  const cardContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "120px",
    padding: "10px",
  };

  const metricStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "4px 0",
  };

  const colors = {
    temperature: "#ff4d4f",
    humidity: "#1890ff",
    light: "#52c41a",
  };

  const getTemperatureStatus = (temp) => {
    if (temp >= 28) return "Cao";
    if (temp < 28) return "Thấp";
    return "Trung bình";
  };

  const getHumidityStatus = (humidity) => {
    if (humidity >= 75) return "Cao";
    if (humidity < 75) return "Thấp";
    return "Trung bình";
  };

  const getLightStatus = (light) => {
    if (light >= 500) return "Cao";
    if (light < 500) return "Thấp";
    return "Trung bình";
  };

  const fetchSensorData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/sensors/latest"
      );
      const newSensorData = res.data.record;

      if (newSensorData.length > 0) {
        setSensorData(newSensorData);
        const latest = newSensorData[0];
        setCurrentData({
          temperature: parseFloat(latest.temperature),
          humidity: parseFloat(latest.humidity),
          light: parseInt(latest.light),
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải sensor:", err);
      setError("Không thể kết nối đến sensor.");
    }
  };

  const fetchDeviceStatus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/devices/status"
      );
      const devices = res.data.data;
      setDeviceData(devices);

      const states = {};
      devices.forEach((item) => {
        states[item.device_name] = item.action === "ON";
      });
      setDeviceStates(states);
    } catch (err) {
      console.error("Lỗi khi tải device:", err);
      setError("Không thể kết nối đến thiết bị.");
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      await fetchSensorData();
      await fetchDeviceStatus();
      setLoading(false);
    };

    fetchInitial();

    const interval = setInterval(() => {
      fetchSensorData();
      fetchDeviceStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDeviceChange = async (id, checked) => {
    const action = checked ? "ON" : "OFF";
    const payload = { device_name: id, action };

    const hide = message.loading(`Đang gửi lệnh ${action} cho ${id}...`, 0);

    try {
      await axios.post("http://localhost:5000/api/v1/devices/toggle", payload);

      setTimeout(async () => {
        try {
          await fetchDeviceStatus();
          message.success(`Thiết bị ${id} đã được ${action}`, 2);
        } catch (fetchErr) {
          message.error("Không thể xác nhận trạng thái thiết bị.", 2);
        }
      }, 1000);
    } catch (err) {
      console.error("Lỗi điều khiển thiết bị:", err);
      message.error(`Không thể điều khiển ${id}.`, 2);
    } finally {
      hide();
    }
  };

  const extractDevices = () => {
    const uniqueDevices = new Map();

    deviceData.forEach((item) => {
      const key = item.device_name;
      if (!uniqueDevices.has(key)) {
        uniqueDevices.set(key, {
          id: key,
          label: item.device_label,
        });
      }
    });

    return Array.from(uniqueDevices.values());
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  const sensorTypes = ["temperature", "humidity", "light"];

  return (
    <Layout>
      <Content style={{ padding: "0 20px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="Nhiệt độ"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{
                borderTop: `4px solid ${colors.temperature}`,
                backgroundColor:
                  currentData.temperature > 28 ? "#ff4d4f33" : "inherit",
              }}
            >
              <Title
                level={2}
                style={{ ...metricStyle, color: colors.temperature }}
              >
                {currentData.temperature.toFixed(1)}°C
              </Title>
              <div>{getTemperatureStatus(currentData.temperature)}</div>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title="Độ ẩm"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{
                borderTop: `4px solid ${colors.humidity}`,
                backgroundColor:
                  currentData.humidity >= 75 ? "#bae7ff" : "inherit",
              }}
            >
              <Title
                level={2}
                style={{ ...metricStyle, color: colors.humidity }}
              >
                {currentData.humidity.toFixed(1)}%
              </Title>
              <div>{getHumidityStatus(currentData.humidity)}</div>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title="Ánh sáng"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{
                borderTop: `4px solid ${colors.light}`,
                backgroundColor:
                  currentData.light >= 500 ? "#b7eb8f" : "inherit",
              }}
            >
              <Title level={2} style={{ ...metricStyle, color: colors.light }}>
                {currentData.light}
              </Title>
              <div>LUX ({getLightStatus(currentData.light)})</div>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={20}>
            <Card title="Biểu đồ cảm biến" headStyle={cardHeaderStyle}>
              <LineChart
                data={sensorData}
                sensorTypes={sensorTypes}
                defaultMetric="temperature"
              />
            </Card>
          </Col>
          <Col span={4}>
            <DeviceControl
              devices={extractDevices()}
              deviceStates={deviceStates}
              onChangeDevice={handleDeviceChange}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
