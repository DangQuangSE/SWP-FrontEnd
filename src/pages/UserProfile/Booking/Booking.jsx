// Fixed version of Booking.jsx with proper structure
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Modal } from "antd";
import api from "../../../configs/api";
import RatingModal from "../../../components/RatingModal/RatingModal";
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

  // Thêm state cho modal đánh giá
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [appointmentToRate, setAppointmentToRate] = useState(null);

  // Thêm hàm xử lý hiển thị modal đánh giá
  const handleRateService = (appointment) => {
    setAppointmentToRate(appointment);
    setRatingModalVisible(true);
  };

  // Thêm hàm callback khi đánh giá thành công
  const handleRatingSuccess = async () => {
    // Refresh appointment data
    await fetchAppointments();

    // Cập nhật trạng thái isRated cho appointmentToRate trong state
    if (appointmentToRate && !appointmentToRate.isRated) {
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt.id === appointmentToRate.id ? { ...apt, isRated: true } : apt
        )
      );
    }

    message.success("Cảm ơn bạn đã đánh giá!");
    setRatingModalVisible(false);
  };

  // Function to verify VNPay payment with backend
  const verifyVNPayPayment = useCallback(async (urlParams) => {
    try {
      console.log(" Verifying VNPay payment with backend...");
      const response = await api.get("/payment/vnpay/vnpay-return", {
        params: Object.fromEntries(urlParams.entries()),
      });
      console.log(" VNPay verification response:", response.data);
    } catch (error) {
      console.error(" Error verifying VNPay payment:", error);
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

  // Function to create Zoom meeting for specific appointmentId
  const createZoomMeeting = useCallback(
    async (appointmentId) => {
      try {
        console.log(" Creating Zoom meeting for appointmentId:", appointmentId);

        const zoomResponse = await api.get(
          `/zoom/test-create-meeting?appointmentId=${appointmentId}`
        );

        console.log(" Zoom meeting created successfully:", zoomResponse.data);
        message.success("Phòng tư vấn online đã được tạo!");

        // Refresh appointments để lấy joinUrl mới
        setTimeout(() => {
          fetchAppointments();
        }, 1000);
      } catch (error) {
        console.error(" Error creating Zoom meeting:", error);
      }
    },
    [fetchAppointments]
  );

  const handleCancelAppointment = async (appointmentId) => {
    // Tìm appointment để lấy thông tin thời gian
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    if (
      appointment &&
      appointment.appointmentDetails &&
      appointment.appointmentDetails.length > 0
    ) {
      const slotTime = appointment.appointmentDetails[0].slotTime;

      if (slotTime) {
        const appointmentTime = new Date(slotTime);
        const currentTime = new Date();
        const timeDifference =
          appointmentTime.getTime() - currentTime.getTime();
        const hoursUntilAppointment = timeDifference / (1000 * 60 * 60); // Convert to hours

        // Kiểm tra nếu còn ít hơn 24 giờ
        if (hoursUntilAppointment < 24 && hoursUntilAppointment > 0) {
          message.error(
            "Không thể hủy lịch hẹn trong vòng 24 giờ trước cuộc hẹn. Vui lòng liên hệ trực tiếp để được hỗ trợ."
          );
          return;
        }

        // Kiểm tra nếu cuộc hẹn đã qua
        if (hoursUntilAppointment <= 0) {
          message.error("Không thể hủy lịch hẹn đã diễn ra.");
          return;
        }
      }
    }

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
    console.log(" useEffect for VNPay return is running...");
    console.log(" Current search params:", search);

    const query = new URLSearchParams(search);
    const vnpResponseCode = query.get("vnp_ResponseCode");
    const vnpTransactionStatus = query.get("vnp_TransactionStatus");
    const vnpTxnRef = query.get("vnp_TxnRef");

    console.log(" Extracted parameters:", {
      vnpResponseCode,
      vnpTransactionStatus,
      vnpTxnRef,
      paymentMessageShown: paymentMessageShown.current,
    });

    // Check for VNPay return parameters
    if (vnpResponseCode && !paymentMessageShown.current) {
      console.log(" VNPay Return detected in Booking page!");
      console.log(" VNPay Return parameters:", {
        vnpResponseCode,
        vnpTransactionStatus,
        vnpTxnRef,
        fullURL: search,
      });

      localStorage.removeItem("pendingBooking");
      paymentMessageShown.current = true;

      if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
        // Thanh toán VNPay thành công
        message.success("Thanh toán thành công! Lịch hẹn đã được xác nhận.");

        // Gọi API để verify payment với backend
        verifyVNPayPayment(query);

        // Tạo Zoom meeting cho appointment vừa thanh toán
        console.log("🎯 Payment successful! Creating Zoom meeting...");

        // Delay một chút để backend cập nhật status, sau đó lấy appointments CONFIRMED
        setTimeout(async () => {
          try {
            const response = await api.get(
              "/appointment/by-status?status=CONFIRMED"
            );
            const confirmedAppointments = response.data;

            console.log(
              "📋 Found CONFIRMED appointments:",
              confirmedAppointments.length
            );

            // Tạo Zoom meeting cho appointment mới nhất (vừa được confirm)
            if (confirmedAppointments.length > 0) {
              const latestAppointment =
                confirmedAppointments[confirmedAppointments.length - 1];
              const appointmentId = latestAppointment.id;

              console.log(
                "🆔 Creating Zoom for latest appointmentId:",
                appointmentId
              );
              createZoomMeeting(appointmentId);
            }
          } catch (error) {
            console.error(" Error fetching confirmed appointments:", error);
          }
        }, 2000); // Delay 2 giây để backend cập nhật
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
  }, [search, verifyVNPayPayment, fetchAppointments, token, createZoomMeeting]);

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

            {/* Nút Tư vấn Online cho CONSULTING_ON services với CONFIRMED status */}
            {appointment.serviceType === "CONSULTING_ON" &&
              appointment.status === "CONFIRMED" &&
              (() => {
                // Lấy joinUrl từ appointmentDetails
                const joinUrl = appointment.appointmentDetails?.find(
                  (detail) => detail.joinUrl
                )?.joinUrl;

                if (joinUrl) {
                  return (
                    <a
                      href={joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="online-consultation-button-profile"
                      title="Click để tham gia tư vấn online"
                    >
                      Tư vấn Online
                    </a>
                  );
                }
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
                                className="zoom-link"
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
          </div>
        )}
      </Modal>

      {/* Thêm modal đánh giá */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        appointment={appointmentToRate}
        onSuccess={handleRatingSuccess}
      />
    </div>
  );
};

export default Booking;
