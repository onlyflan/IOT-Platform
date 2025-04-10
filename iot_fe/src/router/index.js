import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "../Layout/SidebarLayout";
import DashboardPage from "../pages/Dashboard";
import HistoryPage from "../pages/History";
import ProfilePage from "../pages/Profile";
import SensorDataPage from "../pages/Sensors";

const { Content } = Layout;

const AppRouter = () => (
  <Router>
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <SidebarLayout />

      {/* Content */}
      <Layout>
        <Content style={{ padding: "0 20px", marginTop: 20 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/sensor-data" element={<SensorDataPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

export default AppRouter;
