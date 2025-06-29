import { useState, useEffect } from "react";
import {
  Table,
  Tabs,
  Card,
  Tag,
  Button,
  Space,
  message,
  Modal,
  Input,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../../../configs/api";
import "./BookingDashboard.css";

const { TabPane } = Tabs;
const { Search } = Input;

// Định nghĩa tất cả status
const APPOINTMENT_STATUSES = [
  { key: "ALL", label: "Tất cả", color: "default" },
  { key: "PENDING", label: "Chờ xác nhận", color: "orange" },
  { key: "CONFIRMED", label: "Đã xác nhận", color: "blue" },
  { key: "CHECKED", label: "Đã khám", color: "green" },
  { key: "COMPLETED", label: "Hoàn thành", color: "success" },
  { key: "CANCELED", label: "Đã hủy", color: "red" },
  { key: "ABSENT", label: "Vắng mặt", color: "volcano" },
];

const BookingDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  // Fetch appointments theo status
  const fetchAppointments = async (status = "ALL") => {
    setLoading(true);
    try {
      let response;

      if (status === "ALL") {
        // Gọi tất cả status và merge lại
        const statusList = [
          "PENDING",
          "CONFIRMED",
          "CHECKED",
          "COMPLETED",
          "CANCELED",
          "ABSENT",
        ];
        const promises = statusList.map((s) =>
          api
            .get(`/appointment/by-status?status=${s}`)
            .catch(() => ({ data: [] }))
        );
        const responses = await Promise.all(promises);
        const allAppointments = responses.flatMap((res) => res.data || []);
        response = { data: allAppointments };
      } else {
        response = await api.get(`/appointment/by-status?status=${status}`);
      }

      const data = response.data || [];

      // Sort theo ngày tạo mới nhất
      const sortedData = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setAppointments(sortedData);
      console.log(
        `📋 Loaded ${sortedData.length} appointments for status: ${status}`
      );
      console.log("📋 Sample appointment data:", sortedData[0]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Không thể tải danh sách lịch hẹn");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load appointments khi component mount hoặc tab thay đổi
  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  // Filter appointments theo search text
  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      appointment.user?.fullname?.toLowerCase().includes(searchLower) ||
      appointment.user?.email?.toLowerCase().includes(searchLower) ||
      appointment.serviceName?.toLowerCase().includes(searchLower) ||
      appointment.service?.serviceName?.toLowerCase().includes(searchLower)
    );
  });

  // Get status color
  const getStatusColor = (status) => {
    const statusObj = APPOINTMENT_STATUSES.find((s) => s.key === status);
    return statusObj?.color || "default";
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusObj = APPOINTMENT_STATUSES.find((s) => s.key === status);
    return statusObj?.label || status;
  };

  // Format slotTime to display only time
  const formatSlotTime = (slotTime) => {
    if (!slotTime) return null;
    try {
      // If slotTime is datetime format like "2025-06-30T11:30:00"
      const date = new Date(slotTime);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return slotTime; // Return original if not valid date
      }
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.log("🕐 Format error:", error, "for slotTime:", slotTime);
      // If it's already just time string, return as is
      return slotTime;
    }
  };

  // Table columns
  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      width: 130,
      render: (_, record) => (
        <div className="booking-dashboard__customer">
          <div className="booking-dashboard__customer-name">
            {record.user?.fullname || "N/A"}
          </div>
          <div className="booking-dashboard__customer-email">
            {record.user?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      key: "service",
      width: 120,
      render: (_, record) => (
        <div className="booking-dashboard__service">
          <div className="booking-dashboard__service-name">
            {record.serviceName || record.service?.serviceName || "N/A"}
          </div>
          <div className="booking-dashboard__service-price">
            {record.service?.price
              ? `${record.service.price.toLocaleString()} VNĐ`
              : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày & Giờ",
      key: "datetime",
      width: 110,
      render: (_, record) => (
        <div className="booking-dashboard__datetime">
          <div className="booking-dashboard__date">
            {record.preferredDate
              ? new Date(record.preferredDate).toLocaleDateString("vi-VN")
              : "N/A"}
          </div>
          <div className="booking-dashboard__time">
            {(() => {
              // slotTime nằm trong appointmentDetails array
              const slotTime = record.appointmentDetails?.[0]?.slotTime;
              const formattedTime = formatSlotTime(slotTime);
              console.log("🕐 Time debug:", {
                appointmentDetails: record.appointmentDetails,
                slotTime: slotTime,
                formattedTime,
                slot: record.slot,
                final: formattedTime || record.slot || "Chưa có giờ",
              });
              return formattedTime || record.slot || "Chưa có giờ";
            })()}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 85,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 100,
      render: (note) => note || "Không có",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 90,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" className="booking-dashboard__action-space">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            className="booking-dashboard__view-btn"
            onClick={() => handleViewDetail(record)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            className="booking-dashboard__edit-btn"
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  // Handle actions
  const handleViewDetail = async (record) => {
    try {
      // Gọi API để lấy chi tiết appointment bằng ID
      console.log("🔍 Getting appointment detail for ID:", record.id);
      const response = await api.get(`/appointment/${record.id}`);
      const appointmentDetail = response.data;

      console.log("📋 Appointment detail:", appointmentDetail);

      Modal.info({
        title: "Chi tiết lịch hẹn",
        width: 700,
        content: (
          <div>
            <p>
              <strong>Khách hàng:</strong>{" "}
              {appointmentDetail.user?.fullname || record.user?.fullname}(
              {appointmentDetail.user?.email || record.user?.email})
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {appointmentDetail.user?.phone || "Chưa có"}
            </p>
            <p>
              <strong>Tên dịch vụ:</strong>{" "}
              {appointmentDetail.serviceName ||
                appointmentDetail.service?.serviceName ||
                record.serviceName}
            </p>
            <p>
              <strong>Giá dịch vụ:</strong>{" "}
              {appointmentDetail.service?.price?.toLocaleString() ||
                record.service?.price?.toLocaleString()}{" "}
              VNĐ
            </p>
            <p>
              <strong>Ngày hẹn:</strong>{" "}
              {appointmentDetail.preferredDate
                ? new Date(appointmentDetail.preferredDate).toLocaleDateString(
                    "vi-VN"
                  )
                : "N/A"}
            </p>
            <p>
              <strong>Giờ hẹn:</strong>{" "}
              {formatSlotTime(
                appointmentDetail.appointmentDetails?.[0]?.slotTime
              ) ||
                formatSlotTime(record.appointmentDetails?.[0]?.slotTime) ||
                appointmentDetail.slot ||
                record.slot ||
                "Chưa có"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {getStatusLabel(appointmentDetail.status || record.status)}
            </p>
            <p>
              <strong>Ghi chú:</strong>{" "}
              {appointmentDetail.note || record.note || "Không có"}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {appointmentDetail.created_at
                ? new Date(appointmentDetail.created_at).toLocaleString("vi-VN")
                : "N/A"}
            </p>
            <p>
              <strong>Cập nhật lần cuối:</strong>{" "}
              {appointmentDetail.updated_at
                ? new Date(appointmentDetail.updated_at).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error fetching appointment detail:", error);
      message.error("Không thể tải chi tiết lịch hẹn");

      // Fallback: Hiển thị thông tin từ record hiện tại
      Modal.info({
        title: "Chi tiết lịch hẹn",
        width: 600,
        content: (
          <div>
            <p>
              <strong>Khách hàng:</strong> {record.user?.fullname} (
              {record.user?.email})
            </p>
            <p>
              <strong>Tên dịch vụ:</strong>{" "}
              {record.serviceName || record.service?.serviceName}
            </p>
            <p>
              <strong>Giá:</strong> {record.service?.price?.toLocaleString()}{" "}
              VNĐ
            </p>
            <p>
              <strong>Ngày hẹn:</strong>{" "}
              {record.preferredDate
                ? new Date(record.preferredDate).toLocaleDateString("vi-VN")
                : "N/A"}
            </p>
            <p>
              <strong>Giờ hẹn:</strong>{" "}
              {formatSlotTime(record.appointmentDetails?.[0]?.slotTime) ||
                record.slot ||
                "Chưa có"}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getStatusLabel(record.status)}
            </p>
            <p>
              <strong>Ghi chú:</strong> {record.note || "Không có"}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {record.created_at
                ? new Date(record.created_at).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>
        ),
      });
    }
  };

  const handleEdit = (record) => {
    message.info("Chức năng chỉnh sửa đang được phát triển");
  };

  return (
    <Card title="Quản lý lịch hẹn" className="booking-dashboard">
      {/* Search */}
      <div className="booking-dashboard__search">
        <Search
          placeholder="Tìm kiếm theo tên, email, dịch vụ..."
          allowClear
          className="booking-dashboard__search-input"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="booking-dashboard__tabs"
        items={APPOINTMENT_STATUSES.map((status) => ({
          key: status.key,
          label: (
            <span className="booking-dashboard__tab-label">
              <Tag color={status.color}>{status.label}</Tag>
              {activeTab === status.key && (
                <span className="booking-dashboard__tab-count">
                  ({filteredAppointments.length})
                </span>
              )}
            </span>
          ),
        }))}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredAppointments}
        rowKey="id"
        loading={loading}
        className="booking-dashboard__table"
        scroll={{ x: 800 }}
        pagination={{
          total: filteredAppointments.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} lịch hẹn`,
        }}
      />
    </Card>
  );
};

export default BookingDashboard;
