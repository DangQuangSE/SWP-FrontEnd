// pages/UserProfile/Booking.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Modal, Alert, Button } from "antd";
import api from "../../../configs/api";
import "./Booking.css";
import RatingModal from '../../../components/RatingModal';
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
  const [zoomUrls, setZoomUrls] = useState({}); // Cache Zoom URLs by appointment ID
  const [blinkingButtons, setBlinkingButtons] = useState({}); // Track which buttons are blinking
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [appointmentToRate, setAppointmentToRate] = useState(null);
  const [previousRating, setPreviousRating] = useState(null);

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

  // Function to create Zoom meeting if service type is CONSULTING_ON
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

        // Kiểm tra nếu là dịch vụ CONSULTING_ON
        if (
          appointment.appointmentDetails &&
          appointment.appointmentDetails.length > 0
        ) {
          const hasConsultingOnService = appointment.appointmentDetails.some(
            (detail) => detail.serviceType === "CONSULTING_ON"
          );

          if (hasConsultingOnService) {
            console.log(
              "🎥 Creating Zoom meeting for CONSULTING_ON service..."
            );

            // Gọi API tạo Zoom meeting
            const zoomResponse = await api.get(
              `/zoom/test-create-meeting?appointmentId=${appointmentId}`
            );
            console.log("📹 Zoom meeting created:", zoomResponse.data);

            // Refresh appointments để lấy join_url mới
            setTimeout(() => {
              fetchAppointments();
            }, 1000);

            message.success("Đã tạo phòng tư vấn online!");
          }
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
          createZoomMeetingIfNeeded(appointmentId);
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

  // Thêm useEffect để kiểm tra các cuộc hẹn cần đánh giá khi component mount
  useEffect(() => {
    const checkForPendingRatings = () => {
      // Lọc các cuộc hẹn đã hoàn thành nhưng chưa được đánh giá
      const needRatingAppointments = appointments.filter(
        app => app.status === "COMPLETED" && !app.isRated
      );

      if (needRatingAppointments.length > 0 && activeTab === "completed") {
        // Hiển thị banner thông báo
        message.info("Bạn có cuộc hẹn cần đánh giá. Hãy đánh giá để giúp chúng tôi cải thiện dịch vụ!", 5);
      }
    };

    if (appointments.length > 0) {
      checkForPendingRatings();
    }
  }, [appointments, activeTab]);

  // Thêm hàm để kiểm tra xem một cuộc hẹn có thể đánh giá không
  const canRateAppointment = (appointment) => {
    return appointment.status === "COMPLETED" && !appointment.isRated;
  };

  // Thêm hàm xử lý đánh giá
  const handleSubmitRating = async (values) => {
    try {
      message.loading({ content: "Đang gửi đánh giá...", key: "submitRating" });

      if (appointmentToRate.isRated && previousRating) {
        // Cập nhật đánh giá cũ

        // 1. Cập nhật đánh giá dịch vụ
        const serviceFeedbackRequest = {
          rating: values.serviceRating,
          comment: values.serviceComment || ""
        };

        await api.put(`/feedback/${previousRating.serviceFeedback.id}`, serviceFeedbackRequest);

        // 2. Cập nhật đánh giá bác sĩ
        const consultantFeedbackRequest = {
          rating: values.consultantRating,
          consultantId: appointmentToRate.doctorId, // Sử dụng doctorId từ appointment nếu có
          comment: values.consultantComment || ""
        };

        console.log("Consultant feedback request:", consultantFeedbackRequest);


        if (previousRating.consultantFeedback && previousRating.consultantFeedback.id) {
          await api.put(`/consultant-feedbacks/${previousRating.consultantFeedback.id}`, consultantFeedbackRequest);
        }

        message.success({ content: 'Đã cập nhật đánh giá thành công!', key: "submitRating" });
      } else {
        // Tạo đánh giá mới (giữ nguyên code cũ)
        // 1. Đầu tiên, gửi đánh giá dịch vụ
        const serviceFeedbackRequest = {
          appointmentId: appointmentToRate.id,
          rating: values.serviceRating,
          comment: values.serviceComment || ""
        };

        // Gửi đánh giá dịch vụ và lấy response
        const serviceResponse = await api.post('/feedback', serviceFeedbackRequest);
        console.log("Service feedback response:", serviceResponse.data);

        // Lấy serviceFeedbackId từ response
        const serviceFeedbackId = serviceResponse.data.id;

        if (!serviceFeedbackId) {
          throw new Error("Không nhận được ID đánh giá dịch vụ từ server");
        }

        // 2. Sau đó, gửi đánh giá bác sĩ với serviceFeedbackId
        const consultantFeedbackRequest = {
          serviceFeedbackId: serviceFeedbackId,
          consultantId: appointmentToRate.doctorId || 2, // Sử dụng doctorId từ appointment nếu có
          rating: values.consultantRating,
          comment: values.consultantComment || ""
        };

        await api.post('/consultant-feedbacks', consultantFeedbackRequest);

        // 3. Cập nhật trạng thái đã đánh giá cho appointment
        await api.put(`/appointment/${appointmentToRate.id}/rate`, {
          isRated: true
        });

        message.success({ content: 'Cảm ơn bạn đã đánh giá!', key: "submitRating" });
      }

      setRatingModalVisible(false);
      setTimeout(() => setPreviousRating(null), 300);

      // Cập nhật lại danh sách cuộc hẹn
      fetchAppointments();
    } catch (error) {
      console.error('Error submitting ratings:', error);
      message.error({
        content: 'Có lỗi xảy ra khi gửi đánh giá: ' + (error.response?.data?.message || error.message),
        key: "submitRating"
      });
    }
  };

  // Cập nhật hàm fetch đánh giá cũ để phù hợp với API
  const fetchPreviousRating = async (appointmentId) => {
    try {
      message.loading({ content: "Đang tải đánh giá...", key: "ratingLoading" });
      console.log("Fetching previous rating for appointment:", appointmentId);

      // Bước 1: Lấy service feedback dựa trên appointment ID
      const serviceFeedbackResponse = await api.get(`/feedback/appointment/${appointmentId}`);
      console.log("Service feedback data:", serviceFeedbackResponse.data);

      if (!serviceFeedbackResponse.data || serviceFeedbackResponse.data.length === 0) {
        throw new Error("Không tìm thấy đánh giá dịch vụ");
      }

      // Lấy service feedback đầu tiên (hoặc duy nhất)
      const serviceFeedback = Array.isArray(serviceFeedbackResponse.data)
        ? serviceFeedbackResponse.data[0]
        : serviceFeedbackResponse.data;

      // Bước 2: Lấy consultant feedback dựa trên service feedback ID
      const consultantFeedbackResponse = await api.get(`/consultant-feedbacks/service-feedback/${serviceFeedback.id}`);
      console.log("Consultant feedback data:", consultantFeedbackResponse.data);

      // Tạo đối tượng previousRating với cấu trúc phù hợp
      const previousRating = {
        serviceFeedback: serviceFeedback,
        consultantFeedback: Array.isArray(consultantFeedbackResponse.data) && consultantFeedbackResponse.data.length > 0
          ? consultantFeedbackResponse.data[0]
          : null
      };

      console.log("Combined previous rating:", previousRating);

      // Lưu đánh giá cũ vào state
      setPreviousRating(previousRating);

      message.success({ content: "Đã tải đánh giá cũ", key: "ratingLoading", duration: 1 });
      setRatingModalVisible(true);
    } catch (error) {
      console.error('Error fetching previous rating:', error);
      message.error({
        content: 'Không thể tải đánh giá cũ: ' + (error.response?.data?.message || error.message),
        key: "ratingLoading",
        duration: 3
      });

      setPreviousRating(null);
      setRatingModalVisible(true);
    }
  };

  // Thêm useEffect để debug khi previousRating thay đổi
  useEffect(() => {
    if (previousRating) {
      console.log("Previous rating updated in Booking component:", previousRating);
    }
  }, [previousRating]);

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

              // Check for CONSULTING_ON service type in appointmentDetails array
              const isConsultingOnline =
                appointment.appointmentDetails?.some((detail) => {
                  console.log("🔍 [DEBUG] Checking detail:", detail);
                  console.log(
                    "🔍 [DEBUG] Detail serviceType:",
                    detail.serviceType
                  );
                  return detail.serviceType === "CONSULTING_ON";
                }) || false;

              const isConfirmed = appointment.status === "CONFIRMED";

              console.log("🎯 [DEBUG] isConsultingOnline:", isConsultingOnline);
              console.log("🎯 [DEBUG] isConfirmed:", isConfirmed);

              return isConsultingOnline && isConfirmed;
            })() && (
                <button
                  className={`zoom-button-profile ${blinkingButtons[appointment.id] ? "blinking" : ""
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

            {/* Thay đổi nút đánh giá để hiển thị "Sửa đánh giá" nếu đã đánh giá */}
            {appointment.status === "COMPLETED" && (
              <button
                className="rate-button"
                onClick={() => {
                  setAppointmentToRate(appointment);

                  console.log("Rating button clicked for appointment:", appointment.id, "isRated:", appointment.isRated);

                  // Nếu đã đánh giá, fetch dữ liệu đánh giá cũ trước
                  if (appointment.isRated === true || appointment.isRated === 1) {
                    fetchPreviousRating(appointment.id);
                  } else {
                    // Nếu chưa đánh giá, mở modal luôn
                    setPreviousRating(null);
                    setRatingModalVisible(true);
                  }
                }}
              >
                {appointment.isRated === true || appointment.isRated === 1 ? "Sửa đánh giá" : "Đánh giá dịch vụ"}
              </button>
            )}

            {/* Xóa badge "Đã đánh giá" vì đã thay thế bằng nút "Sửa đánh giá" */}
          </div>
        </div>
      </div>
    ));
  };
  const renderTabContent = () => renderAppointments();

  return (
    <div className="booking-container">
      <h2 className="booking-title-profile">Lịch sử đặt chỗ</h2>

      <div className="booking-tabs-profile">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button-profile ${activeTab === tab.key ? "active" : ""
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
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">
                        {selectedAppointment.id}
                      </span>
                    </div>
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

                  {/* Thông tin thanh toán */}
                  {/* <div className="detail-section">
                    <h3 className="section-title">Thông tin thanh toán</h3>

                    <div className="detail-item">
                      <span className="detail-label">
                        Trạng thái thanh toán:
                      </span>
                      <span className="detail-value">
                        {selectedAppointment.paymentStatus || "Chưa thanh toán"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Đã thanh toán:</span>
                      <span className="detail-value">
                        {selectedAppointment.isPaid === true
                          ? "Có"
                          : selectedAppointment.isPaid === false
                          ? "Chưa"
                          : "Không xác định"}
                      </span>
                    </div>
                  </div> */}

                  {/* Thông tin bổ sung */}
                  {/*  */}

                  {/* Thông tin bác sĩ chi tiết */}
                  {detail && (
                    <div className="detail-section">
                      <h3 className="section-title">Thông tin chi tiết</h3>
                      <div className="detail-item">
                        <span className="detail-label">ID Chi tiết:</span>
                        <span className="detail-value">{detail.id}</span>
                      </div>
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

      {/* Thêm banner thông báo cho các cuộc hẹn cần đánh giá */}
      {appointments.some(app => app.status === "COMPLETED" && !app.isRated) && (
        <div className="rating-reminder-banner">
          <Alert
            message="Bạn có dịch vụ cần đánh giá"
            description="Hãy đánh giá dịch vụ để giúp chúng tôi cải thiện chất lượng phục vụ."
            type="info"
            showIcon
            action={
              <Button
                type="primary"
                onClick={() => {
                  const appToRate = appointments.find(app => app.status === "COMPLETED" && !app.isRated);
                  setAppointmentToRate(appToRate);
                  setRatingModalVisible(true);
                }}
              >
                Đánh giá ngay
              </Button>
            }
          />
        </div>
      )}

      {/* Modal đánh giá */}
      <RatingModal
        visible={ratingModalVisible}
        appointment={appointmentToRate}
        previousRating={previousRating}
        onSubmit={handleSubmitRating}
        onCancel={() => {
          setRatingModalVisible(false);
          // Không reset previousRating ngay lập tức để tránh form bị reset
          setTimeout(() => setPreviousRating(null), 300);
        }}
      />
    </div>
  );
};

export default Booking;
