import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Row, Col, Divider } from "antd";

const LineChart = ({
  data,
  sensorTypes = ["temperature", "humidity", "light"],
}) => {
  const metricConfigs = {
    temperature: {
      name: "Nhiệt độ (°C)",
      color: "#ff4d4f",
      key: "temperature",
    },
    humidity: {
      name: "Độ ẩm (%)",
      color: "#1890ff",
      key: "humidity",
    },
    light: {
      name: "Ánh sáng (LUX)",
      color: "#faad14",
      key: "light",
    },
  };

  const filteredMetricConfigs = {};
  sensorTypes.forEach((type) => {
    if (metricConfigs[type]) {
      filteredMetricConfigs[type] = metricConfigs[type];
    }
  });

  const formatChartData = () => {
    const sortedData = [...data].reverse();
    return sortedData.map((item) => {
      const timestamp = new Date(item.timestamp);
      const hour = timestamp.getHours();
      const minutes = timestamp.getMinutes();
      const seconds = timestamp.getSeconds();
      const formattedTime = `${hour}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
      return {
        timestamp: formattedTime,
        temperature: parseFloat(item.temperature),
        humidity: parseFloat(item.humidity),
        light: parseInt(item.light),
        id: item.id,
      };
    });
  };

  const CustomTooltip =
    (metric) =>
    ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Thời gian: {label}</strong>
            </p>
            <p
              style={{
                color: metricConfigs[metric].color,
                margin: "5px 0 0 0",
              }}
            >
              {metricConfigs[metric].name}: {payload[0].value}
            </p>
          </div>
        );
      }
      return null;
    };

  const chartData = formatChartData();

  const renderLineChart = (metric) => (
    <div>
      <h3 style={{ color: metricConfigs[metric].color, textAlign: "center" }}>
        {metricConfigs[metric].name}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="timestamp"
            angle={-20}
            textAnchor="end"
            height={60}
            label={{
              value: "Thời gian",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: metricConfigs[metric].name,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={metricConfigs[metric].key}
            name={metricConfigs[metric].name}
            stroke={metricConfigs[metric].color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{
              r: 6,
              stroke: metricConfigs[metric].color,
              strokeWidth: 2,
            }}
            animationDuration={500}
            animationEasing="ease-in-out"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Row gutter={[16, 16]}>
      {Object.keys(filteredMetricConfigs).map((metric) => (
        <Col key={metric} xs={24} sm={24} md={8}>
          {renderLineChart(metric)}
        </Col>
      ))}
    </Row>
  );
};

export default LineChart;
