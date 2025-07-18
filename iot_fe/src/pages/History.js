import { useRef, useState, useEffect } from "react";
import { Table, Input, Button, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { get } from "../utils/request";

const HistoryPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const searchInput = useRef(null);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [searchDate]);

  const fetchData = async (page = 1, pageSize = 10, sortOrder = "asc") => {
    setLoading(true);
    try {
      const timestamp = searchDate
        ? dayjs(searchDate).format("YYYY-MM-DD HH:mm:ss")
        : "";

      const res = await get(
        `/devices/data?page=${page}&limit=${pageSize}&timestamp=${timestamp}&dir=${sortOrder}`
      );

      if (res.status === "success") {
        setTableData(res.data || []);
        setPagination((prev) => ({
          ...prev,
          total: res.count || 0,
          current: page,
          pageSize: pageSize,
        }));
      } else {
        message.error(res.message || "Lấy dữ liệu thất bại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("Error fetching history data:", error);
    }
    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const sortOrder = sorter.order === "descend" ? "desc" : "asc";
    fetchData(pagination.current, pagination.pageSize, sortOrder);
  };

  const handleDateSearchSubmit = () => {
    fetchData(1, pagination.pageSize); // Reset về page 1 khi tìm kiếm
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="mb-2 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="w-24"
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            className="w-24"
          >
            Xóa
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined className={filtered ? "text-blue-500" : ""} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Thiết Bị",
      dataIndex: "device_label",
      key: "device_label",
      width: "25%",
      ...getColumnSearchProps("device_label"),
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render: (text) => {
        const isOn = text === "ON";
        return (
          <span style={{ color: isOn ? "#52c41a" : "#ff4d4f" }}>
            {isOn ? "Bật" : "Tắt"}
          </span>
        );
      },
    },
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "30%",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="Nhập thời gian (YYYY-MM-DD)"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{ width: "400px", marginRight: "10px" }}
          onPressEnter={handleDateSearchSubmit}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleDateSearchSubmit}
        >
          Tìm kiếm
        </Button>
      </div>
      <div style={{ width: "100%", height: 10 }}></div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bản ghi`,
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
};

export default HistoryPage;
