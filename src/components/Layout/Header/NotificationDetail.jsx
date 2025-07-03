import React from "react";
import { createPortal } from "react-dom";
import "./NotificationDetail.css";

const NotificationDetail = ({ visible, notification, onClose }) => {
    if (!visible || !notification) return null;

    // Sử dụng createPortal để render modal ra ngoài DOM hierarchy
    return createPortal(
        <div className="notification-detail-modal" onClick={onClose}>
            <div className="notification-detail-content" onClick={(e) => e.stopPropagation()}>
                <div className="notification-detail-header">
                    <h3>{notification.title || "Chi tiết thông báo"}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="notification-detail-body">
                    <p className="notification-detail-message">{notification.content}</p>

                    {notification.appointment && (
                        <div className="notification-appointment-info">
                            <h4>Thông tin cuộc hẹn</h4>
                            <p>Dịch vụ: {notification.appointment.serviceName}</p>
                            <p>Thời gian: {new Date(notification.appointment.appointmentTime).toLocaleString('vi-VN')}</p>
                            <p>Trạng thái: {notification.appointment.status}</p>
                        </div>
                    )}

                    {notification.cycleTracking && (
                        <div className="notification-cycle-info">
                            <h4>Thông tin chu kỳ</h4>
                            <p>Ngày dự kiến: {new Date(notification.cycleTracking.expectedDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                    )}

                    <div className="notification-detail-footer">
                        <span className="notification-time">
                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                        </span>
                    </div>
                </div>
            </div>
        </div>,
        document.body // Render trực tiếp vào body thay vì trong component cha
    );
};
export default NotificationDetail;

