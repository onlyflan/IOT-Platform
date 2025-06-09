import { useState, useEffect } from "react";
import { Table, Select, Input, Space, Button, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";

const SensorDataPage = () => {
  const [data, setData] = useState([]);
  const [searchMetric, setSearchMetric] = useState("timestamp");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, pageSize = 10, sortOrder = "asc") => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pageSize,
        dir: sortOrder,
      };

      if (searchValue) {
        params.keyword = searchValue;
        params.type = searchMetric;
      }

      const response = await axios.get(
        "http://localhost:5000/api/v1/sensors/data",
        { params }
      );

      const apiData = response.data.record.map((item) => ({
        ...item,
        key: item.id,
        light: item.light,
      }));

      setData(apiData);
      setPagination((prev) => ({
        ...prev,
        total: response.data.count,
        current: page,
        pageSize,
      }));
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy dữ liệu cảm biến");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    fetchData(1, pagination.pageSize);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const sortOrder = sorter.order === "descend" ? "desc" : "asc";
    fetchData(pagination.current, pagination.pageSize, sortOrder);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "25%",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: true,
    },
    {
      title: "Nhiệt Độ (°C)",
      dataIndex: "temperature",
      key: "temperature",
      width: "20%",
      render: (value) => parseFloat(value).toFixed(1),
      sorter: true,
    },
    {
      title: "Độ Ẩm (%)",
      dataIndex: "humidity",
      key: "humidity",
      width: "20%",
      render: (value) => parseFloat(value).toFixed(1),
      sorter: true,
    },
    {
      title: "Ánh Sáng (lux)",
      dataIndex: "light",
      key: "light",
      width: "20%",
      render: (value) => parseInt(value),
      sorter: true,
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Space className="w-full mb-4">
        <Select
          className="w-32"
          value={searchMetric}
          onChange={setSearchMetric}
          options={[
            { value: "timestamp", label: "Thời Gian" },
            { value: "temperature", label: "Nhiệt Độ" },
            { value: "humidity", label: "Độ Ẩm" },
            { value: "light", label: "Ánh Sáng" },
            { value: "wind", label: "Tốc độ gió" },
          ]}
        />
        <Input
          className="w-64"
          placeholder="Nhập giá trị tìm kiếm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() => handleSearch(searchValue)}
        />
        <Button type="primary" onClick={() => handleSearch(searchValue)}>
          Tìm kiếm
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bản ghi`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SensorDataPage;
