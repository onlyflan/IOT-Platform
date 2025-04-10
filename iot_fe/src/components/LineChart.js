import React from "react";
import { Line } from "@ant-design/charts";
import { Radio } from "antd";
import { useState } from "react";

const LineChart = ({ data }) => {
  const [metric, setMetric] = useState("temperature");

  // Function to format data for charts
  const formatChartData = () => {
    return data.map((item) => {
      // Extract hour from timestamp for x-axis
      const timestamp = new Date(item.timestamp);
      const hour = timestamp.getHours();
      const formattedDate = `${timestamp.getDate()}/${
        timestamp.getMonth() + 1
      } ${hour}:00`;

      return {
        timestamp: formattedDate,
        value:
          metric === "temperature"
            ? parseFloat(item.temperature)
            : metric === "humidity"
            ? parseFloat(item.humidity)
            : item.light_intensity,
        metric:
          metric === "temperature"
            ? "Nhiệt độ (°C)"
            : metric === "humidity"
            ? "Độ ẩm (%)"
            : "Ánh sáng (LUX)",
      };
    });
  };

  const config = {
    data: formatChartData(),
    xField: "timestamp",
    yField: "value",
    seriesField: "metric",
    point: {
      size: 4,
      shape: "circle",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.metric,
          value: datum.value,
        };
      },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <Radio.Group
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="temperature">Nhiệt độ</Radio.Button>
          <Radio.Button value="humidity">Độ ẩm</Radio.Button>
          <Radio.Button value="light_intensity">Ánh sáng</Radio.Button>
        </Radio.Group>
      </div>
      <Line {...config} height={300} />
    </div>
  );
};

export default LineChart;
