// pages/UserProfile/Booking.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Modal } from "antd";
import api from "../../../configs/api";
import "./Booking.css";
const TABS = [
  { key: "upcoming", label: "Lịch hẹn sắp đến" },
  { key: "completed", label: "Hoàn thành" },
  { key: "history", label: "Lịch sử đặt chỗ" },
  { key: "combo", label: "Gói khám" },
];

// API status mapping
const STATUS_MAP = {
  upcoming: ["CONFIRMED", "PENDING", "CHECKED"],
  completed: ["COMPLETED"],
  history: ["CANCELED"],
};

const Booking = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [zoomUrls, setZoomUrls] = useState({}); // Cache Zoom URLs by appointment ID
  const [blinkingButtons, setBlinkingButtons] = useState({}); // Track which buttons are blinking

  // Modal chi tiết lịch hẹn
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const navigate = useNavigate();
  const { search } = useLocation();
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  // Track if payment success message has been shown
  const paymentMessageShown = useRef(false);

  // Function to verify VNPay payment with backend
  const verifyVNPayPayment = useCallback(async (urlParams) => {
    try {
      console.log(" Verifying VNPay payment with backend...");

      // Gọi API backend để verify payment
      const response = await api.get("/payment/vnpay/vnpay-return", {
        params: Object.fromEntries(urlParams.entries()),
      });

      console.log(" VNPay verification response:", response.data);
    } catch (error) {
      console.error(" Error verifying VNPay payment:", error);
      message.error("Có lỗi khi xác thực thanh toán với server.");
    }
  }, []);

  // Function to get and cache Zoom URL
  const getZoomUrl = useCallback(async (appointmentId) => {
    try {
      console.log(" Getting Zoom URL for appointment:", appointmentId);

      const response = await api.get(
        `/zoom/test-create-meeting?appointmentId=${appointmentId}`
      );
      const meetingData = response.data;

      console.log(" Zoom meeting data:", meetingData);

      if (meetingData.join_url) {
        // Cache the URL
        setZoomUrls((prev) => ({
          ...prev,
          [appointmentId]: meetingData.join_url,
        }));
        return meetingData.join_url;
      }
      return null;
    } catch (error) {
      console.error(" Error getting Zoom URL:", error);
      return null;
    }
  }, []);

  // Function to join Zoom meeting
  const joinZoomMeeting = useCallback(
    async (appointment) => {
      // Check if URL is already cached
      let joinUrl = zoomUrls[appointment.id];

      if (!joinUrl) {
        // Show loading and fetch URL
        message.loading("Đang kết nối phòng tư vấn...", 0.5);
        joinUrl = await getZoomUrl(appointment.id);
        message.destroy();
      }

      if (joinUrl) {
        window.open(joinUrl, "_blank");
        message.success("Đã mở phòng tư vấn online!", 1);

        // Start blinking animation
        setBlinkingButtons((prev) => ({
          ...prev,
          [appointment.id]: true,
        }));

        // Stop blinking after 3 seconds
        setTimeout(() => {
          setBlinkingButtons((prev) => ({
            ...prev,
            [appointment.id]: false,
          }));
        }, 3000);
      } else {
        message.error("Không thể kết nối phòng tư vấn. Vui lòng thử lại!");
      }
    },
    [zoomUrls, getZoomUrl]
  );

  // Fetch appointments based on active tab
  const fetchAppointments = useCallback(async () => {
    if (!token) {
      console.warn("Không có token để gọi API!");
      return;
    }

    setLoading(true);
    try {
      const statuses = STATUS_MAP[activeTab];
      let data = [];

      if (activeTab === "upcoming") {
        // Fetch multiple statuses for upcoming
        const requests = statuses.map((status) =>
          api.get(`/appointment/by-status?status=${status}`)
        );
        const responses = await Promise.all(requests);
        data = responses.flatMap((res) => res.data);
      } else {
        // Fetch single status for other tabs
        const res = await api.get(
          `/appointment/by-status?status=${statuses[0]}`
        );
        data = res.data;
      }

      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAppointments(data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch hẹn:", err.response?.data || err.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;

    try {
      await api.delete(`/appointment/${appointmentId}/cancel`);
      message.success("Hủy lịch hẹn thành công");

      // Làm mới lại danh sách sau khi hủy
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (err) {
      console.error("Lỗi khi hủy lịch hẹn:", err.response?.data || err.message);

      // Handle specific error cases
      if (err.response?.status === 500) {
        message.error(
          "Lỗi hệ thống: Không thể hủy lịch hẹn này. Vui lòng liên hệ hỗ trợ."
        );
      } else if (err.response?.status === 404) {
        message.error("Lịch hẹn không tồn tại hoặc đã được hủy.");
        // Remove from UI if appointment doesn't exist
        setAppointments((prev) =>
          prev.filter((apt) => apt.id !== appointmentId)
        );
      } else if (err.response?.status === 400) {
        message.error(
          "Không thể hủy lịch hẹn này. Lịch hẹn có thể đã được xác nhận hoặc đã diễn ra."
        );
      } else {
        message.error("Không thể hủy lịch hẹn. Vui lòng thử lại sau.");
      }
    }
  };

  // Handle xem chi tiết lịch hẹn
  const handleViewDetail = (appointment) => {
    console.log("📋 Viewing appointment detail:", appointment);
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  // Handle đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedAppointment(null);
  };

  // Handle VNPay payment result from URL params - only run once per URL change
  useEffect(() => {
    const query = new URLSearchParams(search);
    const vnpResponseCode = query.get("vnp_ResponseCode");
    const vnpTransactionStatus = query.get("vnp_TransactionStatus");
    const vnpTxnRef = query.get("vnp_TxnRef");

    // Check for VNPay return parameters
    if (vnpResponseCode && !paymentMessageShown.current) {
      console.log(" VNPay Return in Booking page:", {
        vnpResponseCode,
        vnpTransactionStatus,
        vnpTxnRef,
        fullURL: search,
      });

      localStorage.removeItem("pendingBooking");
      paymentMessageShown.current = true; // Mark message as shown

      if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
        // Thanh toán VNPay thành công
        message.success("Thanh toán thành công! Lịch hẹn đã được xác nhận.");

        // Gọi API để verify payment với backend
        verifyVNPayPayment(query);
      } else {
        // Thanh toán VNPay thất bại
        message.error("Thanh toán thất bại hoặc đã bị hủy.");
      }

      // Clean URL sau khi xử lý
      window.history.replaceState({}, document.title, "/user/booking");

      // Refresh appointments after a short delay to ensure payment is processed
      const refreshAppointments = () => {
        if (token) {
          fetchAppointments();
        }
      };
      setTimeout(refreshAppointments, 500);
      return;
    }

    // Handle legacy MoMo result (nếu có)
    const resultCode = query.get("resultCode");
    if (resultCode && !paymentMessageShown.current) {
      localStorage.removeItem("pendingBooking");
      paymentMessageShown.current = true; // Mark message as shown

      if (resultCode === "1000") {
        message.success("Thanh toán thành công!");
      } else {
        message.warning("Thanh toán thất bại hoặc đã bị hủy.");
      }

      // Clean URL và refresh
      window.history.replaceState({}, document.title, "/user/booking");
      setTimeout(() => {
        fetchAppointments();
      }, 500);
    }
  }, [search, verifyVNPayPayment, fetchAppointments, token]);
  const renderAppointments = () => {
    if (loading) {
      return (
        <div className="booking-loading-profile">Đang tải lịch hẹn...</div>
      );
    }

    if (!appointments?.length) {
      const currentTab = TABS.find((t) => t.key === activeTab);

      return (
        <div className="booking-empty-profile">
          <h3>Không có {currentTab?.label.toLowerCase()}</h3>
          <p>Đừng lo lắng. Bạn có thể đặt lịch khi cần</p>
          <button onClick={() => navigate("/services")}>
            Đăng kí khám bệnh
          </button>
        </div>
      );
    }

    return appointments.map((appointment) => (
      <div className="booking-card-profile" key={appointment.id}>
        <h2>Thông tin lịch hẹn</h2>
        <div className="booking-info-profile">
          <p>
            <strong>Ngày hẹn:</strong> {appointment.preferredDate}
          </p>
          <p>
            <strong>Dịch vụ:</strong> {appointment.serviceName}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`status ${appointment.status.toLowerCase()}`}>
              {appointment.status}
            </span>
          </p>
          <p>
            <strong>Ghi chú:</strong> {appointment.note || "Không có"}
          </p>
          <p>
            <strong>Giá:</strong> {appointment.price?.toLocaleString()} VND
          </p>
          <p>
            <strong>Thời gian tạo:</strong>{" "}
            {new Date(appointment.created_at).toLocaleString()}
          </p>
          <div className="appointment-actions">
            {/* Nút xem chi tiết - luôn hiển thị */}
            <button
              className="detail-button-profile"
              onClick={() => handleViewDetail(appointment)}
            >
              Xem chi tiết
            </button>

            {["CONFIRMED", "PENDING", "CHEKED"].includes(
              appointment.status
            ) && (
              <button
                className="cancel-button-profile"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Hủy lịch hẹn
              </button>
            )}

            {/* Zoom consultation button for CONSULTING_ON services with CONFIRMED status */}
            {(() => {
              // Debug log to check appointment structure
              console.log(" Appointment debug:", {
                id: appointment.id,
                serviceType: appointment.serviceType,
                type: appointment.type,
                serviceName: appointment.serviceName,
                status: appointment.status,
              });

              // Check for CONSULTING_ON service type and CONFIRMED status
              const isConsultingOnline =
                appointment.serviceType === "CONSULTING_ON" ||
                appointment.type === "CONSULTING_ON" ||
                appointment.serviceName
                  ?.toLowerCase()
                  .includes("tư vấn online");
              const isConfirmed = appointment.status === "CONFIRMED";

              return isConsultingOnline && isConfirmed;
            })() && (
              <button
                className={`zoom-button-profile ${
                  blinkingButtons[appointment.id] ? "blinking" : ""
                }`}
                onClick={() => joinZoomMeeting(appointment)}
                title={
                  zoomUrls[appointment.id]
                    ? "Click để tham gia ngay"
                    : "Click để kết nối phòng tư vấn"
                }
              >
                {zoomUrls[appointment.id] ? "Tham gia ngay" : "Tư vấn Online"}
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };
  const renderTabContent = () => renderAppointments();

  return (
    <div className="booking-tab-wrapper-profile">
      <h2 className="booking-title-profile">Lịch sử đặt chỗ</h2>

      <div className="booking-tabs-profile">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button-profile ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="booking-tab-content-profile">{renderTabContent()}</div>

      {/* Modal chi tiết lịch hẹn */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={detailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <button
            key="close"
            className="modal-close-button"
            onClick={handleCloseDetailModal}
          >
            Đóng
          </button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedAppointment && (
          <div className="appointment-detail-content">
            <h3>📋 Thông tin đầy đủ từ API Response</h3>

            {/* Hiển thị tất cả dữ liệu dưới dạng JSON formatted */}
            <div className="json-display">
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  overflow: "auto",
                  maxHeight: "500px",
                  border: "1px solid #ddd",
                }}
              >
                {JSON.stringify(selectedAppointment, null, 2)}
              </pre>
            </div>

            {/* Hiển thị thông tin quan trọng dễ đọc */}
            <div className="appointment-summary" style={{ marginTop: "20px" }}>
              <h4>📝 Thông tin tóm tắt:</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>ID:</strong> {selectedAppointment.id}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {selectedAppointment.status}
                </div>
                <div>
                  <strong>Dịch vụ:</strong> {selectedAppointment.serviceName}
                </div>
                <div>
                  <strong>Ngày hẹn:</strong> {selectedAppointment.preferredDate}
                </div>
                <div>
                  <strong>Giá:</strong>{" "}
                  {selectedAppointment.price?.toLocaleString()} VND
                </div>
                <div>
                  <strong>Loại dịch vụ:</strong>{" "}
                  {selectedAppointment.serviceType ||
                    selectedAppointment.type ||
                    "N/A"}
                </div>
                <div>
                  <strong>Ghi chú:</strong>{" "}
                  {selectedAppointment.note || "Không có"}
                </div>
                <div>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(selectedAppointment.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
