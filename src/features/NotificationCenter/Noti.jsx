import React from "react";
import "./Noti.css";

const Noti = ({ notifications = [], onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal-content notification-modal"
      style={{ maxWidth: 420, maxHeight: "70vh", overflowY: "auto" }}
      onClick={e => e.stopPropagation()}
    >
      <button
        className="modal-close-button"
        onClick={onClose}
        aria-label="Đóng"
      >
        ×
      </button>
      <h2 style={{ color: "#4f46e5", fontWeight: 700, marginBottom: 8 }}>
        Tất cả thông báo
      </h2>
      <div>
        {notifications.length === 0 && (
          <div style={{ color: "#888", margin: "16px 0" }}>
            Không có thông báo nào.
          </div>
        )}
        <ul style={{ paddingLeft: 18 }}>
          {notifications.map((noti, idx) => (
            <li key={idx} style={{ marginBottom: 12 }}>
              {noti}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Noti;