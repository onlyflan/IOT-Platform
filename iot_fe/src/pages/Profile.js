import React from "react";
import { Row, Col } from "antd";
import LeftProfile from "../components/LeftProfile";
import RightProfile from "../components/RightProfile";

const ProfilePage = () => {
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Row gutter={24}>
        <Col span={16}>
          <LeftProfile />
        </Col>
        <Col span={8}>
          <RightProfile />
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
