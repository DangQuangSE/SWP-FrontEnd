import "./Notification.css";
import { Badge, Dropdown, Menu, Popconfirm } from "antd";
import { BellFilled, MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatDistanceToNow, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale';
import { useState, useRef, useEffect } from 'react';
import api from "../../../configs/api";

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Vừa xong';

    try {
        const date = parseISO(dateTimeString);
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (e) {
        console.error('Error parsing date:', e);
        return 'Vừa xong';
    }
};

const NotificationDropdown = ({
    notifications,
    loading,
    show,
    toggle,
    onClickNotification,
    loadMoreNotifications,
    setNotifications // Thêm prop để cập nhật danh sách thông báo
}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5);
    const notificationListRef = useRef(null);

    // Lọc thông báo dựa trên trạng thái active và tab đang chọn
    const activeNotifications = notifications.filter(n => {
        // Log để debug
        console.log(`Notification ${n.id}: isActive = ${n.isActive}`);

        // Kiểm tra chính xác giá trị isActive
        return n.isActive === true;
    });

    const filteredNotifications = activeTab === 'all'
        ? activeNotifications
        : activeNotifications.filter(n => !n.isRead);

    // Hiển thị số lượng thông báo giới hạn
    const visibleNotifications = filteredNotifications.slice(0, visibleCount);

    // Reset số lượng hiển thị khi chuyển tab
    useEffect(() => {
        setVisibleCount(5);
    }, [activeTab]);

    // Xử lý sự kiện cuộn để tải thêm thông báo
    const handleScroll = () => {
        if (!notificationListRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = notificationListRef.current;

        // Nếu đã cuộn gần đến cuối danh sách
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            // Tăng số lượng thông báo hiển thị
            if (visibleCount < filteredNotifications.length) {
                setVisibleCount(prev => prev + 5);
            }

            // Nếu đã hiển thị hết thông báo trong bộ nhớ, tải thêm từ server
            if (visibleCount >= filteredNotifications.length - 5 && loadMoreNotifications) {
                loadMoreNotifications();
            }
        }
    };

    // Xử lý xóa thông báo
    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài

        try {
            await api.delete(`/notifications/${notificationId}`);

            // Cập nhật state để xóa thông báo khỏi UI
            if (setNotifications) {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(n => n.id !== notificationId)
                );
            }

            console.log(`Đã xóa thông báo ID: ${notificationId}`);
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
        }
    };

    return (
        <div className="notification-icon">
            <Badge count={activeNotifications.filter(n => !n.isRead).length} size="large">
                <div className="notification-circle" onClick={toggle}>
                    <BellFilled />
                </div>
            </Badge>

            {show && (
                <div className="simple-notification-dropdown">
                    <div className="notification-header">
                        <h3>Thông báo</h3>
                    </div>

                    <div className="notification-tabs">
                        <button
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
                            onClick={() => setActiveTab('unread')}
                        >
                            Chưa đọc
                        </button>
                    </div>

                    {loading ? (
                        <div className="notification-loading">Đang tải...</div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="notification-empty">
                            {activeTab === 'all'
                                ? 'Không có thông báo nào'
                                : 'Không có thông báo chưa đọc'}
                        </div>
                    ) : (
                        <>
                            <div
                                className="notification-list"
                                ref={notificationListRef}
                                onScroll={handleScroll}
                            >
                                {visibleNotifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                                    >
                                        <div
                                            className="notification-content"
                                            onClick={() => onClickNotification(n)}
                                        >
                                            <h4 className="notification-title">{n.title || "đây là thông báo"}</h4>
                                            <p className="notification-message">{n.content || `test ${n.id}`}</p>
                                            <span className="notification-time">
                                                {formatDateTime(n.createdAt)}
                                            </span>
                                        </div>
                                        <div className="notification-actions">
                                            <Popconfirm
                                                title="Xóa thông báo này?"
                                                description="Bạn có chắc chắn muốn xóa thông báo này không?"
                                                onConfirm={(e) => handleDeleteNotification(e, n.id)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <button className="notification-action-button">
                                                    <MoreOutlined />
                                                </button>
                                            </Popconfirm>
                                        </div>
                                    </div>
                                ))}

                                {visibleCount < filteredNotifications.length && (
                                    <div className="notification-load-more">
                                        <button
                                            className="load-more-button"
                                            onClick={() => setVisibleCount(prev => prev + 5)}
                                        >
                                            Xem thêm thông báo trước đó
                                        </button>
                                    </div>
                                )}

                                {visibleCount >= filteredNotifications.length && loadMoreNotifications && (
                                    <div className="notification-load-more">
                                        <button
                                            className="load-more-button"
                                            onClick={loadMoreNotifications}
                                        >
                                            Tải thêm thông báo cũ hơn
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="notification-footer">
                                <button className="view-all-button" onClick={() => window.location.href = '/notifications'}>
                                    Xem thông báo trước đó
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
