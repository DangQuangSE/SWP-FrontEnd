// Fixed version of Booking.jsx with proper structure
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

// Status display mapping (Vietnamese)
const STATUS_DISPLAY = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  CHECKED: "Đã check in",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

const Booking = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [modalVisible, setModalVisible] = useState(false);
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
      console.log("🔍 Verifying VNPay payment with backend...");
      const response = await api.get("/payment/vnpay/vnpay-return", {
        params: Object.fromEntries(urlParams.entries()),
      });
      console.log("✅ VNPay verification response:", response.data);
    } catch (error) {
      console.error("❌ Error verifying VNPay payment:", error);
      message.error("Có lỗi khi xác thực thanh toán với server.");
    }
  }, []);

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
        const requests = statuses.map((status) =>
          api.get(`/appointment/by-status?status=${status}`)
        );
        const responses = await Promise.all(requests);
        data = responses.flatMap((res) => res.data);
      } else {
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

  // Function to create Zoom meeting after payment success (chỉ tạo link, không mở)
  const createZoomMeetingIfNeeded = useCallback(
    async (appointmentId) => {
      try {
        console.log(
          "🔍 Checking if need to create Zoom meeting for appointment:",
          appointmentId
        );

        // Lấy thông tin appointment để kiểm tra service type
        const appointmentResponse = await api.get(
          `/appointment/${appointmentId}`
        );
        const appointment = appointmentResponse.data;

        console.log("📋 Appointment details:", appointment);

        // Kiểm tra nếu là dịch vụ CONSULTING_ON - kiểm tra cả 2 level
        const hasConsultingOnService =
          appointment.serviceType === "CONSULTING_ON" ||
          (appointment.appointmentDetails &&
            appointment.appointmentDetails.length > 0 &&
            appointment.appointmentDetails.some(
              (detail) => detail.serviceType === "CONSULTING_ON"
            ));

        if (hasConsultingOnService) {
          console.log("🎥 Creating Zoom meeting for CONSULTING_ON service...");

          // Bước 1: Gọi API Zoom để tạo meeting link
          const zoomResponse = await api.get(
            `/zoom/test-create-meeting?appointmentId=${appointmentId}`
          );
          console.log(
            "📹 Zoom meeting created successfully:",
            zoomResponse.data
          );

          // Bước 2: Refresh appointments để lấy join_url mới từ appointmentDetails
          console.log("🔄 Refreshing appointments to get join_url...");
          setTimeout(() => {
            fetchAppointments();
          }, 1000);

          message.success(
            "Phòng tư vấn online đã sẵn sàng! Bạn có thể tham gia bất cứ lúc nào."
          );
        } else {
          console.log(
            " Service is not CONSULTING_ON, skipping Zoom meeting creation"
          );
        }
      } catch (error) {
        console.error("❌ Error creating Zoom meeting:", error);
        // Không hiển thị error message để không làm phiền user
      }
    },
    [fetchAppointments]
  );

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

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Handle VNPay payment result from URL params
  useEffect(() => {
    const query = new URLSearchParams(search);
    const vnpResponseCode = query.get("vnp_ResponseCode");
    const vnpTransactionStatus = query.get("vnp_TransactionStatus");
    const vnpTxnRef = query.get("vnp_TxnRef");

    // Check for VNPay return parameters
    if (vnpResponseCode && !paymentMessageShown.current) {
      console.log("🔍 VNPay Return in Booking page:", {
        vnpResponseCode,
        vnpTransactionStatus,
        vnpTxnRef,
        fullURL: search,
      });

      // Lấy appointmentId từ localStorage TRƯỚC KHI xóa
      const pendingBooking = JSON.parse(
        localStorage.getItem("pendingBooking") || "{}"
      );
      const appointmentId = pendingBooking.appointmentId;

      localStorage.removeItem("pendingBooking");
      paymentMessageShown.current = true;

      if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
        // Thanh toán VNPay thành công
        message.success("Thanh toán thành công! Lịch hẹn đã được xác nhận.");

        // Gọi API để verify payment với backend
        verifyVNPayPayment(query);

        // Tạo Zoom meeting nếu là dịch vụ CONSULTING_ON
        if (appointmentId) {
          console.log(
            "🎯 Creating Zoom meeting for appointmentId:",
            appointmentId
          );
          createZoomMeetingIfNeeded(appointmentId);
        } else {
          console.warn("⚠️ No appointmentId found for Zoom meeting creation");
        }
      } else if (vnpResponseCode === "24") {
        // Người dùng hủy thanh toán - cancel cuộc hẹn
        message.warning("Thanh toán đã bị hủy. Đang hủy lịch hẹn...");
        // Handle cancellation logic here...
      } else {
        // Thanh toán VNPay thất bại
        message.error("Thanh toán thất bại hoặc đã bị hủy.");
      }

      // Clean URL sau khi xử lý
      window.history.replaceState({}, document.title, "/user/booking");

      // Refresh appointments after a short delay
      const refreshAppointments = () => {
        if (token) {
          fetchAppointments();
        }
      };
      setTimeout(refreshAppointments, 500);
      return;
    }
  }, [
    search,
    verifyVNPayPayment,
    fetchAppointments,
    token,
    createZoomMeetingIfNeeded,
  ]);

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
            <strong>Phòng khám:</strong>{" "}
            {appointment.appointmentDetails?.[0]?.room?.name || "Không có"}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`status ${appointment.status.toLowerCase()}`}>
              {STATUS_DISPLAY[appointment.status] || appointment.status}
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
            <button
              className="detail-button-profile"
              onClick={() => handleViewDetail(appointment)}
            >
              Xem chi tiết
            </button>

            {["CONFIRMED", "PENDING", "CHECKED"].includes(
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
              // Check for CONSULTING_ON service type
              const isConsultingOnline =
                appointment.serviceType === "CONSULTING_ON" ||
                appointment.appointmentDetails?.some((detail) => {
                  return detail.serviceType === "CONSULTING_ON";
                }) ||
                false;

              const isConfirmed = appointment.status === "CONFIRMED";

              if (isConsultingOnline && isConfirmed) {
                // Lấy joinUrl từ appointmentDetails
                const joinUrl = appointment.appointmentDetails?.find(
                  (detail) => detail.joinUrl
                )?.joinUrl;

                console.log("🔍 DEBUG - joinUrl === null:", joinUrl === null);

                // Thử tìm joinUrl với các tên khác có thể có
                const detail = appointment.appointmentDetails?.find(
                  (detail) => detail.serviceType === "CONSULTING_ON"
                );
                if (detail) {
                  console.log("🔍 DEBUG - Found CONSULTING_ON detail:", detail);
                  console.log(
                    "🔍 DEBUG - All keys in detail:",
                    Object.keys(detail)
                  );
                  console.log("🔍 DEBUG - detail.joinUrl:", detail.joinUrl);
                  console.log("🔍 DEBUG - detail.join_url:", detail.join_url);
                  console.log("🔍 DEBUG - detail.zoomUrl:", detail.zoomUrl);
                  console.log(
                    "🔍 DEBUG - detail.meetingUrl:",
                    detail.meetingUrl
                  );
                } else {
                  console.log("🔍 DEBUG - No CONSULTING_ON detail found");
                }

                return (
                  <a
                    href={joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zoom-button-profile"
                    title="Click để tham gia tư vấn online"
                  >
                    Tư vấn Online
                  </a>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    ));
  };

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

      <div className="booking-tab-content-profile">{renderAppointments()}</div>

      {/* Modal hiển thị chi tiết lịch hẹn */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className="appointment-detail-modal"
      >
        {selectedAppointment && (
          <div className="appointment-detail-content">
            <div className="detail-section">
              <h3>Thông tin chung</h3>
              {/* <div className="detail-item">
                <span className="detail-label">ID lịch hẹn:</span>
                <span className="detail-value">{selectedAppointment.id}</span>
              </div> */}
              <div className="detail-item">
                <span className="detail-label">Ngày hẹn:</span>
                <span className="detail-value">
                  {selectedAppointment.preferredDate}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dịch vụ:</span>
                <span className="detail-value">
                  {selectedAppointment.serviceName}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phòng khám:</span>
                <span className="detail-value">
                  {selectedAppointment.appointmentDetails?.[0]?.room?.name ||
                    "Chưa phân công"}
                </span>
              </div>
              {/* <div className="detail-item">
                <span className="detail-label">Loại dịch vụ:</span>
                <span className="detail-value">
                  {selectedAppointment.serviceType}
                </span>
              </div> */}
              <div className="detail-item">
                <span className="detail-label">Trạng thái:</span>
                <span
                  className={`detail-value status ${selectedAppointment.status.toLowerCase()}`}
                >
                  {STATUS_DISPLAY[selectedAppointment.status] ||
                    selectedAppointment.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Giá:</span>
                <span className="detail-value">
                  {selectedAppointment.price?.toLocaleString()} VND
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ghi chú:</span>
                <span className="detail-value">
                  {selectedAppointment.note || "Không có"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Thời gian tạo:</span>
                <span className="detail-value">
                  {new Date(selectedAppointment.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {selectedAppointment.appointmentDetails &&
              selectedAppointment.appointmentDetails.length > 0 && (
                <div className="detail-section">
                  <h3>Chi tiết dịch vụ</h3>
                  {selectedAppointment.appointmentDetails.map(
                    (detail, index) => (
                      <div
                        key={detail.id || index}
                        className="service-detail-item"
                      >
                        {/* <div className="detail-item">
                          <span className="detail-label">Tên dịch vụ:</span>
                          <span className="detail-value">
                            {detail.serviceName}
                          </span>
                        </div> */}
                        <div className="detail-item">
                          <span className="detail-label">Bác sĩ tư vấn:</span>
                          <span className="detail-value">
                            {detail.consultantName || "Chưa phân công"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Thời gian khám:</span>
                          <span className="detail-value">
                            {detail.slotTime
                              ? new Date(detail.slotTime).toLocaleString()
                              : "Chưa xác định"}
                          </span>
                        </div>
                        {detail.room && (
                          <>
                            <div className="detail-item">
                              <span className="detail-label">Phòng khám:</span>
                              <span className="detail-value">
                                {detail.room.name}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Chuyên khoa:</span>
                              <span className="detail-value">
                                {detail.room.specializationName}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">
                            Trạng thái dịch vụ:
                          </span>
                          <span
                            className={`detail-value status ${detail.status?.toLowerCase()}`}
                          >
                            {STATUS_DISPLAY[detail.status] || detail.status}
                          </span>
                        </div>
                        {detail.joinUrl && (
                          <div className="detail-item">
                            <span className="detail-label">
                              Link tư vấn online:
                            </span>
                            <span className="detail-value">
                              <a
                                href={detail.joinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Tham gia phòng tư vấn
                              </a>
                            </span>
                          </div>
                        )}
                        {detail.medicalResult && (
                          <div className="detail-item">
                            <span className="detail-label">Kết quả khám:</span>
                            <span className="detail-value">
                              {detail.medicalResult}
                            </span>
                          </div>
                        )}
                        {index <
                          selectedAppointment.appointmentDetails.length - 1 && (
                          <hr className="service-separator" />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* <div className="detail-section">
              <h3>Thông tin thanh toán</h3>
              <div className="detail-item">
                <span className="detail-label">Trạng thái thanh toán:</span>
                <span className="detail-value">
                  {selectedAppointment.isPaid
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
              {selectedAppointment.paymentStatus && (
                <div className="detail-item">
                  <span className="detail-label">Chi tiết thanh toán:</span>
                  <span className="detail-value">
                    {selectedAppointment.paymentStatus}
                  </span>
                </div>
              )}
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
