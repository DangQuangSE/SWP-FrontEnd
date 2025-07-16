import React, { useEffect, useRef, useState } from 'react';
import { notification, Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import api from '../../configs/api';
import RatingModal from '../RatingModal/RatingModal';
import './RatingNotification.css';

const RatingNotification = () => {
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [appointmentToRate, setAppointmentToRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasShownRatingNotification = useRef(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  // Hàm callback khi đánh giá thành công
  const handleRatingSuccess = async () => {
    setRatingModalVisible(false);
    notificationApi.success({
      message: "Đánh giá thành công",
      description: "Cảm ơn bạn đã đánh giá dịch vụ!",
      duration: 3
    });
  };

  // Hàm mở modal đánh giá
  const openRatingModal = (appointment) => {
    console.log("Opening rating modal for appointment:", appointment);
    // Đảm bảo appointment có đủ thông tin cần thiết
    const enhancedAppointment = {
      ...appointment,
      // Thêm appointmentDetails nếu không có
      appointmentDetails: appointment.appointmentDetails || []
    };

    setAppointmentToRate(enhancedAppointment);
    // Đặt timeout ngắn để đảm bảo state được cập nhật trước khi hiển thị modal
    setTimeout(() => {
      setRatingModalVisible(true);
    }, 50);
  };

  // Fetch unrated completed appointments
  const fetchUnratedAppointments = async () => {
    if (hasShownRatingNotification.current) return;

    try {
      setLoading(true);
      console.log("Fetching completed appointments...");

      // Sử dụng endpoint by-status thay vì /unrated
      const response = await api.get('/appointment/by-status?status=COMPLETED');
      console.log("API response:", response);

      // Lọc các cuộc hẹn đã hoàn thành nhưng chưa đánh giá
      const unratedAppointments = response.data.filter(
        appointment => !appointment.isRated
      );

      console.log("Filtered unrated appointments:", unratedAppointments);

      if (unratedAppointments && unratedAppointments.length > 0) {
        // Lấy cuộc hẹn gần nhất cần đánh giá
        const appointmentToRate = unratedAppointments[0];
        console.log("Showing notification for appointment:", appointmentToRate);

        // Hiển thị thông báo
        const key = "rating-reminder";
        notificationApi.open({
          message: "Đánh giá dịch vụ",
          description: (
            <>
              <p>Bạn có {unratedAppointments.length} cuộc hẹn đã hoàn thành chưa được đánh giá.</p>
              <p><strong>Dịch vụ:</strong> {appointmentToRate.serviceName}</p>
              <p><strong>Ngày hẹn:</strong> {appointmentToRate.preferredDate}</p>
            </>
          ),
          icon: <StarOutlined style={{ color: "#faad14" }} />,
          duration: 0,
          placement: "topRight",
          btn: (
            <Button
              type="primary"
              onClick={() => {
                console.log("Rating button clicked");
                notificationApi.destroy(key);
                // Đảm bảo notification đóng trước khi mở modal
                setTimeout(() => {
                  openRatingModal(appointmentToRate);
                }, 300);
              }}
              className="rating-notification-btn"
            >
              Đánh giá ngay
            </Button>
          ),
          key: key
        });

        // Đánh dấu đã hiển thị thông báo
        hasShownRatingNotification.current = true;
      } else {
        console.log("No unrated appointments found");

        // Hiển thị thông báo giả lập để kiểm tra
        const mockAppointment = {
          id: "mock-id",
          serviceName: "test",
          preferredDate: "2025-07-04",
          status: "COMPLETED",
          isRated: false,
          appointmentDetails: [
            {
              consultantId: "mock-consultant-id",
              consultantName: "Dr. Test"
            }
          ]
        };

        const key = "mock-rating-reminder";
        notificationApi.open({
          message: "Đánh giá dịch vụ",
          description: (
            <>
              <p>Bạn có 1 cuộc hẹn đã hoàn thành chưa được đánh giá.</p>
              <p><strong>Dịch vụ:</strong> {mockAppointment.serviceName}</p>
              <p><strong>Ngày hẹn:</strong> {mockAppointment.preferredDate}</p>
            </>
          ),
          icon: <StarOutlined style={{ color: "#faad14" }} />,
          duration: 0,
          placement: "topRight",
          btn: (
            <Button
              type="primary"
              onClick={() => {
                console.log("Mock rating button clicked");
                notificationApi.destroy(key);
                // Đảm bảo notification đóng trước khi mở modal
                setTimeout(() => {
                  openRatingModal(mockAppointment);
                }, 300);
              }}
              className="rating-notification-btn"
            >
              Đánh giá ngay
            </Button>
          ),
          key: key
        });

        hasShownRatingNotification.current = true;
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn:", error);
      console.error("Error details:", error.response?.data || error.message);

      // Nếu API lỗi, hiển thị thông báo giả lập để kiểm tra
      const mockAppointment = {
        id: "mock-id",
        serviceName: "test",
        preferredDate: "2025-07-04",
        status: "COMPLETED",
        isRated: false,
        appointmentDetails: [
          {
            consultantId: "mock-consultant-id",
            consultantName: "Dr. Test"
          }
        ]
      };

      const key = "error-rating-reminder";
      notificationApi.open({
        message: "Đánh giá dịch vụ",
        description: (
          <>
            <p>Bạn có 1 cuộc hẹn đã hoàn thành chưa được đánh giá.</p>
            <p><strong>Dịch vụ:</strong> {mockAppointment.serviceName}</p>
            <p><strong>Ngày hẹn:</strong> {mockAppointment.preferredDate}</p>
          </>
        ),
        icon: <StarOutlined style={{ color: "#faad14" }} />,
        duration: 0,
        placement: "topRight",
        btn: (
          <Button
            type="primary"
            onClick={() => {
              console.log("Error mock rating button clicked");
              notificationApi.destroy(key);
              // Đảm bảo notification đóng trước khi mở modal
              setTimeout(() => {
                openRatingModal(mockAppointment);
              }, 300);
            }}
            className="rating-notification-btn"
          >
            Đánh giá ngay
          </Button>
        ),
        key: key
      });

      hasShownRatingNotification.current = true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch khi người dùng đã đăng nhập
    const token = localStorage.getItem('token');
    console.log("RatingNotification useEffect, token exists:", !!token);

    if (token) {
      // Gọi hàm fetch sau một khoảng thời gian ngắn
      setTimeout(() => {
        fetchUnratedAppointments();
      }, 3000); // 3 giây
    }
  }, []);

  // Thêm log để kiểm tra trạng thái modal
  console.log("Modal visible:", ratingModalVisible);
  console.log("Appointment to rate:", appointmentToRate);

  return (
    <>
      {contextHolder}
      {/* Modal đánh giá */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => {
          console.log("Closing rating modal");
          setRatingModalVisible(false);
        }}
        appointment={appointmentToRate}
        onSuccess={handleRatingSuccess}
      />
    </>
  );
};

export default RatingNotification;


