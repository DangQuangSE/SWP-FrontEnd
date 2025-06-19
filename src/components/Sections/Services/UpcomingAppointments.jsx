import React from "react";
import "./UpcomingAppointments.css"; // bạn sẽ tạo file CSS riêng

const UpcomingAppointments = ({ appointments = [] }) => {
  if (appointments.length === 0) {
    return (
      <div className="up-empty-state">
        <h3 className="up-empty-title">Không có lịch hẹn sắp đến</h3>
        <p className="up-empty-description">Đặt lịch với chuyên gia gần bạn</p>
        <button className="up-find-hospital-btn">Đăng kí khám bệnh</button>
      </div>
    );
  }

  return (
    <div className="up-appointments-wrapper">
      <table className="up-appointments-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Thời gian</th>
            <th>Dịch vụ</th>
            <th>Tư vấn viên</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, index) => (
            <tr key={index}>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.service}</td>
              <td>{appt.consultant}</td>
              <td
                className={`up-status ${appt.status
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                {appt.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingAppointments;
