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
  const [blinkingButtons, setBlinkingButtons] = useState({});
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
          appointment.serviceType === "CONSULTING_ON" ||
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

  // Rest of the component will be added in next part...
  return <div>Booking Component - Structure Fixed</div>;
};

export default Booking;
