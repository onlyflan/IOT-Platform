import React, { useEffect } from "react";
import { Switch, Card, message } from "antd";
import { Fan, Lightbulb, Droplets, Flame, Tv } from "lucide-react";

const DeviceControl = ({ devices, deviceStates, onChangeDevice }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        25% { opacity: 0.7; }
        50% { opacity: 0.3; }
        75% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getIcon = (deviceId, deviceLabel, isActive) => {
    const baseStyle = {
      width: 24,
      height: 24,
      color: isActive ? "#1890ff" : "#666",
    };

    let animationStyle = {};
    if (isActive) {
      if (deviceLabel.toLowerCase().includes("quạt")) {
        animationStyle = { animation: "spin 2s linear infinite" };
      } else if (deviceLabel.toLowerCase().includes("đèn")) {
        animationStyle = { animation: "pulse 1.5s ease-in-out infinite" };
      } else if (
        deviceLabel.toLowerCase().includes("tạo ẩm") ||
        deviceLabel.toLowerCase().includes("tưới")
      ) {
        animationStyle = { animation: "bounce 1s ease-in-out infinite" };
      } else if (
        deviceLabel.toLowerCase().includes("sưởi") ||
        deviceLabel.toLowerCase().includes("nóng")
      ) {
        animationStyle = { animation: "flicker 1.2s ease-in-out infinite" };
      }
    }

    const iconStyle = { ...baseStyle, ...animationStyle };

    if (deviceLabel.toLowerCase().includes("quạt")) {
      return <Fan style={iconStyle} />;
    } else if (deviceLabel.toLowerCase().includes("đèn")) {
      return <Lightbulb style={iconStyle} />;
    } else if (
      deviceLabel.toLowerCase().includes("tạo ẩm") ||
      deviceLabel.toLowerCase().includes("tưới")
    ) {
      return <Droplets style={iconStyle} />;
    } else if (
      deviceLabel.toLowerCase().includes("sưởi") ||
      deviceLabel.toLowerCase().includes("nóng")
    ) {
      return <Flame style={iconStyle} />;
    } else {
      return <Tv style={iconStyle} />;
    }
  };

  const handleChange = (deviceId, checked) => {
    message.loading({
      content: `Đang xử lý thiết bị ${checked ? "bật" : "tắt"}...`,
      key: deviceId,
      duration: 1.2,
    });

    onChangeDevice(deviceId, checked);
  };

  return (
    <Card title="Bật / Tắt thiết bị">
      {devices.map((device, index) => (
        <div
          key={device.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: index < devices.length - 1 ? 16 : 0,
            padding: "8px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {getIcon(device.id, device.label, deviceStates?.[device.id])}
            <span>{device.label}</span>
          </div>
          <Switch
            checked={deviceStates?.[device.id] ?? false}
            onChange={(checked) => handleChange(device.id, checked)}
            style={{ marginLeft: 20 }}
          />
        </div>
      ))}
    </Card>
  );
};

export default DeviceControl;
