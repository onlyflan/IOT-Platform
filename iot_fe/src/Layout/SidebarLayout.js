import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  HistoryOutlined,
  ProfileOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const SidebarLayout = () => (
  <Sider width={250} className="site-layout-background">
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <Menu.Item key="1" icon={<HomeOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<HistoryOutlined />}>
        <Link to="/history">Lịch sử</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreAddOutlined />}>
        <Link to="/sensor-data">Dữ liệu cảm biến</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<ProfileOutlined />}>
        <Link to="/profile">Trang cá nhân</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default SidebarLayout;
