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
  const [blinkingButtons, setBlinkingButtons] = useState({}); // Track which buttons are blinking
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

  // Function to create Zoom meeting and open URL
  const createAndOpenZoomMeeting = useCallback(
    async (appointmentId) => {
      try {
        console.log("🔍 Creating Zoom meeting for appointment:", appointmentId);

        if (!appointmentId) {
          console.error("❌ appointmentId is missing");
          message.error("Lỗi: Không tìm thấy ID lịch hẹn!");
          return;
        }

        message.loading("Đang tạo phòng tư vấn...", 0.5);

        const response = await api.get(
          `/api/zoom/test-create-meeting?appointmentId=${appointmentId}`
        );
        const meetingData = response.data;

        message.destroy();
        console.log("📹 Zoom meeting created:", meetingData);

        if (meetingData.join_url) {
          console.log("✅ Opening join_url:", meetingData.join_url);
          window.open(meetingData.join_url, "_blank");
          message.success("Đã mở phòng tư vấn online!", 1);

          // Start blinking animation
          setBlinkingButtons((prev) => ({
            ...prev,
            [appointmentId]: true,
          }));

          // Stop blinking after 3 seconds
          setTimeout(() => {
            setBlinkingButtons((prev) => ({
              ...prev,
              [appointmentId]: false,
            }));
          }, 3000);

          // Refresh appointments để lấy join_url mới vào appointmentDetails
          setTimeout(() => {
            fetchAppointments();
          }, 1000);
        } else {
          console.warn("⚠️ No join_url in response:", meetingData);
          message.error("Không thể tạo phòng tư vấn. Vui lòng thử lại!");
        }
      } catch (error) {
        message.destroy();
        console.error("❌ Error creating Zoom meeting:", error);
        console.error(
          "❌ Error details:",
          error.response?.data || error.message
        );
        message.error("Không thể kết nối phòng tư vấn. Vui lòng thử lại!");
      }
    },
    [fetchAppointments]
  );

  // Function to create Zoom meeting if service type is CONSULTING_ON (after payment)
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
          appointment.serviceType === "CONSULTING_ON" || // Level cao
          (appointment.appointmentDetails &&
            appointment.appointmentDetails.length > 0 &&
            appointment.appointmentDetails.some(
              (detail) => detail.serviceType === "CONSULTING_ON"
            ));

        if (hasConsultingOnService) {
          console.log("🎥 Creating Zoom meeting for CONSULTING_ON service...");

          // Gọi API tạo Zoom meeting (chỉ tạo, không mở)
          const zoomResponse = await api.get(
            `/api/zoom/test-create-meeting?appointmentId=${appointmentId}`
          );
          console.log(
            "📹 Zoom meeting created successfully:",
            zoomResponse.data
          );

          // Refresh appointments để lấy join_url mới từ appointmentDetails
          console.log("🔄 Refreshing appointments to get join_url...");
          setTimeout(() => {
            fetchAppointments();
          }, 1000);

          message.success("Đã tạo phòng tư vấn online!");
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

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
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

      // Lấy appointmentId từ localStorage TRƯỚC KHI xóa
      const pendingBooking = JSON.parse(
        localStorage.getItem("pendingBooking") || "{}"
      );
      const appointmentId = pendingBooking.appointmentId;

      localStorage.removeItem("pendingBooking");
      paymentMessageShown.current = true; // Mark message as shown

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

        console.log(" Debug info:", {
          appointmentId,
          vnpTxnRef,
          pendingBooking,
        });

        // Tạo async function để handle cancel
        const cancelAppointmentDueToPayment = async () => {
          try {
            let targetAppointmentId = appointmentId;

            // Nếu không có appointmentId từ localStorage, thử lấy từ backend
            if (!targetAppointmentId) {
              console.log(
                " No appointmentId in localStorage, trying to find by vnpTxnRef:",
                vnpTxnRef
              );

              // Gọi API để tìm appointment bằng vnpTxnRef
              try {
                const response = await api.get(
                  `/appointment/by-transaction/${vnpTxnRef}`
                );
                targetAppointmentId =
                  response.data.appointmentId || response.data.id;
                console.log(
                  " Found appointmentId from backend:",
                  targetAppointmentId
                );
              } catch (findError) {
                console.error(
                  "Error finding appointment by transaction:",
                  findError
                );

                // Fallback: Lấy appointments gần đây và tìm appointment PENDING
                try {
                  const recentResponse = await api.get(
                    "/appointment/by-status?status=PENDING"
                  );
                  const recentAppointments = recentResponse.data;

                  // Lấy appointment PENDING mới nhất (có thể là appointment vừa tạo)
                  if (recentAppointments && recentAppointments.length > 0) {
                    const latestPending = recentAppointments.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )[0];
                    targetAppointmentId = latestPending.id;
                    console.log(
                      " Using latest PENDING appointment:",
                      targetAppointmentId
                    );
                  }
                } catch (fallbackError) {
                  console.error("Fallback method also failed:", fallbackError);
                }
              }
            }

            if (targetAppointmentId) {
              await api.delete(`/appointment/${targetAppointmentId}/cancel`);
              message.success("Lịch hẹn đã được hủy do thanh toán bị hủy.");
            } else {
              console.error("No appointmentId found to cancel");
              message.error(
                "Không tìm thấy lịch hẹn để hủy. Vui lòng kiểm tra lại trong danh sách lịch hẹn."
              );
            }
          } catch (error) {
            console.error("Error canceling appointment:", error);
            message.error(
              "Không thể hủy lịch hẹn tự động. Vui lòng hủy thủ công trong danh sách lịch hẹn."
            );
          }
        };

        // Gọi function cancel
        cancelAppointmentDueToPayment();
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
              // Debug log to check appointment structure
              console.log("🔍 [DEBUG] Appointment structure:", {
                id: appointment.id,
                serviceType: appointment.serviceType,
                type: appointment.type,
                serviceName: appointment.serviceName,
                status: appointment.status,
                appointmentDetails: appointment.appointmentDetails,
              });

              // Check for CONSULTING_ON service type - kiểm tra cả 2 level
              const isConsultingOnline =
                appointment.serviceType === "CONSULTING_ON" || // Level cao
                appointment.appointmentDetails?.some((detail) => {
                  console.log("🔍 [DEBUG] Checking detail:", detail);
                  console.log(
                    "🔍 [DEBUG] Detail serviceType:",
                    detail.serviceType
                  );
                  return detail.serviceType === "CONSULTING_ON";
                }) ||
                false;

              const isConfirmed = appointment.status === "CONFIRMED";

              // Lấy join_url từ appointmentDetails
              const joinUrl = appointment.appointmentDetails?.find(
                (detail) => detail.serviceType === "CONSULTING_ON"
              )?.joinUrl;

              console.log("🎯 [DEBUG] isConsultingOnline:", isConsultingOnline);
              console.log("🎯 [DEBUG] isConfirmed:", isConfirmed);
              console.log(
                "🎯 [DEBUG] joinUrl from appointmentDetails:",
                joinUrl
              );
              console.log(
                "🎯 [DEBUG] Final result:",
                isConsultingOnline && isConfirmed
              );

              return isConsultingOnline && isConfirmed;
            })() &&
              (() => {
                // Lấy join_url từ appointmentDetails cho button
                const joinUrl = appointment.appointmentDetails?.find(
                  (detail) => detail.serviceType === "CONSULTING_ON"
                )?.joinUrl;

                return (
                  <button
                    className={`zoom-button-profile ${
                      blinkingButtons[appointment.id] ? "blinking" : ""
                    }`}
                    onClick={() => {
                      if (joinUrl) {
                        // Nếu có join_url từ appointmentDetails, mở trực tiếp
                        console.log(
                          "🎯 Opening join_url from appointmentDetails:",
                          joinUrl
                        );
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
                        // Fallback: tạo meeting mới
                        console.log(
                          "🔄 No join_url found, creating new meeting"
                        );
                        createAndOpenZoomMeeting(appointment.id);
                      }
                    }}
                    title={
                      joinUrl
                        ? "Click để tham gia ngay"
                        : "Click để kết nối phòng tư vấn"
                    }
                  >
                    {joinUrl ? "Tham gia ngay" : "Tư vấn Online"}
                  </button>
                );
              })()}
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
            {(() => {
              const detail = selectedAppointment.appointmentDetails?.[0];
              return (
                <div className="detail-sections">
                  {/* Thông tin chính */}
                  <div className="detail-section">
                    <h3 className="section-title">Thông tin lịch hẹn</h3>

                    <div className="detail-item">
                      <span className="detail-label">Khách hàng:</span>
                      <span className="detail-value">
                        {selectedAppointment.customerName || "Không có tên"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dịch vụ:</span>
                      <span className="detail-value">
                        {selectedAppointment.serviceName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bác sĩ phụ trách:</span>
                      <span className="detail-value">
                        {detail?.consultantName || "Chưa phân công"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phòng khám:</span>
                      <span className="detail-value">
                        {detail?.room?.name || "Không có"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Chuyên khoa:</span>
                      <span className="detail-value">
                        {detail?.room?.specializationName || "Không có"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ngày hẹn:</span>
                      <span className="detail-value">
                        {selectedAppointment.preferredDate || "Không có"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Thời gian hẹn:</span>
                      <span className="detail-value">
                        {detail?.slotTime
                          ? new Date(detail.slotTime).toLocaleString("vi-VN")
                          : "Không có"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Trạng thái:</span>
                      <span
                        className={`detail-value status-${selectedAppointment.status?.toLowerCase()}`}
                      >
                        {STATUS_DISPLAY[selectedAppointment.status] ||
                          selectedAppointment.status ||
                          "Không xác định"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Giá:</span>
                      <span className="detail-value price">
                        {selectedAppointment.price
                          ? selectedAppointment.price.toLocaleString() + " VND"
                          : "Không có"}
                      </span>
                    </div>
                  </div>

                  {detail && (
                    <div className="detail-section">
                      <h3 className="section-title">Thông tin chi tiết</h3>
                      {/* <div className="detail-item">
                        <span className="detail-label">ID Chi tiết:</span>
                        <span className="detail-value">{detail.id}</span>
                      </div> */}
                      <div className="detail-item">
                        <span className="detail-label">Link tham gia:</span>
                        <span className="detail-value">
                          {detail.joinUrl || "Chưa có"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Kết quả khám:</span>
                        <span className="detail-value">
                          {detail.medicalResult || "Chưa có"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
