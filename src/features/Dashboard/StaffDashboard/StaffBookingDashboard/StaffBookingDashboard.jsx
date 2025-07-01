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
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import api from "../../../../configs/api";
import "../../AdminDashboard/BookingDashboard/BookingDashboard.css";

const { Search } = Input;

// Định nghĩa status cho Staff (bao gồm cả CANCELED)
const APPOINTMENT_STATUSES = [
  { key: "ALL", label: "Tất cả", color: "default" },
  { key: "PENDING", label: "Chờ xác nhận", color: "orange" },
  { key: "CONFIRMED", label: "Đã xác nhận", color: "blue" },
  { key: "CHECKED", label: "Có mặt", color: "green" },
  { key: "CANCELED", label: "Đã hủy", color: "red" },
];

const StaffBookingDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  // Fetch appointments theo status
  const fetchAppointments = async (status = "ALL") => {
    setLoading(true);
    try {
      let allAppointments = [];

      if (status === "ALL") {
        // Gọi API cho tất cả status của Staff và merge lại
        const statusList = ["PENDING", "CONFIRMED", "CHECKED", "CANCELED"];

        console.log(" Fetching staff appointments for statuses:", statusList);

        const promises = statusList.map(async (s) => {
          try {
            const response = await api.get(
              `/appointment/by-status?status=${s}`
            );
            console.log(
              ` Status ${s}:`,
              response.data?.length || 0,
              "appointments"
            );
            return response.data || [];
          } catch (error) {
            console.error(` Error fetching ${s}:`, error);
            return [];
          }
        });

        const responses = await Promise.all(promises);
        allAppointments = responses.flat();
      } else {
        // Gọi API với status cụ thể
        console.log(`📋 Fetching appointments for status: ${status}`);
        const response = await api.get(
          `/appointment/by-status?status=${status}`
        );
        allAppointments = response.data || [];
      }

      // Sort theo ngày tạo mới nhất
      const sortedData = allAppointments.sort(
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

  // Handle checked (check-in)
  const handleChecked = async (record) => {
    try {
      console.log("🔄 Checking appointment:", record.id);

      await api.put(`/appointment/${record.id}/checkin`);

      message.success("Đã đánh dấu checked thành công!");

      // Refresh appointments
      fetchAppointments(activeTab);
    } catch (error) {
      console.error(" Error checking appointment:", error);
      message.error("Không thể đánh dấu checked. Vui lòng thử lại!");
    }
  };

  // Handle view detail
  const handleViewDetail = (record) => {
    console.log("🔍 Showing appointment detail for:", record.id);

    Modal.info({
      title: "Chi tiết lịch hẹn",
      width: 700,
      content: (
        <div>
          <p>
            <strong>Tên khách hàng:</strong> {record.customerName || "N/A"}
          </p>
          <p>
            <strong>Dịch vụ:</strong> {record.serviceName || "N/A"}
          </p>
          <p>
            <strong>Giá dịch vụ:</strong>{" "}
            {record.price?.toLocaleString() || "0"} VNĐ
          </p>
          <p>
            <strong>Ngày & Giờ hẹn:</strong>{" "}
            {(() => {
              const slotTime = record.appointmentDetails?.[0]?.slotTime;
              if (slotTime) {
                const dateTime = new Date(slotTime);
                return `${dateTime.toLocaleDateString(
                  "vi-VN"
                )} - ${dateTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;
              }
              return record.preferredDate
                ? new Date(record.preferredDate).toLocaleDateString("vi-VN")
                : "N/A";
            })()}
          </p>
          <p>
            <strong>Trạng thái:</strong> {getStatusLabel(record.status)}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {record.created_at
              ? new Date(record.created_at).toLocaleDateString("vi-VN")
              : "N/A"}
          </p>
          <p>
            <strong>Ghi chú:</strong> {record.note || "Không có"}
          </p>
          {record.appointmentDetails?.[0] && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#f5f5f5",
                borderRadius: 4,
              }}
            >
              <p>
                <strong>Thông tin chi tiết:</strong>
              </p>
              <p>
                • <strong>Tư vấn viên:</strong>{" "}
                {record.appointmentDetails[0].consultantName ||
                  "Chưa phân công"}
              </p>
              <p>
                • <strong>Trạng thái chi tiết:</strong>{" "}
                {getStatusLabel(record.appointmentDetails[0].status)}
              </p>
              {record.appointmentDetails[0].medicalResult && (
                <div>
                  <p>
                    • <strong>Kết quả khám:</strong>
                  </p>
                  <p style={{ marginLeft: 16 }}>
                    - Chẩn đoán:{" "}
                    {record.appointmentDetails[0].medicalResult.diagnosis ||
                      "Chưa có"}
                  </p>
                  <p style={{ marginLeft: 16 }}>
                    - Kế hoạch điều trị:{" "}
                    {record.appointmentDetails[0].medicalResult.treatmentPlan ||
                      "Chưa có"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    });
  };

  const handleEdit = () => {
    message.info("Chức năng chỉnh sửa đang được phát triển");
  };

  // Hủy lịch hẹn
  const handleCancelAppointment = async (record) => {
    try {
      console.log("🔄 Canceling appointment:", record.id);

      // Gọi API để hủy lịch hẹn (cập nhật status thành CANCELED)
      const response = await api.put(`/appointment/${record.id}`, {
        ...record,
        status: "CANCELED",
      });

      console.log("✅ Appointment canceled successfully:", response.data);
      message.success(
        "Hủy lịch hẹn thành công! Trạng thái đã chuyển sang CANCELED."
      );

      // Refresh danh sách appointments
      await fetchAppointments(activeTab);
    } catch (error) {
      console.error("❌ Error canceling appointment:", error);
      console.error("Error details:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi hủy lịch hẹn!";
      message.error(errorMessage);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 70,
      render: (customerName) => (
        <div className="booking-dashboard__customer-name">
          {customerName || "N/A"}
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 150,
      render: (serviceName, record) => (
        <div className="booking-dashboard__service">
          <div className="booking-dashboard__service-name">
            {serviceName || "N/A"}
          </div>
          <div className="booking-dashboard__service-price">
            {record.price ? `${record.price.toLocaleString()} VNĐ` : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày & Giờ",
      key: "datetime",
      width: 40,
      render: (_, record) => {
        // Lấy slotTime từ appointmentDetails array
        const slotTime = record.appointmentDetails?.[0]?.slotTime;

        if (slotTime) {
          const dateTime = new Date(slotTime);
          const date = dateTime.toLocaleDateString("vi-VN");
          const time = dateTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className="booking-dashboard__datetime">
              <div className="booking-dashboard__date">{date}</div>
              <div className="booking-dashboard__time">{time}</div>
            </div>
          );
        }

        // Fallback to preferredDate if no slotTime
        return (
          <div className="booking-dashboard__datetime">
            <div className="booking-dashboard__date">
              {record.preferredDate
                ? new Date(record.preferredDate).toLocaleDateString("vi-VN")
                : "N/A"}
            </div>
            <div className="booking-dashboard__time">Chưa có giờ</div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 45,
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
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" className="booking-dashboard__action-space">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            className="booking-dashboard__view-btn"
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          >
            Chi tiết
          </Button>
          {record.status === "CONFIRMED" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleChecked(record)}
              title="Đánh dấu đã khám"
              className="booking-dashboard__checkin-btn"
            >
              Checking
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            className="booking-dashboard__edit-btn"
            onClick={() => handleEdit()}
            title="Chỉnh sửa"
          >
            Sửa
          </Button>
          {(record.status === "PENDING" ||
            record.status === "CONFIRMED" ||
            record.status === "CHECKED") &&
            record.status !== "CANCELED" && (
              <Popconfirm
                title="Hủy lịch hẹn"
                description="Bạn có chắc chắn muốn hủy lịch hẹn này?"
                onConfirm={() => handleCancelAppointment(record)}
                okText="Có"
                cancelText="Không"
                okType="danger"
              >
                <Button
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  className="booking-dashboard__cancel-btn"
                  title="Hủy lịch hẹn"
                >
                  Hủy
                </Button>
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ];

  // Filter appointments based on search text
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customerName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      appointment.serviceName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card title="Quản lý lịch hẹn" className="booking-dashboard">
      {/* Search */}
      <div className="booking-dashboard__search">
        <Search
          placeholder="Tìm kiếm theo tên khách hàng, dịch vụ..."
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
            <span className="booking-dashboard__tab-label">{status.label}</span>
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

export default StaffBookingDashboard;
