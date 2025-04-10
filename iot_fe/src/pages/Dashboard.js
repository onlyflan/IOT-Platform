import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Typography, Spin, Alert } from "antd";
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
    minHeight: "200px",
    padding: "20px",
  };

  const metricStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "8px 0",
  };

  const colors = {
    temperature: "#ff4d4f",
    humidity: "#1890ff",
    light: "#52c41a",
  };

  // Get temperature status
  const getTemperatureStatus = (temp) => {
    if (temp >= 28) return "Cao";
    if (temp <= 20) return "Thấp";
    return "Trung bình";
  };

  // Get humidity status
  const getHumidityStatus = (humidity) => {
    if (humidity >= 80) return "Cao";
    if (humidity <= 60) return "Thấp";
    return "Trung bình";
  };

  // Get light status
  const getLightStatus = (light) => {
    if (light >= 500) return "Cao";
    if (light <= 200) return "Thấp";
    return "Trung bình";
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch sensor data
        const sensorResponse = await axios.get(
          "http://localhost:5000/api/v1/sensors/data"
        );
        const sensorDataArray = sensorResponse.data.data;

        // Fetch device data
        const deviceResponse = await axios.get(
          "http://localhost:5000/api/v1/devices/data"
        );
        const deviceDataArray = deviceResponse.data.data;

        setSensorData(sensorDataArray);
        setDeviceData(deviceDataArray);

        // Set current data from the latest sensor reading
        const latestSensorData = sensorDataArray[sensorDataArray.length - 1];
        setCurrentData({
          temperature: parseFloat(latestSensorData.temperature),
          humidity: parseFloat(latestSensorData.humidity),
          light: latestSensorData.light_intensity,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling every 60 seconds to refresh data
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle device state changes
  const handleDeviceChange = async (id, checked) => {
    try {
      // Here you would normally send a request to your backend to update the device state
      console.log(`Device ${id} changed to: ${checked ? "ON" : "OFF"}`);

      // Example API call (uncomment and adjust endpoint when ready)
      // await axios.post('http://localhost:6000/api/v1/devices/control', {
      //   device_id: id,
      //   action: checked ? 'ON' : 'OFF'
      // });
    } catch (err) {
      console.error("Error changing device state:", err);
      setError("Không thể điều khiển thiết bị. Vui lòng thử lại sau.");
    }
  };

  // Extract unique devices from device data
  const extractDevices = () => {
    const uniqueDevices = new Map();

    deviceData.forEach((item) => {
      if (!uniqueDevices.has(item.device_id)) {
        uniqueDevices.set(item.device_id, {
          id: item.device_id.toString(),
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

  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <Row gutter={16}>
          {/* Card Nhiệt độ */}
          <Col span={8}>
            <Card
              title="Nhiệt độ"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{ borderTop: `4px solid ${colors.temperature}` }}
            >
              <Title
                level={1}
                style={{ ...metricStyle, color: colors.temperature }}
              >
                {currentData.temperature.toFixed(1)}°C
              </Title>
              <div>{getTemperatureStatus(currentData.temperature)}</div>
            </Card>
          </Col>

          {/* Card Độ ẩm */}
          <Col span={8}>
            <Card
              title="Độ ẩm"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{ borderTop: `4px solid ${colors.humidity}` }}
            >
              <Title
                level={1}
                style={{ ...metricStyle, color: colors.humidity }}
              >
                {currentData.humidity.toFixed(1)}%
              </Title>
              <div>{getHumidityStatus(currentData.humidity)}</div>
            </Card>
          </Col>

          {/* Card Ánh sáng */}
          <Col span={8}>
            <Card
              title="Ánh sáng"
              headStyle={cardHeaderStyle}
              bodyStyle={cardContentStyle}
              style={{ borderTop: `4px solid ${colors.light}` }}
            >
              <Title level={1} style={{ ...metricStyle, color: colors.light }}>
                {currentData.light}
              </Title>
              <div>LUX ({getLightStatus(currentData.light)})</div>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={16}>
            <Card title="Biểu đồ" headStyle={cardHeaderStyle}>
              <LineChart data={sensorData} />
            </Card>
          </Col>
          <Col span={8}>
            <DeviceControl
              devices={extractDevices()}
              onChangeDevice={handleDeviceChange}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
