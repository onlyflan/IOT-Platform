import { useRef, useState, useEffect } from "react";
import { Table, Input, Button, Space, Pagination, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { get } from "../utils/request";

const HistoryPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const searchInput = useRef(null);

  useEffect(() => {
    fetchData();
  }, [pageNumber, searchDate, currentPageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = searchDate
        ? dayjs(searchDate).format("YYYY-MM-DD HH:mm:ss")
        : "";
      const fetchData = await get(
        `/devices/data?page=${pageNumber}&limit=${currentPageSize}&timestamp=${timestamp}&dir=asc`
      );

      if (fetchData.status === "success") {
        setTableData(fetchData.data || []);
        setTotal(fetchData.count || 0); // Sửa tại đây để hiển thị đúng tổng dữ liệu
      } else {
        message.error(fetchData.message || "Lấy dữ liệu thất bại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
      console.error("Error fetching history data:", error);
    }
    setLoading(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleDateSearch = (value) => {
    setSearchDate(value);
    setPageNumber(1); // Reset to first page when searching
  };

  const handleDateSearchSubmit = () => {
    // The fetchData will be called due to the useEffect dependency on searchDate
    setPageNumber(1); // Reset to first page when searching
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // This function is kept for future sorting functionality if needed
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "Thiết Bị",
      dataIndex: "device_label",
      key: "device_label",
      width: "30%",
      ...getColumnSearchProps("device"),
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (text) => {
        const isOn = text === "ON";
        return (
          <span
            style={{
              color: isOn ? "#52c41a" : "#ff4d4f",
            }}
          >
            {isOn ? "Bật" : "Tắt"}
          </span>
        );
      },
    },
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "35%",
      sorter: true,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (current, size) => {
    setCurrentPageSize(size);
    setPageNumber(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="Nhập thời gian"
          value={searchDate}
          onChange={(e) => handleDateSearch(e.target.value)}
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
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
      />
      <Pagination
        style={{ marginTop: 16 }}
        align="center"
        pageSize={currentPageSize}
        current={pageNumber}
        defaultCurrent={1}
        total={total}
        onChange={handlePageChange}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} của ${total} bản ghi`
        }
        showSizeChanger
        onShowSizeChange={handlePageSizeChange}
        showQuickJumper
      />
    </div>
  );
};

export default HistoryPage;
