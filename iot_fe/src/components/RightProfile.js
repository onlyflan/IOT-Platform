import { useState } from "react";
import { Button, Card, Upload, Space } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import Avatar from "../assets/images/avatar.png";

const RightProfile = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto",
              width: "96px",
              height: "96px",
              marginBottom: "16px",
            }}
          >
            <img
              src={imageUrl || Avatar}
              alt="Ảnh đại diện"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          <h3 style={{ margin: "8px 0" }}>Thái Kim Quý</h3>
          <p style={{ color: "#666", marginBottom: "4px" }}>
            qalc2003@gmail.com
          </p>
          <p style={{ color: "#666", marginBottom: "4px" }}>
            <bold>MSV</bold> : B21DCPT193
          </p>
          <p style={{ color: "#666", marginBottom: "16px" }}>
            Hà Nội, Việt Nam
          </p>

          {/* Thêm các liên kết dưới đây */}
          <div style={{ marginBottom: "16px" }}>
            <a
              href="https://github.com/onlyflan/IOT-Platform"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: "16px" }}
            >
              GitHub
            </a>
            <a
              href="profile"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: "16px" }}
            >
              API Docs
            </a>
            <a href="profile" target="_blank" rel="noopener noreferrer">
              Tải PDF
            </a>
          </div>

          <Space>
            <Button type="primary">Kết nối</Button>
            <Button>Gửi tin nhắn</Button>
          </Space>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginBottom: "16px" }}>Chọn ảnh đại diện</h3>
        <Upload
          onChange={handleChange}
          showUploadList={false}
          maxCount={1}
          accept="image/*"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <CameraOutlined style={{ fontSize: "20px", color: "#999" }} />
            </div>
            <div>
              <p style={{ margin: 0 }}>Chọn ảnh</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                JPG, GIF hoặc PNG. Kích thước tối đa 800K
              </p>
            </div>
          </div>
        </Upload>
      </Card>
    </div>
  );
};

export default RightProfile;
